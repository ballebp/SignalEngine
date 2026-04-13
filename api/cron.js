/**
 * Signal Engine — Headless Cron Worker
 * Runs every minute via Vercel cron. For each bot with autoSignal=true:
 *   1. Fetch recent Binance candles
 *   2. Run strategy simulation (AD1 / H9S / B5S)
 *   3. Compare latest signal time against last_fired in Supabase
 *   4. If new signal: optionally check AI gate, then fire to TradeRelay
 *   5. Write result to signal_log and update cron_state
 */

const SUPABASE_URL     = process.env.SUPABASE_URL;
const SUPABASE_KEY     = process.env.SUPABASE_SERVICE_KEY; // server-side service role key
const CRON_SECRET      = process.env.CRON_SECRET;          // shared secret to verify Vercel calls this
const OPENAI_KEY       = process.env.OPENAI_API_KEY;       // optional AI gate

// ── Supabase helpers ─────────────────────────────────────────────────────────

async function sbGet(table, filter = '') {
  const url = `${SUPABASE_URL}/rest/v1/${table}${filter ? '?' + filter : ''}`;
  const res = await fetch(url, { headers: sbHeaders() });
  if (!res.ok) throw new Error(`Supabase GET ${table}: ${res.status}`);
  return res.json();
}

async function sbUpsert(table, rows) {
  const url = `${SUPABASE_URL}/rest/v1/${table}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { ...sbHeaders(), 'Prefer': 'resolution=merge-duplicates' },
    body: JSON.stringify(Array.isArray(rows) ? rows : [rows]),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Supabase upsert ${table}: ${res.status} ${text}`);
  }
}

async function sbInsert(table, row) {
  const url = `${SUPABASE_URL}/rest/v1/${table}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: sbHeaders(),
    body: JSON.stringify(row),
  });
  // Non-blocking — ignore errors
}

function sbHeaders() {
  return {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
  };
}

// ── Binance fetch ─────────────────────────────────────────────────────────────

async function fetchCandles(symbol, interval, limit = 500) {
  const base = symbol.endsWith('.P') || symbol.endsWith('PERP')
    ? 'https://fapi.binance.com'
    : 'https://api.binance.com';
  const pair = symbol.replace('.P', '').replace('PERP', '');
  const url = `${base}/fapi/v1/klines?symbol=${pair}&interval=${interval}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) {
    // Try spot fallback
    const spotUrl = `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=${interval}&limit=${limit}`;
    const res2 = await fetch(spotUrl);
    if (!res2.ok) throw new Error(`Binance fetch failed for ${symbol}: ${res.status}`);
    return res2.json();
  }
  return res.json();
}

function parseCandles(rows) {
  return rows
    .map(r => ({
      time:  Math.floor(Number(r[0]) / 1000),
      open:  Number(r[1]),
      high:  Number(r[2]),
      low:   Number(r[3]),
      close: Number(r[4]),
    }))
    .filter(c => [c.time, c.open, c.high, c.low, c.close].every(Number.isFinite));
}

// ── Utility ───────────────────────────────────────────────────────────────────

function percentileRank(values, value) {
  if (!values.length) return 0;
  let count = 0;
  for (const v of values) if (v <= value) count++;
  return (count / values.length) * 100;
}

// ── AD1 Strategy ─────────────────────────────────────────────────────────────

function runAD1(candles, bot) {
  const tpPct = Number(bot.tp) / 100;
  const slPct = Number(bot.sl) / 100;
  const threshold = Number(bot.threshold);
  const scoreWindow = [];
  const closes = [];
  const signals = [];
  let position = null;

  for (let i = 0; i < candles.length; i++) {
    const bar = candles[i];
    closes.push(bar.close);

    if (i > 0) {
      const prev = candles[i - 1].close;
      const change = Math.abs((bar.close - prev) / Math.max(prev, 1e-9)) * 100;
      scoreWindow.push(change);
      if (scoreWindow.length > 200) scoreWindow.shift();
    }

    if (position && i > position.entryIndex) {
      const tpHit = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const slHit = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (tpHit || slHit) {
        signals.push({ time: bar.time, event: 'EXIT_ALL', dir: position.dir, kind: 'exit' });
        position = null;
      }
    }

    if (!position && scoreWindow.length >= 30) {
      const score = scoreWindow[scoreWindow.length - 1];
      const pct = percentileRank(scoreWindow.slice(-30), score);
      if (pct >= threshold) {
        const sma20 = closes.slice(-20).reduce((a, v) => a + v, 0) / Math.min(20, closes.length);
        const dir = bar.close >= sma20 ? 'long' : 'short';
        const entry = bar.close;
        position = {
          dir, entry,
          tp: dir === 'long' ? entry * (1 + tpPct) : entry * (1 - tpPct),
          sl: dir === 'long' ? entry * (1 - slPct) : entry * (1 + slPct),
          entryIndex: i,
        };
        const event = dir === 'long' ? 'ENTER_LONG' : 'ENTER_SHORT';
        signals.push({ time: bar.time, event, dir, kind: 'entry' });
      }
    }
  }
  return signals;
}

