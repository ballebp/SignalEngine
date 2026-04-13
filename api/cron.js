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

// ── VW1 — VWAP Deviation Mean-Reversion ──────────────────────────────────────

function runVW1(candles, bot) {
  const devPct  = Math.max(5, Math.min(49, Number(bot.threshold || 20)));
  const tpMult  = Math.max(0.3, Number(bot.tp || 1.8));
  const slMult  = Math.max(0.2, Number(bot.sl || 0.9));
  const vwapWin = 100;

  function atrAt(i) {
    const p = 14; if (i < 1) return candles[i].close * 0.012;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - p + 1); j <= i; j++) {
      const c = candles[j], q = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - q.close), Math.abs(c.low - q.close)); n++;
    }
    return n ? sum / n : candles[i].close * 0.012;
  }

  function calcVwap(i) {
    let tpv = 0, vol = 0;
    for (let j = Math.max(0, i - vwapWin + 1); j <= i; j++) {
      const v = Math.max(candles[j].volume || 1, 1);
      tpv += ((candles[j].high + candles[j].low + candles[j].close) / 3) * v;
      vol += v;
    }
    return vol > 0 ? tpv / vol : candles[i].close;
  }

  const gapHistory = [];
  const signals = [];
  let position = null;

  for (let i = vwapWin; i < candles.length; i++) {
    const bar  = candles[i];
    const vwap = calcVwap(i);
    const gap  = (bar.close - vwap) / vwap * 100;
    gapHistory.push(gap);
    if (gapHistory.length > 200) gapHistory.shift();
    if (position && i > position.entryIndex) {
      const hitTP = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const hitSL = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (hitTP || hitSL) { signals.push({ time: bar.time, event: 'EXIT_ALL', dir: position.dir, kind: 'exit' }); position = null; }
    }
    if (!position && gapHistory.length >= 50) {
      const rank = percentileRank(gapHistory, gap);
      const atr  = atrAt(i);
      if (rank <= devPct && gap < 0) {
        position = { dir: 'long', tp: bar.close + atr * tpMult, sl: bar.close - atr * slMult, entryIndex: i };
        signals.push({ time: bar.time, event: 'ENTER_LONG', dir: 'long', kind: 'entry' });
      } else if (rank >= (100 - devPct) && gap > 0) {
        position = { dir: 'short', tp: bar.close - atr * tpMult, sl: bar.close + atr * slMult, entryIndex: i };
        signals.push({ time: bar.time, event: 'ENTER_SHORT', dir: 'short', kind: 'entry' });
      }
    }
  }
  return signals;
}

// ── KC1 — Keltner Channel Trend Breakout ──────────────────────────────────────

function runKC1(candles, bot) {
  const emaPeriod = Math.max(5, Math.round(Number(bot.threshold || 20)));
  const tpMult    = Math.max(0.5, Number(bot.tp || 2.2));
  const slMult    = Math.max(0.3, Number(bot.sl || 1.1));
  const atrMult   = 2.0;

  function calcEma(data, period) {
    const k = 2 / (period + 1); let prev = NaN;
    return data.map(v => { prev = isNaN(prev) ? v : v * k + prev * (1 - k); return prev; });
  }

  function atrAt(i) {
    const p = 14; if (i < 1) return candles[i].close * 0.015;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - p + 1); j <= i; j++) {
      const c = candles[j], q = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - q.close), Math.abs(c.low - q.close)); n++;
    }
    return n ? sum / n : candles[i].close * 0.015;
  }

  const ema = calcEma(candles.map(c => c.close), emaPeriod);
  const signals = [];
  let position = null;

  for (let i = emaPeriod + 16; i < candles.length; i++) {
    const bar = candles[i];
    const atr = atrAt(i);
    const upper = ema[i] + atrMult * atr;
    const lower = ema[i] - atrMult * atr;
    if (position && i > position.entryIndex) {
      const hitTP = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const hitSL = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (hitTP || hitSL) { signals.push({ time: bar.time, event: 'EXIT_ALL', dir: position.dir, kind: 'exit' }); position = null; }
    }
    if (!position) {
      const bullTrend = candles[i].close > candles[i-1].close && candles[i-1].close > candles[i-2].close;
      const bearTrend = candles[i].close < candles[i-1].close && candles[i-1].close < candles[i-2].close;
      if (bar.close > upper && bullTrend) {
        position = { dir: 'long', tp: bar.close + atr * tpMult, sl: bar.close - atr * slMult, entryIndex: i };
        signals.push({ time: bar.time, event: 'ENTER_LONG', dir: 'long', kind: 'entry' });
      } else if (bar.close < lower && bearTrend) {
        position = { dir: 'short', tp: bar.close - atr * tpMult, sl: bar.close + atr * slMult, entryIndex: i };
        signals.push({ time: bar.time, event: 'ENTER_SHORT', dir: 'short', kind: 'entry' });
      }
    }
  }
  return signals;
}

// ── DV1 — Donchian Velocity + Volume Surge ────────────────────────────────────

