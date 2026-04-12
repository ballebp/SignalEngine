# Signal Engine — Copilot Handoff Document
**Last updated:** 2026-04-12  
**Latest commit:** `8d3cb24`  
**GitHub:** `https://github.com/ballebp/SignalEngine` (branch: `main`)  
**Live app (Vercel):** `https://signal-bridge-eight.vercel.app/`

---

## HOW TO USE THIS FILE
Open this project in VS Code, then tell Copilot:
> "Read COPILOT_HANDOFF.md and continue working on the Signal Engine project from where I left off."

Copilot should read this file first, then be able to pick up any task as if the full conversation history was present.

---

## 1. Project Overview

**Goal:** Replace TradingView alert dependency with a custom Signal Engine that:
- Pulls live Binance candle data
- Runs two strategy simulations (AD1, H9S) on that data
- Fires webhook signals to TradeRelay in the correct format
- Provides a full charting + bot management UI

**Stack:**
- Pure static HTML/CSS/JS — no build step, no framework
- Deployed on **Vercel** as static site (`outputDirectory: ui/app`)
- **Supabase** for signal log persistence
- **LightweightCharts** (Tradingview library) for the chart
- **Binance REST API** (spot + futures) for candle data
- **TradeRelay** as the downstream webhook execution bridge

**Key files:**
```
ui/app/
  index.html   — full single-page app HTML
  app.js       — all application logic (~2800 lines)
  styles.css   — all styling
vercel.json    — static site config (outputDirectory: ui/app)
```

---

## 2. Infrastructure Credentials

| Service | Detail |
|---------|--------|
| **Supabase URL** | `https://ohguikmqxuhujqrcnuqi.supabase.co` |
| **Supabase Anon Key** | `sb_publishable_4mpeCY3NhZ4Y3VT26Ar7uA_w16L8MEO` |
| **Supabase Table** | `signal_log` (columns: `created_at`, `bot_name`, `symbol`, `event`, `message`, `status`) |
| **GitHub Repo** | `ballebp/SignalEngine` |
| **Vercel** | Auto-deploys on push to `main` |

**Git setup on Windows (required each terminal session):**
```powershell
$env:PATH += ";C:\Program Files\Git\cmd"
Set-Location "c:\Users\balle\Documents\TV app"
```

---

## 3. Bots Defined in `state.bots`

### `ad1-prod` — AD1 / Binance_Dem
- Strategy: `ad1` (default, no `strategy` field)
- Symbol: `FARTCOINUSDT.P`, Timeframe: `5m`
- Webhook key: `Binance_Dem`
- TP: 1.5%, SL: 6.0%, Threshold: 90
- Sources: BINANCE, COINBASE, KRAKEN, BITSTAMP (BTC consensus)

### `ad1-btc-15m` — AD1 / BTC Sweep Lane
- Strategy: `ad1`
- Symbol: `BTCUSDT`, Timeframe: `15m`
- Webhook key: `BTC_Sweep`
- TP: 1.2%, SL: 4.0%, Threshold: 92

### `h9s-btc-15m` — H9S / BTC
- Strategy: `h9s` (Break of Structure strategy)
- Symbol: `BTCUSDT`, Timeframe: `15m`
- Webhook key: `H9S_BTC`
- TP: 1.0%, SL: 1.0%, Threshold (Swing Size): 25
- Extra fields: `tpType: 'dynamic'`, `bosConfType: 'close'`, `slippage: 0.05`

---

## 4. Strategy Logic

### AD1 Strategy (`runStrategySimulation` when `bot.strategy !== 'h9s'`)
- Percentile rank of candle-to-candle move size over 200-bar window
- If percentile >= `bot.threshold`: fire signal
- Direction: long if close >= SMA20, short otherwise
- TP/SL: fixed % from entry price