// ── H9S Strategy ──────────────────────────────────────────────────────────────

function runH9S(candles, bot) {
  const tpPct = Number(bot.tp) / 100;
  const slPct = Number(bot.sl) / 100;
  const swingSize = Math.max(2, Math.round(Number(bot.threshold) || 25));
  const useDynamic = (bot.tpType || 'dynamic') === 'dynamic';
  const useWicks   = (bot.bosConfType || 'close') === 'wicks';
  const slipMult   = Number(bot.slippage || 0) / 100;
  const signals = [];

  function atrAt(i) {
    const period = 30;
    if (i < 1) return candles[i].close * 0.02;
    let sum = 0, count = 0;
    for (let j = Math.max(1, i - period + 1); j <= i; j++) {
      const c = candles[j], p = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - p.close), Math.abs(c.low - p.close));
      count++;
    }
    return count > 0 ? sum / count : candles[i].close * 0.02;
  }

  let inTrade = false, isBull = false;
  let highAct = true, lowAct = true;
  let prevHigh = NaN, prevLow = NaN;
  let entryBar = -1, tpLvl = NaN, slLvl = NaN;
  let lastEntryBar = -1, lastExitBar = -1;

  for (let i = 0; i < candles.length; i++) {
    const bar = candles[i];
    const pivIdx = i - swingSize;
    if (pivIdx >= swingSize) {
      const pivot = candles[pivIdx];
      let isPivH = true, isPivL = true;
      for (let k = pivIdx - swingSize; k <= pivIdx + swingSize; k++) {
        if (k === pivIdx) continue;
        if (candles[k].high >= pivot.high) isPivH = false;
        if (candles[k].low  <= pivot.low)  isPivL = false;
      }
      if (isPivH) { prevHigh = pivot.high; highAct = true; }
      if (isPivL) { prevLow  = pivot.low;  lowAct  = true; }
    }

    if (inTrade) {
      if (!isNaN(prevHigh) && highAct && (useWicks ? bar.high > prevHigh : bar.close > prevHigh)) highAct = false;
      if (!isNaN(prevLow)  && lowAct  && (useWicks ? bar.low  < prevLow  : bar.close < prevLow))  lowAct  = false;

      let hitTP = isBull ? bar.high >= tpLvl : bar.low  <= tpLvl;
      let hitSL = isBull ? bar.low  <= slLvl : bar.high >= slLvl;
      if (hitTP && hitSL) {
        const dTP = Math.abs(bar.open - tpLvl), dSL = Math.abs(bar.open - slLvl);
        if (dTP <= dSL) hitSL = false; else hitTP = false;
      }
      if ((hitTP || hitSL) && lastExitBar !== i) {
        lastExitBar = i;
        inTrade = false;
        signals.push({ time: bar.time, event: 'EXIT_ALL', dir: isBull ? 'long' : 'short', kind: 'exit' });
      }
    }

    const canEnter = !inTrade && lastEntryBar !== i && lastExitBar !== i;
    if (canEnter && !isNaN(prevHigh) && !isNaN(prevLow)) {
      let bull = false, bear = false;
      if (useWicks) {
        if (bar.high > prevHigh && highAct)   { bull = true; highAct = false; }
        else if (bar.low < prevLow && lowAct) { bear = true; lowAct  = false; }
      } else {
        if (bar.close > prevHigh && highAct)     { bull = true; highAct = false; }
        else if (bar.close < prevLow && lowAct)  { bear = true; lowAct  = false; }
      }
      if (bull || bear) {
        lastEntryBar = i;
        inTrade = true;
        isBull  = bull;
        entryBar = i;
        const rawPx = useWicks ? (bull ? bar.high : bar.low) : bar.close;
        const entryPx = bull ? rawPx * (1 + slipMult) : rawPx * (1 - slipMult);
        const atr = atrAt(i);
        const dist  = useDynamic ? atr * 1.5 : entryPx * tpPct;
        const sdist = useDynamic ? atr * 1.5 : entryPx * slPct;
        tpLvl = bull ? entryPx + dist  : entryPx - dist;
        slLvl = bull ? entryPx - sdist : entryPx + sdist;
        signals.push({ time: bar.time, event: bull ? 'ENTER_LONG' : 'ENTER_SHORT', dir: bull ? 'long' : 'short', kind: 'entry' });
      }
    }
  }
  return signals;
}