function runDV1(candles, bot) {
  const dcPeriod = Math.max(5, Math.round(Number(bot.threshold || 20)));
  const tpMult   = Math.max(0.5, Number(bot.tp || 2.0));
  const slMult   = Math.max(0.3, Number(bot.sl || 1.0));
  const volAvgP  = 20;

  function atrAt(i) {
    const p = 14; if (i < 1) return candles[i].close * 0.015;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - p + 1); j <= i; j++) {
      const c = candles[j], q = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - q.close), Math.abs(c.low - q.close)); n++;
    }
    return n ? sum / n : candles[i].close * 0.015;
  }

  const bodyBuf = [];
  const signals = [];
  let position = null;

  for (let i = dcPeriod + volAvgP + 5; i < candles.length; i++) {
    const bar  = candles[i];
    const body = Math.abs(bar.close - bar.open);
    bodyBuf.push(body); if (bodyBuf.length > 50) bodyBuf.shift();

    let dcHigh = -Infinity, dcLow = Infinity;
    for (let j = i - dcPeriod; j < i; j++) {
      if (candles[j].high > dcHigh) dcHigh = candles[j].high;
      if (candles[j].low  < dcLow)  dcLow  = candles[j].low;
    }
    let volSum = 0;
    for (let j = i - volAvgP; j < i; j++) volSum += Math.max(candles[j].volume || 1, 1);
    const volAvg = volSum / volAvgP;

    if (position && i > position.entryIndex) {
      const hitTP = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const hitSL = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (hitTP || hitSL) { signals.push({ time: bar.time, event: 'EXIT_ALL', dir: position.dir, kind: 'exit' }); position = null; }
    }
    if (!position && bodyBuf.length >= 20) {
      const bodyRank = percentileRank(bodyBuf, body);
      const volSurge = Math.max(bar.volume || 1, 1) > volAvg * 1.3;
      const atr = atrAt(i);
      if (bar.close > dcHigh && bar.close > bar.open && bodyRank >= 70 && volSurge) {
        position = { dir: 'long', tp: bar.close + atr * tpMult, sl: bar.close - atr * slMult, entryIndex: i };
        signals.push({ time: bar.time, event: 'ENTER_LONG', dir: 'long', kind: 'entry' });
      } else if (bar.close < dcLow && bar.close < bar.open && bodyRank >= 70 && volSurge) {
        position = { dir: 'short', tp: bar.close - atr * tpMult, sl: bar.close + atr * slMult, entryIndex: i };
        signals.push({ time: bar.time, event: 'ENTER_SHORT', dir: 'short', kind: 'entry' });
      }
    }
  }
  return signals;
}

// ── RS1 — Rate-of-Change Divergence Reversal ─────────────────────────────────

function runRS1(candles, bot) {
  const rocPeriod = Math.max(3, Math.round(Number(bot.threshold || 14)));
  const tpMult    = Math.max(0.5, Number(bot.tp || 2.5));
  const slMult    = Math.max(0.3, Number(bot.sl || 1.3));
  const swingWin  = 5;

  function calcRoc(i) {
    if (i < rocPeriod) return 0;
    const prev = candles[i - rocPeriod].close;
    return prev > 0 ? (candles[i].close - prev) / prev * 100 : 0;
  }

  function atrAt(i) {
    const p = 14; if (i < 1) return candles[i].close * 0.015;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - p + 1); j <= i; j++) {
      const c = candles[j], q = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - q.close), Math.abs(c.low - q.close)); n++;
    }
    return n ? sum / n : candles[i].close * 0.015;
  }

  const swingLows = [], swingHighs = [];
  const signals = [];
  let position = null;

  for (let i = rocPeriod + swingWin * 2 + 5; i < candles.length; i++) {
    const bar = candles[i];
    const roc = calcRoc(i);
    const pivIdx = i - swingWin;
    if (pivIdx >= swingWin) {
      const piv = candles[pivIdx];
      let isLow = true, isHigh = true;
      for (let k = pivIdx - swingWin; k <= pivIdx + swingWin; k++) {
        if (k === pivIdx) continue;
        if (candles[k].low  <= piv.low)  isLow  = false;
        if (candles[k].high >= piv.high) isHigh = false;
      }
      if (isLow)  { swingLows.push({ price: piv.low,   roc: calcRoc(pivIdx) }); if (swingLows.length  > 10) swingLows.shift(); }
      if (isHigh) { swingHighs.push({ price: piv.high, roc: calcRoc(pivIdx) }); if (swingHighs.length > 10) swingHighs.shift(); }
    }
    if (position && i > position.entryIndex) {
      const hitTP = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const hitSL = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (hitTP || hitSL) { signals.push({ time: bar.time, event: 'EXIT_ALL', dir: position.dir, kind: 'exit' }); position = null; }
    }
    if (!position && swingLows.length >= 2 && swingHighs.length >= 2) {
      const atr  = atrAt(i);
      const prevL = swingLows[swingLows.length - 1];
      const prevH = swingHighs[swingHighs.length - 1];
      if (bar.low < prevL.price && roc > prevL.roc && roc < 0) {
        position = { dir: 'long', tp: bar.close + atr * tpMult, sl: bar.close - atr * slMult, entryIndex: i };
        signals.push({ time: bar.time, event: 'ENTER_LONG', dir: 'long', kind: 'entry' });
      } else if (bar.high > prevH.price && roc < prevH.roc && roc > 0) {
        position = { dir: 'short', tp: bar.close - atr * tpMult, sl: bar.close + atr * slMult, entryIndex: i };
        signals.push({ time: bar.time, event: 'ENTER_SHORT', dir: 'short', kind: 'entry' });
      }
    }
  }
  return signals;
}

// ── E3 — Range Consolidation Breakout ────────────────────────────────────────