### H9S Strategy (`runH9SStrategy`)
- Swing pivot detection: looks back/forward `swingSize` bars (= `bot.threshold`)
- Break of Structure (BOS): when price crosses a confirmed pivot high/low
- Confirmation mode: `bosConfType = 'close'` (candle close) or `'wicks'` (wick)
- TP mode: `tpType = 'dynamic'` (1.5× ATR30) or `'fixed'` (uses `bot.tp`/`bot.sl` %)
- Slippage: applied to entry price via `bot.slippage` %
- H9S does NOT use `source1–4` fields (those are AD1-only)

---

## 5. Chart Modes

- **Live** — fetches Binance candles, polls every 7s, fires real webhook signals when Auto-Signal is ON
- **History** — static Binance fetch, shows Random Sample button (`🎲`) to load a random 30-day window

`Replay` mode was removed and merged into History (commit `ff9b5b0`).

---

## 6. Key `chartState` Fields

```js
chartState = {
  mode: 'live',                   // 'live' | 'history'
  historyBarsTarget: 4000,
  autoSignalByBot: {},            // botId → boolean
  lastFiredByBot: {},             // botId → unix seconds
  data: null,                     // { candles, volumes, markers, tradeLog, smaData, summary, ... }
  replaySignals: [],              // built from tradeLog, used by auto-signal
  marketType: null,               // 'spot' | 'futures' (auto-detected, remembered)
  importedCandlesByBot: {},       // botId → { candles, volumes } from JSONL upload
  fullHistoryByBot: {},           // botId → { candles, volumes } for random sample
  showCandles/Sma/Volume/Markers/Levels: true,
  followLive: false,
  barSpacing: 7,
  currentBotId: null,
}
```

---

## 7. Persistence (Supabase `saveSettings`)

`saveSettings()` writes to `supabase.signal_log` table — wait, actually it writes bot config to a settings store. Let Copilot check the actual `saveSettings` function around line 2752 in app.js for exact schema.

Bot fields persisted on Apply/Optimize: `tp`, `sl`, `threshold`, `bosConfType`, `tpType`, `slippage`, `symbol`, `timeframe`, `autoSignal`.

---

## 8. Auto-Signal Flow

1. User switches to **Live** mode and has `tradeRelayUrl` set on the bot
2. Clicks **Auto-Signal** button → arms the bot (`chartState.autoSignalByBot[botId] = true`)
3. `lastFiredByBot[botId]` is set to `Date.now()/1000` at arm time (prevents historic re-fires)
4. Every 7s `startLive` polls Binance → rebuilds `replaySignals` from trade log
5. `fireNewLiveSignals` checks for signals with `time > lastFiredByBot`
6. Sends POST to `bot.tradeRelayUrl` with body `ENTER-LONG_WebhookKey` etc.
7. Logs result to Supabase `signal_log`

---

## 9. Config Form / Preview — Strategy Differences

- **AD1 bots**: shows `source1–4` fields, generates `indicatorId: 'AD1'` JSON with `unusualPercentileThreshold`
- **H9S bots**: hides `source1–4`, generates `indicatorId: 'H9S'` JSON with `swingSize`, `bosConfType`, `tpType`, `slippage`

---

## 10. Optimizer

### How it works
1. Click **AI Optimize** → fetches **12,000 bars** from Binance independently (not current chart data)
2. Shows "Fetching…" then "Running optimizer on N bars…" in feedback
3. Sweeps all parameter combos and scores each: `score = (netPl * 1.2) - (dd * 0.72) + pfBoost + edgeBoost` × `tradeFactor`
4. Top 6 results shown. Clicking **Apply** on any row:
   - Writes params to `bot.*`
   - Saves to Supabase
   - Calls `initChart(bot.id)` — re-fetches fresh Binance data at full bar count

### AD1 sweep: `tpCandidates × slCandidates × thresholdCandidates` (720 combos)
### H9S sweep: `swingSize × bosConfType × tpType × [fixed tp/sl combos]` (~480 combos)

**Important:** Optimizer stats and chart stats will match post-apply because both use a fresh `initChart` call with the same bar count.

---

## 11. Stats Consistency Rules