// ── B5S Strategy ──────────────────────────────────────────────────────────────

function runB5S(candles, bot) {
  const tpPct = Number(bot.tp) / 100;
  const slPct = Number(bot.sl) / 100;
  const swingSize = Math.max(2, Math.round(Number(bot.threshold) || 25));
  const useDynamic = (bot.tpType || 'dynamic') === 'dynamic';
  const useWicks   = (bot.bosConfType || 'close') === 'wicks';
  const maxTrades  = Math.max(1, Math.min(10, Math.round(Number(bot.maxTrades) || 3)));
  const signals = [];

  let prevHigh = NaN, prevLow = NaN;
  let prevHighIdx = -1, prevLowIdx = -1;
  let highActive = false, lowActive = false;
  let pendingLong = false, pendingShort = false;
  let pendingLongBar = -1, pendingShortBar = -1;
  let pendingLongDist = NaN, pendingShortDist = NaN;
  let activeTrades = [];

  for (let i = 0; i < candles.length; i++) {
    const bar = candles[i];
    const pivIdx = i - swingSize;
    if (pivIdx >= swingSize) {
      const pivot = candles[pivIdx];
      let isPivH = true, isPivL = true;
      for (let k = pivIdx - swingSize; k <= pivIdx + swingSize; k++) {
        if (k === pivIdx) continue;
        if (candles[k].high >= pivot.high) isPivH = false;
        if (candles[k].low  <= pivot.low)  isPivL = false;
      }
      if (isPivH) { prevHigh = pivot.high; prevHighIdx = pivIdx; highActive = true; }
      if (isPivL) { prevLow  = pivot.low;  prevLowIdx  = pivIdx; lowActive  = true; }
    }

    const highSrc = useWicks ? bar.high : bar.close;
    const lowSrc  = useWicks ? bar.low  : bar.close;

    if (highSrc > prevHigh && highActive && !isNaN(prevHigh)) {
      highActive = false;
      const len = Math.max(1, Math.min(i - prevHighIdx, 100));
      let hi = -Infinity, lo = Infinity;
      for (let k = Math.max(0, i - len); k <= i; k++) {
        if (candles[k].high > hi) hi = candles[k].high;
        if (candles[k].low  < lo) lo = candles[k].low;
      }
      pendingLong = true; pendingLongBar = i; pendingLongDist = (hi - lo) / 2;
    }
    if (lowSrc < prevLow && lowActive && !isNaN(prevLow)) {
      lowActive = false;
      const len = Math.max(1, Math.min(i - prevLowIdx, 100));
      let hi = -Infinity, lo = Infinity;
      for (let k = Math.max(0, i - len); k <= i; k++) {
        if (candles[k].high > hi) hi = candles[k].high;
        if (candles[k].low  < lo) lo = candles[k].low;
      }
      pendingShort = true; pendingShortBar = i; pendingShortDist = (hi - lo) / 2;
    }

    if (pendingLong && i > pendingLongBar && activeTrades.length < maxTrades) {
      const entry = bar.open;
      const d = pendingLongDist;
      activeTrades.push({ dir: 'long', entry, tp: useDynamic ? entry + d : entry * (1 + tpPct), sl: useDynamic ? entry - d : entry * (1 - slPct), entryBar: i, entryTime: bar.time });
      signals.push({ time: bar.time, event: 'ENTER_LONG', dir: 'long', kind: 'entry' });
      pendingLong = false;
    }
    if (pendingShort && i > pendingShortBar && activeTrades.length < maxTrades) {
      const entry = bar.open;
      const d = pendingShortDist;
      activeTrades.push({ dir: 'short', entry, tp: useDynamic ? entry - d : entry * (1 - tpPct), sl: useDynamic ? entry + d : entry * (1 + slPct), entryBar: i, entryTime: bar.time });
      signals.push({ time: bar.time, event: 'ENTER_SHORT', dir: 'short', kind: 'entry' });
      pendingShort = false;
    }

    const remaining = [];
    for (const trade of activeTrades) {
      if (i <= trade.entryBar) { remaining.push(trade); continue; }
      let hitTP = trade.dir === 'long' ? bar.high >= trade.tp : bar.low  <= trade.tp;
      let hitSL = trade.dir === 'long' ? bar.low  <= trade.sl : bar.high >= trade.sl;
      if (hitTP && hitSL) {
        if (Math.abs(bar.open - trade.tp) <= Math.abs(bar.open - trade.sl)) hitSL = false; else hitTP = false;
      }
      if (hitTP || hitSL) {
        signals.push({ time: bar.time, event: 'EXIT_ALL', dir: trade.dir, kind: 'exit' });
      } else {
        remaining.push(trade);
      }
    }
    activeTrades = remaining;
  }
  return signals;
}