function runE3(candles, bot) {
  const rangePeriod = Math.max(5, Math.round(Number(bot.threshold || 20)));
  const confirmBars = Math.max(3, Math.round(rangePeriod / 4));
  const tpMult      = Math.max(0.5, Number(bot.tp || 2.2));
  const slMult      = Math.max(0.3, Number(bot.sl || 1.0));
  const volGate     = 1.2;
  const volAvgP     = 20;

  function atrAt(i) {
    const p = 14; if (i < 1) return candles[i].close * 0.012;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - p + 1); j <= i; j++) {
      const c = candles[j], q = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - q.close), Math.abs(c.low - q.close)); n++;
    }
    return n ? sum / n : candles[i].close * 0.012;
  }

  const signals = [];
  const warmup  = rangePeriod + confirmBars + volAvgP + 2;
  let position  = null;

  for (let i = warmup; i < candles.length; i++) {
    const bar = candles[i];
    let upper = -Infinity, lower = Infinity;
    for (let j = i - rangePeriod; j < i; j++) {
      if (candles[j].high > upper) upper = candles[j].high;
      if (candles[j].low  < lower) lower = candles[j].low;
    }
    let upperPrev = -Infinity, lowerPrev = Infinity;
    for (let j = i - rangePeriod - confirmBars; j < i - confirmBars; j++) {
      if (candles[j].high > upperPrev) upperPrev = candles[j].high;
      if (candles[j].low  < lowerPrev) lowerPrev = candles[j].low;
    }
    const rangeStable = Math.abs(upper - upperPrev) < upper * 0.002 &&
                        Math.abs(lower - lowerPrev) < lower * 0.002;
    let volSum = 0;
    for (let j = i - volAvgP; j < i; j++) volSum += Math.max(candles[j].volume || 1, 1);
    const volSurge = Math.max(bar.volume || 1, 1) > (volSum / volAvgP) * volGate;

    if (position && i > position.entryIndex) {
      const hitTP = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const hitSL = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (hitTP || hitSL) { signals.push({ time: bar.time, event: 'EXIT_ALL', dir: position.dir, kind: 'exit' }); position = null; }
    }
    if (!position && rangeStable && volSurge) {
      const atr = atrAt(i);
      if (bar.close > upper) {
        position = { dir: 'long', tp: bar.close + atr * tpMult, sl: bar.close - atr * slMult, entryIndex: i };
        signals.push({ time: bar.time, event: 'ENTER_LONG', dir: 'long', kind: 'entry' });
      } else if (bar.close < lower) {
        position = { dir: 'short', tp: bar.close - atr * tpMult, sl: bar.close + atr * slMult, entryIndex: i };
        signals.push({ time: bar.time, event: 'ENTER_SHORT', dir: 'short', kind: 'entry' });
      }
    }
  }
  return signals;
}

// ── CV1 — Cumulative Volume Delta ─────────────────────────────────────────────

function runCV1(candles, bot) {
  const cvdWindow = Math.max(5, Math.round(Number(bot.threshold || 20)));
  const tpMult    = Math.max(0.5, Number(bot.tp || 2.5));
  const slMult    = Math.max(0.3, Number(bot.sl || 1.2));

  function atrAt(i) {
    const p = 14; if (i < 1) return candles[i].close * 0.015;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - p + 1); j <= i; j++) {
      const c = candles[j], q = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - q.close), Math.abs(c.low - q.close)); n++;
    }
    return n ? sum / n : candles[i].close * 0.015;
  }

  function calcCVD(endIdx) {
    let cvd = 0;
    for (let j = Math.max(0, endIdx - cvdWindow + 1); j <= endIdx; j++) {
      const c = candles[j];
      cvd += c.close >= c.open ? Math.max(c.volume || 1, 1) : -Math.max(c.volume || 1, 1);
    }
    return cvd;
  }

  const signals = [];
  const warmup  = cvdWindow + 2;
  let position  = null;

  for (let i = warmup; i < candles.length; i++) {
    const bar  = candles[i];
    const cvd  = calcCVD(i);
    const cvdP = calcCVD(i - 1);

    if (position && i > position.entryIndex) {
      const hitTP = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const hitSL = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (hitTP || hitSL) { signals.push({ time: bar.time, event: 'EXIT_ALL', dir: position.dir, kind: 'exit' }); position = null; }
    }
    if (!position) {
      const atr = atrAt(i);
      if (cvdP <= 0 && cvd > 0) {
        position = { dir: 'long', tp: bar.close + atr * tpMult, sl: bar.close - atr * slMult, entryIndex: i };
        signals.push({ time: bar.time, event: 'ENTER_LONG', dir: 'long', kind: 'entry' });
      } else if (cvdP >= 0 && cvd < 0) {
        position = { dir: 'short', tp: bar.close - atr * tpMult, sl: bar.close + atr * slMult, entryIndex: i };
        signals.push({ time: bar.time, event: 'ENTER_SHORT', dir: 'short', kind: 'entry' });
      }
    }
  }
  return signals;
}

// ── CH1 — CHoCH Market Structure Break ───────────────────────────────────────

function runCH1(candles, bot) {
  const swingWin = Math.max(3, Math.round(Number(bot.threshold || 10)));
  const tpMult   = Math.max(0.5, Number(bot.tp || 3.0));
  const slMult   = Math.max(0.3, Number(bot.sl || 1.5));

  function atrAt(i) {
    const p = 14; if (i < 1) return candles[i].close * 0.015;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - p + 1); j <= i; j++) {
      const c = candles[j], q = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - q.close), Math.abs(c.low - q.close)); n++;
    }
    return n ? sum / n : candles[i].close * 0.015;
  }

  // Pre-compute confirmed pivots
  const pivotHighs = [], pivotLows = [];
  for (let i = swingWin; i < candles.length - swingWin; i++) {
    let isHigh = true, isLow = true;
    for (let k = i - swingWin; k <= i + swingWin; k++) {
      if (k === i) continue;
      if (candles[k].high >= candles[i].high) isHigh = false;
      if (candles[k].low  <= candles[i].low)  isLow  = false;
    }
    if (isHigh) pivotHighs.push({ idx: i, price: candles[i].high });
    if (isLow)  pivotLows.push( { idx: i, price: candles[i].low  });
  }

  const signals = [];
  let os = 0, phPtr = 0, plPtr = 0;
  let lastSwingHigh = null, lastSwingLow = null, position = null;
  const warmup = swingWin * 2 + 14;

  for (let i = warmup; i < candles.length; i++) {
    while (phPtr < pivotHighs.length && i >= pivotHighs[phPtr].idx + swingWin) {
      lastSwingHigh = pivotHighs[phPtr++];
    }
    while (plPtr < pivotLows.length  && i >= pivotLows[plPtr].idx  + swingWin) {
      lastSwingLow  = pivotLows[plPtr++];
    }
    const bar = candles[i];
    if (position && i > position.entryIndex) {
      const hitTP = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const hitSL = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (hitTP || hitSL) { signals.push({ time: bar.time, event: 'EXIT_ALL', dir: position.dir, kind: 'exit' }); position = null; os = 0; }
    }
    if (!position && lastSwingHigh && lastSwingLow) {
      const atr = atrAt(i);
      if (os <= 0 && bar.close > lastSwingHigh.price) {
        os = 1;
        position = { dir: 'long', tp: bar.close + atr * tpMult, sl: bar.close - atr * slMult, entryIndex: i };
        signals.push({ time: bar.time, event: 'ENTER_LONG', dir: 'long', kind: 'entry' });
      } else if (os >= 0 && bar.close < lastSwingLow.price) {
        os = -1;
        position = { dir: 'short', tp: bar.close - atr * tpMult, sl: bar.close + atr * slMult, entryIndex: i };
        signals.push({ time: bar.time, event: 'ENTER_SHORT', dir: 'short', kind: 'entry' });
      }
    }
  }
  return signals;
}