- `renderChartControls(bot, summary)` — renders perf strip from current `summary` only. Does NOT write back to `bot.*`.
- `bot.winRate/netPl/drawdown/trades` — only updated when user explicitly applies params (Apply button or optimizer Apply)
- Goal: hero stats = last-applied optimizer result; chart strip = current candles loaded

---

## 12. Full Commit History

```
8d3cb24  feat: optimizer fetches 12k bars independently before sweep
db0b9e2  fix: optimizer apply re-fetches full bars so stats match refresh
821a62a  fix: stop chart load overwriting bot stats - only optimizer apply sets them
cf4e66b  fix: remove stray }; in renderConfigPreview causing syntax error
24e2648  fix: consistent symbol/tf layout + H9S config form/preview
ff9b5b0  feat: merge replay + history into single history mode
1944fb5  fix: optimizer apply renders on same candles — stats always match
9332553  fix: random sample always fetches fresh data and picks new period
de29058  remove: Run Replay button from topbar
548a272  fix: timeframe-aware 30-day window for random sample
82e0882  feat: simplify replay to random sample only, 500-bar window
7e06bbb  feat: random sample button in replay mode
947b51e  fix: persist + display perf stats after AI optimize and apply
58f032a  fix: save settings on Apply Parameters
61f460c  fix: persist auto-signal state across reload
ec6c671  feat: H9S optimizer — sweep swingSize, bosConfType, tpType
1a3cfd2  feat: H9S full settings — bosConfType, slippage, tpType in config form
0b1bb4f  feat: H9S BOS strategy + bot
ff7c59b  feat: coin symbol autocomplete datalist
7ee5880  feat: auto-signal play button in controls bar
1b1ba86  feat: trade log newest-first, cards/list view toggle
037bc71  feat: pulsing LIVE badge on active bots, live topnav status dots
599df6b  feat: entry/exit timestamps on trade cards
fb830bd  fix: per-bot autoSignal, dedup by timestamp, status capture, toast
ef02e61  fix: pills always look up current bot fresh
1ed7911  fix: timeframe select in settings + instant chart reload
546b65b  feat: lightning bolt favicon and brand mark icon
09dae60  feat: live signal log from Supabase
fce7398  fix: tell Vercel this is a static site, no Python build
f10916f  feat: Supabase persistence, TradeRelay auto-signal, Vercel deploy
```

---

## 13. UI Layout

Controls bar has two rows:
- **Row 1:** Bot tabs | Mode select (History/Live) | Bars select | Status text
- **Row 2:** Symbol + timeframe badge (left) | Win Rate / Net P/L / Max DD / Trades | Auto-Signal button (right)

Layer toggles: Candles, SMA, Volume, Entries/Exits, TP/SL Lines — always visible below controls.

Random Sample button (`🎲`) — only visible in History mode (hidden in Live mode via `.is-hidden` class).

---

## 14. Known Patterns / Gotchas

- `toBinanceSymbol()` strips `.P` suffix and ensures USDT quote — handles futures symbols transparently
- `getMarketCandidates()` tries futures first if symbol contains `.P` or `PERP`, else spot first
- `mergeMarketData()` deduplicates by time key, trims to `maxBars`
- `buildSma(candles, 20)` — 20-bar SMA used as direction signal in AD1 strategy
- `parseLocaleNumber()` handles comma vs dot decimal separator
- `chartState.marketType` is cached — once a symbol resolves to futures, stays futures until bot/symbol changes
- Bot stats (`bot.winRate` etc.) in the settings panel are seeded defaults and change only on explicit optimizer apply
- `saveSettings()` is async — always called as `void saveSettings()` (fire and forget)

---

## 15. Suggested Next Steps (from prior conversations)

Things that were discussed but not yet built:
- Date range picker for History mode (currently only bar count selector)
- Multiple H9S bots / rename H9S bot in UI to something more descriptive
- Webhook payload validation — confirm exact TradeRelay schema works end-to-end
- Live signal test pipeline — verify a real ENTER-LONG actually routes to broker
- Export optimizer results to CSV
- Walk-forward test (out-of-sample validation on optimized params)