// ── AI1 Strategy — EMA(8/21) Cross + RSI Momentum ────────────────────────────

function runAI1(candles, bot) {
  const rsiPeriod = Math.max(5, Math.round(Number(bot.threshold || 14)));
  const tpMult    = Math.max(0.5, Number(bot.tp || 2.5));
  const slMult    = Math.max(0.3, Number(bot.sl || 1.2));

  function calcEma(data, period) {
    const k = 2 / (period + 1);
    let prev = NaN;
    return data.map(v => { prev = isNaN(prev) ? v : v * k + prev * (1 - k); return prev; });
  }

  function calcRsi(data, period) {
    const result = new Array(data.length).fill(NaN);
    if (data.length < period + 1) return result;
    let ag = 0, al = 0;
    for (let i = 1; i <= period; i++) {
      const d = data[i] - data[i - 1];
      if (d > 0) ag += d; else al -= d;
    }
    ag /= period; al /= period;
    result[period] = al === 0 ? 100 : 100 - 100 / (1 + ag / al);
    for (let i = period + 1; i < data.length; i++) {
      const d = data[i] - data[i - 1];
      ag = (ag * (period - 1) + Math.max(0, d))  / period;
      al = (al * (period - 1) + Math.max(0, -d)) / period;
      result[i] = al === 0 ? 100 : 100 - 100 / (1 + ag / al);
    }
    return result;
  }

  function atrAt(i) {
    const p = 14; if (i < 1) return candles[i].close * 0.015;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - p + 1); j <= i; j++) {
      const c = candles[j], prev = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - prev.close), Math.abs(c.low - prev.close)); n++;
    }
    return n > 0 ? sum / n : candles[i].close * 0.015;
  }

  const closes = candles.map(c => c.close);
  const emaF = calcEma(closes, 8);
  const emaS = calcEma(closes, 21);
  const rsi  = calcRsi(closes, rsiPeriod);
  const warmup = 21 + rsiPeriod + 2;
  const signals = [];
  let position = null;

  for (let i = warmup; i < candles.length; i++) {
    const bar = candles[i];
    if (position && i > position.entryIndex) {
      const hitTP = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const hitSL = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (hitTP || hitSL) { signals.push({ time: bar.time, event: 'EXIT_ALL', dir: position.dir, kind: 'exit' }); position = null; }
    }
    if (!position && !isNaN(rsi[i]) && !isNaN(emaF[i - 1])) {
      const crossUp   = emaF[i - 1] <= emaS[i - 1] && emaF[i] > emaS[i];
      const crossDown = emaF[i - 1] >= emaS[i - 1] && emaF[i] < emaS[i];
      const atr = atrAt(i);
      if (crossUp && rsi[i] >= 45 && rsi[i] <= 72) {
        position = { dir: 'long', tp: bar.close + atr * tpMult, sl: bar.close - atr * slMult, entryIndex: i };
        signals.push({ time: bar.time, event: 'ENTER_LONG', dir: 'long', kind: 'entry' });
      } else if (crossDown && rsi[i] >= 28 && rsi[i] <= 55) {
        position = { dir: 'short', tp: bar.close - atr * tpMult, sl: bar.close + atr * slMult, entryIndex: i };
        signals.push({ time: bar.time, event: 'ENTER_SHORT', dir: 'short', kind: 'entry' });
      }
    }
  }
  return signals;
}

// ── AI2 Strategy — Bollinger Band Squeeze Breakout ────────────────────────────