// ── PM1 — RSI/SMA Pivot Momentum ─────────────────────────────────────────────

function runPM1(candles, bot) {
  const rsiPeriod = Math.max(5, Math.round(Number(bot.threshold || 14)));
  const tpMult    = Math.max(0.5, Number(bot.tp || 2.0));
  const slMult    = Math.max(0.3, Number(bot.sl || 1.0));

  function calcATR(i) {
    const p = 14; if (i < 1) return candles[i].close * 0.015;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - p + 1); j <= i; j++) {
      const c = candles[j], q = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - q.close), Math.abs(c.low - q.close)); n++;
    }
    return n ? sum / n : candles[i].close * 0.015;
  }

  function calcRSI(endIdx) {
    const len = rsiPeriod;
    if (endIdx < len) return 50;
    let gains = 0, losses = 0;
    for (let j = endIdx - len + 1; j <= endIdx; j++) {
      const diff = candles[j].close - candles[j - 1].close;
      if (diff > 0) gains += diff; else losses -= diff;
    }
    const rs = losses === 0 ? 100 : gains / losses;
    return 100 - 100 / (1 + rs);
  }

  function calcRSISMA(endIdx) {
    let sum = 0;
    for (let j = endIdx - rsiPeriod + 1; j <= endIdx; j++) sum += calcRSI(j);
    return sum / rsiPeriod;
  }

  function calcSMA50(endIdx) {
    const len = 50;
    if (endIdx < len - 1) return candles[endIdx].close;
    let sum = 0;
    for (let j = endIdx - len + 1; j <= endIdx; j++) sum += candles[j].close;
    return sum / len;
  }

  const signals = [];
  const warmup  = rsiPeriod * 2 + 50 + 14;
  let position  = null;

  for (let i = warmup; i < candles.length; i++) {
    const bar = candles[i];
    const atr = calcATR(i);

    if (position && i > position.entryIndex) {
      const hitTP = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const hitSL = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (hitTP || hitSL) { signals.push({ time: bar.time, event: 'EXIT_ALL', dir: position.dir, kind: 'exit' }); position = null; }
    }
    if (!position) {
      const rsi      = calcRSI(i);
      const rsiPrev  = calcRSI(i - 1);
      const rsma     = calcRSISMA(i);
      const rsmaPrev = calcRSISMA(i - 1);
      const sma50    = calcSMA50(i);
      const inZone   = rsi >= 35 && rsi <= 65;

      if (rsiPrev <= rsmaPrev && rsi > rsma && inZone && bar.close >= sma50 - 1.5 * atr && bar.close <= sma50 + 3 * atr) {
        position = { dir: 'long', tp: bar.close + atr * tpMult, sl: bar.close - atr * slMult, entryIndex: i };
        signals.push({ time: bar.time, event: 'ENTER_LONG', dir: 'long', kind: 'entry' });
      } else if (rsiPrev >= rsmaPrev && rsi < rsma && inZone && bar.close <= sma50 + 1.5 * atr && bar.close >= sma50 - 3 * atr) {
        position = { dir: 'short', tp: bar.close - atr * tpMult, sl: bar.close + atr * slMult, entryIndex: i };
        signals.push({ time: bar.time, event: 'ENTER_SHORT', dir: 'short', kind: 'entry' });
      }
    }
  }
  return signals;
}

// ── OB1 — Order Block Retest ─────────────────────────────────────────────────

function runOB1(candles, bot) {
  const zigLen  = Math.max(3, Math.round(Number(bot.threshold || 9)));
  const tpMult  = Math.max(0.5, Number(bot.tp || 2.5));
  const slMult  = Math.max(0.3, Number(bot.sl || 1.2));
  const fibFact = 0.33;

  function calcATR(i) {
    const p = 14; if (i < 1) return candles[i].close * 0.015;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - p + 1); j <= i; j++) {
      const c = candles[j], q = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - q.close), Math.abs(c.low - q.close)); n++;
    }
    return n ? sum / n : candles[i].close * 0.015;
  }

  // Pre-compute confirmed pivots
  const pivotHighs = [], pivotLows = [];
  for (let i = zigLen; i < candles.length - zigLen; i++) {
    let isHi = true, isLo = true;
    for (let k = i - zigLen; k <= i + zigLen; k++) {
      if (k === i) continue;
      if (candles[k].high >= candles[i].high) isHi = false;
      if (candles[k].low  <= candles[i].low)  isLo = false;
    }
    if (isHi) pivotHighs.push({ idx: i, price: candles[i].high });
    if (isLo)  pivotLows.push({ idx: i, price: candles[i].low  });
  }

  const recentHighs = [], recentLows = [];
  let phPtr = 0, plPtr = 0, market = 0;
  let bullOB = null, bearOB = null, position = null;
  const signals  = [];
  const warmup   = zigLen * 2 + 14 + 5;

  for (let i = warmup; i < candles.length; i++) {
    while (phPtr < pivotHighs.length && i >= pivotHighs[phPtr].idx + zigLen) {
      recentHighs.push(pivotHighs[phPtr++]);
      if (recentHighs.length > 2) recentHighs.shift();
    }
    while (plPtr < pivotLows.length && i >= pivotLows[plPtr].idx + zigLen) {
      recentLows.push(pivotLows[plPtr++]);
      if (recentLows.length > 2) recentLows.shift();
    }

    const bar = candles[i];

    if (position && i > position.entryIndex) {
      const hitTP = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const hitSL = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (hitTP || hitSL) {
        signals.push({ time: bar.time, event: 'EXIT_ALL', dir: position.dir, kind: 'exit' });
        position = null; bullOB = null; bearOB = null;
      }
    }

    if (recentHighs.length >= 2 && recentLows.length >= 2) {
      const h0 = recentHighs[recentHighs.length - 1], h1 = recentHighs[recentHighs.length - 2];
      const l0 = recentLows[recentLows.length - 1],  l1 = recentLows[recentLows.length - 2];
      if (market <= 0 && h0.price > h1.price && h0.price > h1.price + Math.abs(h1.price - l0.price) * fibFact) {
        market = 1;
        const s = Math.min(h1.idx, l0.idx), e = Math.max(h1.idx, l0.idx);
        let obIdx = -1;
        for (let k = s; k <= e; k++) { if (candles[k].open > candles[k].close) obIdx = k; }
        bullOB = obIdx >= 0 ? { obHigh: candles[obIdx].high, obLow: candles[obIdx].low } : null;
        bearOB = null;
      } else if (market >= 0 && l0.price < l1.price && l0.price < l1.price - Math.abs(h0.price - l1.price) * fibFact) {
        market = -1;
        const s = Math.min(l1.idx, h0.idx), e = Math.max(l1.idx, h0.idx);
        let obIdx = -1;
        for (let k = s; k <= e; k++) { if (candles[k].open < candles[k].close) obIdx = k; }
        bearOB = obIdx >= 0 ? { obHigh: candles[obIdx].high, obLow: candles[obIdx].low } : null;
        bullOB = null;
      }
    }

    if (bullOB && bar.close < bullOB.obLow)  bullOB = null;
    if (bearOB && bar.close > bearOB.obHigh) bearOB = null;

    if (!position) {
      const atr = calcATR(i);
      if (bullOB && bar.close >= bullOB.obLow && bar.close <= bullOB.obHigh) {
        position = { dir: 'long', tp: bar.close + atr * tpMult, sl: bar.close - atr * slMult, entryIndex: i };
        signals.push({ time: bar.time, event: 'ENTER_LONG', dir: 'long', kind: 'entry' });
        bullOB = null;
      } else if (bearOB && bar.close >= bearOB.obLow && bar.close <= bearOB.obHigh) {
        position = { dir: 'short', tp: bar.close - atr * tpMult, sl: bar.close + atr * slMult, entryIndex: i };
        signals.push({ time: bar.time, event: 'ENTER_SHORT', dir: 'short', kind: 'entry' });
        bearOB = null;
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

// ── FG1 — CVD + FVG Retracement ─────────────────────────────────────────────

function runFG1(candles, bot) {
  const cvdLen  = Math.max(5, Math.round(Number(bot.threshold || 20)));
  const tpMult  = Math.max(0.5, Number(bot.tp || 2.0));
  const slMult  = Math.max(0.3, Number(bot.sl || 1.5));

  function calcATR(i) {
    const p = 14; if (i < 1) return candles[i].close * 0.015;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - p + 1); j <= i; j++) {
      const c = candles[j], q = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - q.close), Math.abs(c.low - q.close)); n++;
    }
    return n ? sum / n : candles[i].close * 0.015;
  }

  function calcCVD(endIdx) {
    let cvd = 0;
    for (let j = Math.max(0, endIdx - cvdLen + 1); j <= endIdx; j++) {
      const c = candles[j];
      cvd += c.close >= c.open ? Math.max(c.volume || 1, 1) : -Math.max(c.volume || 1, 1);
    }
    return cvd;
  }

  const signals  = [];
  const warmup   = cvdLen + 14 + 5;
  let position   = null;
  let fvgZone    = null;
  let signalDir  = null;

  for (let i = warmup; i < candles.length; i++) {
    const bar  = candles[i];
    const atr  = calcATR(i);
    const cvd  = calcCVD(i);
    const cvdP = calcCVD(i - 1);

    if (position && i > position.entryIndex) {
      const hitTP = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const hitSL = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (hitTP || hitSL) {
        signals.push({ time: bar.time, event: 'EXIT_ALL', dir: position.dir, kind: 'exit' });
        position = null; fvgZone = null; signalDir = null;
      }
    }

    if (!position) {
      if (cvdP <= 0 && cvd > 0) { signalDir = 'long';  fvgZone = null; }
      if (cvdP >= 0 && cvd < 0) { signalDir = 'short'; fvgZone = null; }
    }

    if (!position && signalDir && !fvgZone && i >= 2) {
      const c0 = candles[i], c2 = candles[i - 2];
      if (signalDir === 'long'  && c2.high < c0.low && (c0.low - c2.high) > atr * 0.2) {
        fvgZone = { dir: 'long',  top: c0.low,  bottom: c2.high };
      } else if (signalDir === 'short' && c2.low > c0.high && (c2.low - c0.high) > atr * 0.2) {
        fvgZone = { dir: 'short', top: c2.low,  bottom: c0.high };
      }
    }

    if (fvgZone && !position) {
      if (fvgZone.dir === 'long'  && bar.close < fvgZone.bottom) fvgZone = null;
      if (fvgZone.dir === 'short' && bar.close > fvgZone.top)    fvgZone = null;
    }

    if (!position && fvgZone && bar.close >= fvgZone.bottom && bar.close <= fvgZone.top) {
      if (fvgZone.dir === 'long') {
        position = { dir: 'long',  tp: bar.close + atr * tpMult, sl: bar.close - atr * slMult, entryIndex: i };
        signals.push({ time: bar.time, event: 'ENTER_LONG',  dir: 'long',  kind: 'entry' });
      } else {
        position = { dir: 'short', tp: bar.close - atr * tpMult, sl: bar.close + atr * slMult, entryIndex: i };
        signals.push({ time: bar.time, event: 'ENTER_SHORT', dir: 'short', kind: 'entry' });
      }
      fvgZone = null; signalDir = null;
    }
  }
  return signals;
}