function runAI2(candles, bot) {
  const squeezePct = Math.max(5, Math.min(50, Number(bot.threshold || 25)));
  const tpMult     = Math.max(0.5, Number(bot.tp || 2.0));
  const slMult     = Math.max(0.3, Number(bot.sl || 1.0));
  const bbP = 20, bbSd = 2.0;

  function calcBB(idx) {
    if (idx < bbP - 1) return null;
    let sum = 0;
    for (let j = idx - bbP + 1; j <= idx; j++) sum += candles[j].close;
    const mean = sum / bbP;
    let v = 0;
    for (let j = idx - bbP + 1; j <= idx; j++) v += (candles[j].close - mean) ** 2;
    const sd = Math.sqrt(v / bbP);
    return { upper: mean + bbSd * sd, lower: mean - bbSd * sd, bw: mean > 0 ? sd * 2 * bbSd / mean : 0 };
  }

  function atrAt(i) {
    const p = 14; if (i < 1) return candles[i].close * 0.015;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - p + 1); j <= i; j++) {
      const c = candles[j], prev = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - prev.close), Math.abs(c.low - prev.close)); n++;
    }
    return n > 0 ? sum / n : candles[i].close * 0.015;
  }

  const bwHistory = [];
  const signals = [];
  let position = null;

  for (let i = 0; i < candles.length; i++) {
    const bar = candles[i];
    const bb  = calcBB(i);
    if (!bb) continue;
    bwHistory.push(bb.bw);
    if (bwHistory.length > 100) bwHistory.shift();

    if (position && i > position.entryIndex) {
      const hitTP = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const hitSL = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (hitTP || hitSL) { signals.push({ time: bar.time, event: 'EXIT_ALL', dir: position.dir, kind: 'exit' }); position = null; }
    }

    if (!position && bwHistory.length >= 30) {
      const bwRank = percentileRank(bwHistory, bb.bw);
      if (bwRank <= squeezePct) {
        const atr = atrAt(i);
        const barRange = bar.high - bar.low;
        if (bar.close > bb.upper && barRange > atr * 0.6) {
          position = { dir: 'long', tp: bar.close + atr * tpMult, sl: bar.close - atr * slMult, entryIndex: i };
          signals.push({ time: bar.time, event: 'ENTER_LONG', dir: 'long', kind: 'entry' });
        } else if (bar.close < bb.lower && barRange > atr * 0.6) {
          position = { dir: 'short', tp: bar.close - atr * tpMult, sl: bar.close + atr * slMult, entryIndex: i };
          signals.push({ time: bar.time, event: 'ENTER_SHORT', dir: 'short', kind: 'entry' });
        }
      }
    }
  }
  return signals;
}

// ── AI3 Strategy — MACD + Stochastic + SMA(200) Triple Confluence ─────────────