// ── SM1 — Smart Money BOS ─────────────────────────────────────────────────────

function runSM1(candles, bot) {
  const swingSize = Math.max(3, Math.round(Number(bot.threshold || 25)));
  const tpMult    = Math.max(0.5, Number(bot.tp || 2.0));
  const slMult    = Math.max(0.3, Number(bot.sl || 1.0));

  function calcATR(i) {
    const p = 14; if (i < 1) return candles[i].close * 0.015;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - p + 1); j <= i; j++) {
      const c = candles[j], q = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - q.close), Math.abs(c.low - q.close)); n++;
    }
    return n ? sum / n : candles[i].close * 0.015;
  }

  const pivotHighs = [], pivotLows = [];
  for (let i = swingSize; i < candles.length - swingSize; i++) {
    let isHi = true, isLo = true;
    for (let k = i - swingSize; k <= i + swingSize; k++) {
      if (k === i) continue;
      if (candles[k].high >= candles[i].high) isHi = false;
      if (candles[k].low  <= candles[i].low)  isLo = false;
    }
    if (isHi) pivotHighs.push({ idx: i, price: candles[i].high });
    if (isLo)  pivotLows.push({ idx: i, price: candles[i].low  });
  }

  const signals = [];
  let prevHigh = null, prevLow = null;
  let prevHighActive = false, prevLowActive = false;
  let prevHighIdx = 0, prevLowIdx = 0;
  let phPtr = 0, plPtr = 0, position = null;
  const warmup = swingSize * 2 + 14;

  for (let i = warmup; i < candles.length; i++) {
    while (phPtr < pivotHighs.length && i >= pivotHighs[phPtr].idx + swingSize) {
      prevHigh = pivotHighs[phPtr].price;
      prevHighIdx = pivotHighs[phPtr].idx;
      prevHighActive = true;
      phPtr++;
    }
    while (plPtr < pivotLows.length && i >= pivotLows[plPtr].idx + swingSize) {
      prevLow = pivotLows[plPtr].price;
      prevLowIdx = pivotLows[plPtr].idx;
      prevLowActive = true;
      plPtr++;
    }
    const bar = candles[i];
    if (position && i > position.entryIndex) {
      const hitTP = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const hitSL = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (hitTP || hitSL) {
        signals.push({ time: bar.time, event: 'EXIT_ALL', dir: position.dir, kind: 'exit' });
        position = null;
      }
    }
    if (!position) {
      const atr = calcATR(i);
      if (prevHighActive && prevHigh !== null && bar.close > prevHigh) {
        prevHighActive = false;
        let legHigh = -Infinity, legLow = Infinity;
        for (let k = prevHighIdx; k <= i; k++) {
          if (candles[k].high > legHigh) legHigh = candles[k].high;
          if (candles[k].low  < legLow)  legLow  = candles[k].low;
        }
        const dist = Math.max(legHigh - legLow, atr) / 3;
        position = { dir: 'long',  tp: bar.close + dist * tpMult, sl: bar.close - dist * slMult, entryIndex: i };
        signals.push({ time: bar.time, event: 'ENTER_LONG',  dir: 'long',  kind: 'entry' });
      } else if (prevLowActive && prevLow !== null && bar.close < prevLow) {
        prevLowActive = false;
        let legHigh = -Infinity, legLow = Infinity;
        for (let k = prevLowIdx; k <= i; k++) {
          if (candles[k].high > legHigh) legHigh = candles[k].high;
          if (candles[k].low  < legLow)  legLow  = candles[k].low;
        }
        const dist = Math.max(legHigh - legLow, atr) / 3;
        position = { dir: 'short', tp: bar.close - dist * tpMult, sl: bar.close + dist * slMult, entryIndex: i };
        signals.push({ time: bar.time, event: 'ENTER_SHORT', dir: 'short', kind: 'entry' });
      }
    }
  }
  return signals;
}

function runSB1(candles, bot) {
  const swingSize = Math.max(3, Math.round(Number(bot.threshold || 25)));
  const tpMult    = Math.max(0.5, Number(bot.tp || 2.0));
  const slMult    = Math.max(0.3, Number(bot.sl || 1.0));

  function calcATR(i) {
    const p = 14; if (i < 1) return candles[i].close * 0.015;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - p + 1); j <= i; j++) {
      const c = candles[j], q = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - q.close), Math.abs(c.low - q.close)); n++;
    }
    return n ? sum / n : candles[i].close * 0.015;
  }

  const pivotHighs = [], pivotLows = [];
  for (let i = swingSize; i < candles.length - swingSize; i++) {
    let isHi = true, isLo = true;
    for (let k = i - swingSize; k <= i + swingSize; k++) {
      if (k === i) continue;
      if (candles[k].high >= candles[i].high) isHi = false;
      if (candles[k].low  <= candles[i].low)  isLo = false;
    }
    if (isHi) pivotHighs.push({ idx: i, price: candles[i].high });
    if (isLo)  pivotLows.push({ idx: i, price: candles[i].low  });
  }

  const signals = [];
  let prevHigh = null, prevLow = null;
  let prevHighActive = false, prevLowActive = false;
  let prevHighIdx = 0, prevLowIdx = 0;
  let phPtr = 0, plPtr = 0, position = null;
  const warmup = swingSize * 2 + 14;

  for (let i = warmup; i < candles.length; i++) {
    while (phPtr < pivotHighs.length && i >= pivotHighs[phPtr].idx + swingSize) {
      prevHigh = pivotHighs[phPtr].price;
      prevHighIdx = pivotHighs[phPtr].idx;
      prevHighActive = true;
      phPtr++;
    }
    while (plPtr < pivotLows.length && i >= pivotLows[plPtr].idx + swingSize) {
      prevLow = pivotLows[plPtr].price;
      prevLowIdx = pivotLows[plPtr].idx;
      prevLowActive = true;
      plPtr++;
    }
    const bar = candles[i];
    const highSrc = bar.close;
    let highBroken = false, lowBroken = false;
    if (prevHighActive && prevHigh !== null && highSrc > prevHigh) { highBroken = true; prevHighActive = false; }
    if (prevLowActive  && prevLow  !== null && highSrc < prevLow)  { lowBroken  = true; prevLowActive  = false; }

    // Flip exit
    if (position && highBroken && position.dir === 'short') {
      signals.push({ time: bar.time, event: 'EXIT_ALL', dir: 'short', kind: 'exit' });
      position = null;
    }
    if (position && lowBroken && position.dir === 'long') {
      signals.push({ time: bar.time, event: 'EXIT_ALL', dir: 'long', kind: 'exit' });
      position = null;
    }

    if (position && i > position.entryIndex) {
      const hitTP = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const hitSL = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (hitTP || hitSL) {
        signals.push({ time: bar.time, event: 'EXIT_ALL', dir: position.dir, kind: 'exit' });
        position = null;
      }
    }

    if (!position) {
      if (highBroken && prevHigh !== null) {
        const atr = calcATR(i);
        let legHigh = -Infinity, legLow = Infinity;
        for (let k = prevHighIdx; k <= i; k++) {
          if (candles[k].high > legHigh) legHigh = candles[k].high;
          if (candles[k].low  < legLow)  legLow  = candles[k].low;
        }
        const dist = Math.max(legHigh - legLow, atr) / 3;
        position = { dir: 'long',  tp: prevHigh + dist * tpMult, sl: prevHigh - dist * slMult, entryIndex: i };
        signals.push({ time: bar.time, event: 'ENTER_LONG',  dir: 'long',  kind: 'entry' });
      } else if (lowBroken && prevLow !== null) {
        const atr = calcATR(i);
        let legHigh = -Infinity, legLow = Infinity;
        for (let k = prevLowIdx; k <= i; k++) {
          if (candles[k].high > legHigh) legHigh = candles[k].high;
          if (candles[k].low  < legLow)  legLow  = candles[k].low;
        }
        const dist = Math.max(legHigh - legLow, atr) / 3;
        position = { dir: 'short', tp: prevLow - dist * tpMult, sl: prevLow + dist * slMult, entryIndex: i };
        signals.push({ time: bar.time, event: 'ENTER_SHORT', dir: 'short', kind: 'entry' });
      }
    }
  }
  return signals;
}

function runST1(candles, bot) {
  const stPeriod = Math.max(5, Math.round(Number(bot.threshold || 14)));
  const stFactor = 3.0;
  const slFactor = Math.max(0.5, Number(bot.sl  || 1.4));
  const tpMult   = Math.max(0.5, Number(bot.tp  || 2.0));

  function calcATR(i) {
    if (i < 1) return candles[i].close * 0.015;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - stPeriod + 1); j <= i; j++) {
      const c = candles[j], q = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - q.close), Math.abs(c.low - q.close)); n++;
    }
    return n ? sum / n : candles[i].close * 0.015;
  }

  const stDir     = new Array(candles.length).fill(1);
  const upperBand = new Array(candles.length).fill(0);
  const lowerBand = new Array(candles.length).fill(0);
  for (let i = 0; i < candles.length; i++) {
    const atr = calcATR(i);
    const hl2 = (candles[i].high + candles[i].low) / 2;
    const rawUB = hl2 + stFactor * atr;
    const rawLB = hl2 - stFactor * atr;
    if (i === 0) { upperBand[i] = rawUB; lowerBand[i] = rawLB; stDir[i] = 1; continue; }
    const prevClose = candles[i - 1].close;
    upperBand[i] = rawUB < upperBand[i-1] || prevClose > upperBand[i-1] ? rawUB : upperBand[i-1];
    lowerBand[i] = rawLB > lowerBand[i-1] || prevClose < lowerBand[i-1] ? rawLB : lowerBand[i-1];
    const prevDir = stDir[i - 1];
    if (prevDir === 1)  stDir[i] = candles[i].close > upperBand[i] ? -1 : 1;
    else                stDir[i] = candles[i].close < lowerBand[i] ?  1 : -1;
  }

  const signals = [];
  let position = null;
  const warmup = stPeriod * 2;

  for (let i = warmup; i < candles.length; i++) {
    const bar  = candles[i];
    const dist = calcATR(i) * slFactor;
    if (position && i > position.entryIndex) {
      const hitTP = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const hitSL = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (hitTP || hitSL) {
        signals.push({ time: bar.time, event: 'EXIT_ALL', dir: position.dir, kind: 'exit' });
        position = null;
      }
    }
    if (!position) {
      const prevDir = stDir[i - 1];
      const curDir  = stDir[i];
      if (prevDir === 1 && curDir === -1) {
        const entry = bar.close;
        position = { dir: 'long',  tp: entry + dist * tpMult, sl: entry - dist, entryIndex: i };
        signals.push({ time: bar.time, event: 'ENTER_LONG',  dir: 'long',  kind: 'entry' });
      } else if (prevDir === -1 && curDir === 1) {
        const entry = bar.close;
        position = { dir: 'short', tp: entry - dist * tpMult, sl: entry + dist, entryIndex: i };
        signals.push({ time: bar.time, event: 'ENTER_SHORT', dir: 'short', kind: 'entry' });
      }
    }
  }
  return signals;
}