function runAI3(candles, bot) {
  const stochKP = Math.max(3, Math.round(Number(bot.threshold || 14)));
  const tpMult  = Math.max(0.5, Number(bot.tp || 2.5));
  const slMult  = Math.max(0.3, Number(bot.sl || 1.5));

  function calcEma(data, period) {
    const k = 2 / (period + 1); let prev = NaN;
    return data.map(v => { prev = isNaN(prev) ? v : v * k + prev * (1 - k); return prev; });
  }

  function calcSma(data, period) {
    const result = new Array(data.length).fill(NaN); let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i];
      if (i >= period) sum -= data[i - period];
      if (i >= period - 1) result[i] = sum / period;
    }
    return result;
  }

  function atrAt(i) {
    const p = 14; if (i < 1) return candles[i].close * 0.015;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - p + 1); j <= i; j++) {
      const c = candles[j], prev = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - prev.close), Math.abs(c.low - prev.close)); n++;
    }
    return n > 0 ? sum / n : candles[i].close * 0.015;
  }

  const closes = candles.map(c => c.close);
  const ema12  = calcEma(closes, 12);
  const ema26  = calcEma(closes, 26);
  const macdLn = ema12.map((v, i) => isNaN(v) || isNaN(ema26[i]) ? NaN : v - ema26[i]);
  const sigLn  = calcEma(macdLn.map(v => isNaN(v) ? 0 : v), 9);
  const hist   = macdLn.map((v, i) => isNaN(v) || isNaN(sigLn[i]) ? NaN : v - sigLn[i]);

  const stochKRaw = new Array(candles.length).fill(NaN);
  for (let i = stochKP - 1; i < candles.length; i++) {
    let lo = Infinity, hi = -Infinity;
    for (let j = i - stochKP + 1; j <= i; j++) { if (candles[j].low < lo) lo = candles[j].low; if (candles[j].high > hi) hi = candles[j].high; }
    stochKRaw[i] = hi > lo ? (candles[i].close - lo) / (hi - lo) * 100 : 50;
  }
  const stochK = calcSma(stochKRaw.map(v => isNaN(v) ? 50 : v), 3);
  const stochD = calcSma(stochK.map(v => isNaN(v) ? 50 : v), 3);
  const sma200 = calcSma(closes, 200);
  const warmup = 200 + 26 + 9 + stochKP + 10;
  const signals = [];
  let position = null;

  for (let i = warmup; i < candles.length; i++) {
    const bar = candles[i];
    if (position && i > position.entryIndex) {
      const hitTP = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const hitSL = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (hitTP || hitSL) { signals.push({ time: bar.time, event: 'EXIT_ALL', dir: position.dir, kind: 'exit' }); position = null; }
    }
    if (!position && !isNaN(sma200[i]) && !isNaN(hist[i]) && !isNaN(hist[i - 1])) {
      const aboveSma = bar.close > sma200[i];
      const histBull = hist[i - 1] < 0 && hist[i] >= 0;
      const histBear = hist[i - 1] > 0 && hist[i] <= 0;
      const sovrSold  = stochK[i] < 30 && stochK[i] > stochD[i];
      const sovrBght  = stochK[i] > 70 && stochK[i] < stochD[i];
      const atr = atrAt(i);
      if (aboveSma && histBull && sovrSold) {
        position = { dir: 'long', tp: bar.close + atr * tpMult, sl: bar.close - atr * slMult, entryIndex: i };
        signals.push({ time: bar.time, event: 'ENTER_LONG', dir: 'long', kind: 'entry' });
      } else if (!aboveSma && histBear && sovrBght) {
        position = { dir: 'short', tp: bar.close - atr * tpMult, sl: bar.close + atr * slMult, entryIndex: i };
        signals.push({ time: bar.time, event: 'ENTER_SHORT', dir: 'short', kind: 'entry' });
      }
    }
  }
  return signals;
}

// ── Signal code builder ───────────────────────────────────────────────────────

function signalCode(bot, event) {
  const code = bot.tradeRelayWebhookCode || bot.webhookKey || '';
  return `${event.replace(/_/g, '-')}_${code}`;
}

// ── TradeRelay fire ───────────────────────────────────────────────────────────

async function fireTradeRelay(url, code) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: code }),
  });
  return { ok: res.ok, status: res.status };
}

// ── AI confidence gate ────────────────────────────────────────────────────────

async function checkAiConfidence(candles, signal, threshold) {
  if (!OPENAI_KEY) return true; // no key = allow
  try {
    const recent = candles.slice(-20);
    const summary = recent.map(c => `O:${c.open.toFixed(2)} H:${c.high.toFixed(2)} L:${c.low.toFixed(2)} C:${c.close.toFixed(2)}`).join('\n');
    const prompt =
      `You are a professional crypto trader. Rate this ${signal.dir} trade setup from 0 to 100 based ONLY on the last 20 candles.\n` +
      `Signal: ${signal.event}\n\nLast 20 candles (oldest first):\n${summary}\n\n` +
      `Reply with ONLY: {"confidence": <integer 0-100>, "reason": "<one sentence>"}`;
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], max_tokens: 80, temperature: 0.2 }),
    });
    if (!res.ok) return true; // API error = allow through
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return true;
    const parsed = JSON.parse(match[0]);
    const conf = typeof parsed.confidence === 'number' ? parsed.confidence : 100;
    console.log(`AI gate: ${signal.event} confidence=${conf}% reason="${parsed.reason}"`);
    return conf >= threshold;
  } catch (e) {
    console.error('AI gate error:', e.message);
    return true; // error = allow through
  }
}

// ── Main cron handler ─────────────────────────────────────────────────────────

export default async function handler(req, res) {
  // Verify this is a legitimate Vercel cron call (or manual trigger with secret)
  const authHeader = req.headers['authorization'] || '';
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: 'Supabase env vars not set' });
  }

  const results = [];

  try {
    // Load all bot configs from Supabase
    const botRows = await sbGet('bots');
    const activeBots = botRows
      .map(r => r.config || {})
      .filter(cfg => cfg.id && cfg.autoSignal && cfg.tradeRelayUrl && cfg.symbol && cfg.timeframe);

    if (!activeBots.length) {
      return res.status(200).json({ ok: true, message: 'No active bots', results: [] });
    }

    // Load cron state for all active bots
    const botIds = activeBots.map(b => `id.in.(${activeBots.map(b => `"${b.id}"`).join(',')})`);
    const stateRows = await sbGet('cron_state', `bot_id=in.(${activeBots.map(b => `"${b.id}"`).join(',')})`).catch(() => []);
    const stateMap = Object.fromEntries(stateRows.map(r => [r.bot_id, r]));

    // Load AI gate settings from cron_settings
    const cronSettings = await sbGet('cron_settings').catch(() => []);
    const settingsMap = Object.fromEntries(cronSettings.map(r => [r.key, r.value]));
    const aiGateEnabled   = settingsMap['ai_gate_enabled'] === 'true';
    const aiGateThreshold = parseInt(settingsMap['ai_gate_threshold'] || '65', 10);

    for (const bot of activeBots) {
      const cronState = stateMap[bot.id] || { bot_id: bot.id, last_fired: 0 };
      const lastFired = Number(cronState.last_fired) || 0;

      try {
        // Fetch candles — enough for the strategy to warm up
        const rawRows = await fetchCandles(bot.symbol, bot.timeframe, 500);
        const candles  = parseCandles(rawRows);
        if (candles.length < 50) {
          results.push({ botId: bot.id, status: 'skip', reason: 'insufficient candles' });
          continue;
        }

        // Run strategy
        const strategy = bot.strategy || 'ad1';
        let signals = [];
        if (strategy === 'h9s')       signals = runH9S(candles, bot);
        else if (strategy === 'b5s')  signals = runB5S(candles, bot);
        else if (strategy === 'ai1')  signals = runAI1(candles, bot);
        else if (strategy === 'ai2')  signals = runAI2(candles, bot);
        else if (strategy === 'ai3')  signals = runAI3(candles, bot);
        else                          signals = runAD1(candles, bot);

        // Only process entry signals newer than last_fired
        const newSignals = signals.filter(s => s.kind === 'entry' && s.time > lastFired);

        if (!newSignals.length) {
          await sbUpsert('cron_state', { bot_id: bot.id, last_run: new Date().toISOString(), last_status: 'ok', last_message: 'No new signals' });
          results.push({ botId: bot.id, status: 'ok', signals: 0 });
          continue;
        }

        let fired = 0;
        let lastTime = lastFired;

        for (const signal of newSignals) {
          // AI confidence gate (server-side)
          if (aiGateEnabled) {
            const allowed = await checkAiConfidence(candles, signal, aiGateThreshold);
            if (!allowed) {
              lastTime = signal.time;
              await sbInsert('signal_log', { bot_id: bot.id, bot_name: bot.name, symbol: bot.symbol, event: signal.event, message: signalCode(bot, signal.event), status: 'ai_blocked' });
              results.push({ botId: bot.id, status: 'blocked', event: signal.event });
              continue;
            }
          }

          const code = signalCode(bot, signal.event);
          const { ok, status } = await fireTradeRelay(bot.tradeRelayUrl, code);
          lastTime = signal.time;
          fired++;

          await sbInsert('signal_log', {
            bot_id: bot.id, bot_name: bot.name, symbol: bot.symbol,
            event: signal.event, message: code, status: ok ? 'sent' : 'failed',
          });

          results.push({ botId: bot.id, event: signal.event, trStatus: status, ok });
        }

        await sbUpsert('cron_state', {
          bot_id: bot.id,
          last_fired: lastTime,
          last_run: new Date().toISOString(),
          last_status: 'ok',
          last_message: `Fired ${fired} signal(s)`,
        });

      } catch (botErr) {
        console.error(`Bot ${bot.id} error:`, botErr.message);
        await sbUpsert('cron_state', {
          bot_id: bot.id,
          last_run: new Date().toISOString(),
          last_status: 'error',
          last_message: botErr.message,
        }).catch(() => {});
        results.push({ botId: bot.id, status: 'error', error: botErr.message });
      }
    }

    return res.status(200).json({ ok: true, ran: activeBots.length, results });

  } catch (err) {
    console.error('Cron fatal error:', err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