function runMN1(candles, bot) {
  const swingSize = Math.max(3, Math.round(Number(bot.threshold || 25)));
  const tpMult    = Math.max(0.5, Number(bot.tp || 2.0));
  const slMult    = Math.max(0.3, Number(bot.sl || 1.0));

  function calcATR(i) {
    const p = 14; if (i < 1) return candles[i].close * 0.015;
    let sum = 0, n = 0;
    for (let j = Math.max(1, i - p + 1); j <= i; j++) {
      const c = candles[j], q = candles[j - 1];
      sum += Math.max(c.high - c.low, Math.abs(c.high - q.close), Math.abs(c.low - q.close)); n++;
    }
    return n ? sum / n : candles[i].close * 0.015;
  }

  const pivotHighs = [], pivotLows = [];
  for (let i = swingSize; i < candles.length - swingSize; i++) {
    let isHi = true, isLo = true;
    for (let k = i - swingSize; k <= i + swingSize; k++) {
      if (k === i) continue;
      if (candles[k].high >= candles[i].high) isHi = false;
      if (candles[k].low  <= candles[i].low)  isLo = false;
    }
    if (isHi) pivotHighs.push({ idx: i, price: candles[i].high });
    if (isLo)  pivotLows.push({ idx: i, price: candles[i].low  });
  }

  const signals = [];
  let prevHigh = null, prevLow = null;
  let prevHighActive = false, prevLowActive = false;
  let prevHighIdx = 0, prevLowIdx = 0;
  let phPtr = 0, plPtr = 0;
  let pending = null;
  let position = null;
  const warmup = swingSize * 2 + 14;

  for (let i = warmup; i < candles.length; i++) {
    while (phPtr < pivotHighs.length && i >= pivotHighs[phPtr].idx + swingSize) {
      prevHigh = pivotHighs[phPtr].price;
      prevHighIdx = pivotHighs[phPtr].idx;
      prevHighActive = true;
      phPtr++;
    }
    while (plPtr < pivotLows.length && i >= pivotLows[plPtr].idx + swingSize) {
      prevLow = pivotLows[plPtr].price;
      prevLowIdx = pivotLows[plPtr].idx;
      prevLowActive = true;
      plPtr++;
    }
    const bar = candles[i];
    const atr = calcATR(i);
    if (position && i > position.entryIndex) {
      const hitTP = position.dir === 'long' ? bar.high >= position.tp : bar.low  <= position.tp;
      const hitSL = position.dir === 'long' ? bar.low  <= position.sl : bar.high >= position.sl;
      if (hitTP || hitSL) {
        signals.push({ time: bar.time, event: 'EXIT_ALL', dir: position.dir, kind: 'exit' });
        position = null;
        pending  = null;
      }
    }
    if (!position) {
      if (prevHighActive && prevHigh !== null && bar.close > prevHigh) {
        prevHighActive = false;
        let legHigh = -Infinity, legLow = Infinity;
        for (let k = prevHighIdx; k <= i; k++) {
          if (candles[k].high > legHigh) legHigh = candles[k].high;
          if (candles[k].low  < legLow)  legLow  = candles[k].low;
        }
        const dist = Math.max(legHigh - legLow, atr) / 3;
        pending = { dir: 'long',  level: prevHigh, tp: prevHigh + dist * tpMult, sl: prevHigh - dist * slMult, invalidLevel: prevHigh - dist * slMult };
      } else if (prevLowActive && prevLow !== null && bar.close < prevLow) {
        prevLowActive = false;
        let legHigh = -Infinity, legLow = Infinity;
        for (let k = prevLowIdx; k <= i; k++) {
          if (candles[k].high > legHigh) legHigh = candles[k].high;
          if (candles[k].low  < legLow)  legLow  = candles[k].low;
        }
        const dist = Math.max(legHigh - legLow, atr) / 3;
        pending = { dir: 'short', level: prevLow,  tp: prevLow  - dist * tpMult, sl: prevLow  + dist * slMult, invalidLevel: prevLow  + dist * slMult };
      }
      if (pending) {
        const buf = atr * 0.15;
        if (pending.dir === 'long') {
          if (bar.close < pending.invalidLevel) {
            pending = null;
          } else if (bar.low <= pending.level + buf && bar.close >= pending.level - buf) {
            position = { dir: 'long',  tp: pending.tp, sl: pending.sl, entryIndex: i };
            signals.push({ time: bar.time, event: 'ENTER_LONG',  dir: 'long',  kind: 'entry' });
            pending = null;
          }
        } else {
          if (bar.close > pending.invalidLevel) {
            pending = null;
          } else if (bar.high >= pending.level - buf && bar.close <= pending.level + buf) {
            position = { dir: 'short', tp: pending.tp, sl: pending.sl, entryIndex: i };
            signals.push({ time: bar.time, event: 'ENTER_SHORT', dir: 'short', kind: 'entry' });
            pending = null;
          }
        }
      }
    }
  }
  return signals;
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
        else if (strategy === 'vw1')  signals = runVW1(candles, bot);
        else if (strategy === 'kc1')  signals = runKC1(candles, bot);
        else if (strategy === 'dv1')  signals = runDV1(candles, bot);
        else if (strategy === 'rs1')  signals = runRS1(candles, bot);
        else if (strategy === 'e3')   signals = runE3(candles, bot);
        else if (strategy === 'cv1')  signals = runCV1(candles, bot);
        else if (strategy === 'ch1')  signals = runCH1(candles, bot);
        else if (strategy === 'pm1')  signals = runPM1(candles, bot);
        else if (strategy === 'ob1')  signals = runOB1(candles, bot);
        else if (strategy === 'fg1')  signals = runFG1(candles, bot);
        else if (strategy === 'sm1')  signals = runSM1(candles, bot);
        else if (strategy === 'mn1')  signals = runMN1(candles, bot);
        else if (strategy === 'st1')  signals = runST1(candles, bot);
        else if (strategy === 'sb1')  signals = runSB1(candles, bot);
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
