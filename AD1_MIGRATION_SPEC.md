# AD1 Migration Spec

Project: Trading Signal Automation (without TradingView)
Indicator ID: AD1
Date: 2026-04-12
Status: Specified

## Summary
AD1 is a TradingView overlay indicator that detects unusual cross-exchange price spread and converts that into directional signals on the current chart symbol.

Core idea:
- compare the current chart close against a 5-source market view
- measure the spread between the highest and lowest source price
- rank that spread against the last 500 observed spreads
- when the spread percentile is unusually high, fade the outlier
- if current chart price is below the market average, go long
- if current chart price is above the market average, go short

## Inputs
### Strategy Settings
- `tp_perc`: default `1.5`
- `sl_perc`: default `1.0`
- `unusual_th`: default `90`

### Alert Settings
- `webhookKey`: default `12345`
- `useAlerts`: default `true`

### Arbitrage Data Sources
- `sym_1`: `BINANCE:BTCUSDT`
- `sym_2`: `COINBASE:BTCUSD`
- `sym_3`: `KRAKEN:XBTUSD`
- `sym_4`: `BITSTAMP:BTCUSD`
- current chart symbol close is used as source 5

### Visual Settings
- `show_table`: default `true`
- win/loss label colors

## Confirmed Runtime Settings From TradingView
The screenshots confirm that AD1 is intended to run with adjustable per-bot settings.

Confirmed runtime values for the captured setup:
- `webhookKey = Binance_Dem`
- `useAlerts = true`
- `tp_perc = 1.5`
- `sl_perc = 6`
- `unusual_th = 90`
- `sym_1 = BINANCE:BTCUSDT`
- `sym_2 = COINBASE:BTCUSD`
- `sym_3 = KRAKEN:BTCUSD`
- `sym_4 = BITSTAMP:BTCUSD`
- `show_table = true`

Implementation requirement:
- the standalone version must preserve adjustable settings for each indicator and each bot deployment
- runtime configuration must override code defaults

## Market Data Logic
For every bar:
1. Fetch close price from the 4 configured external symbols using `request.security`
2. Read current chart `close` as `p_current`
3. Replace any invalid external source with `p_current`
4. Build a 5-value price set: `p1`, `p2`, `p3`, `p4`, `p_current`
5. Compute:
- `p_max = max(prices)`
- `p_min = min(prices)`
- `p_avg = average(prices)`
- `current_sound = p_max - p_min`

## Spread Percentile Logic
A rolling history of the last 500 spread values is maintained.

Per bar:
1. Append `current_sound` to history
2. Trim oldest value if size exceeds 500
3. Compute percentile rank of the latest spread within the history
4. Define `is_unusual_spread = rank >= unusual_th`

Equivalent implementation note:
- parity requires reproducing TradingView `array.percentrank` semantics
- this should be validated carefully because percentile behavior will directly affect signal frequency

## Entry Rules
Signals are only valid on confirmed bar close.

### Long Entry
Enter long when all conditions are true:
- bar is confirmed closed
- `rank >= unusual_th`
- `p_current < p_avg`
- not already in long
- not already in short
- no entry already fired on this bar
- no exit already fired on this bar

On long entry:
- `entry_price = close`
- `tp_price = close * (1 + tp_perc / 100)`
- `sl_price = close * (1 - sl_perc / 100)`
- mark `in_long = true`
- record `lastEntryBar = bar_index`
- record `lastBuyTriggerBar = bar_index`
- optionally send alert: `ENTER-LONG_{webhookKey}`

### Short Entry
Enter short when all conditions are true:
- bar is confirmed closed
- `rank >= unusual_th`
- `p_current > p_avg`
- not already in long
- not already in short
- no entry already fired on this bar
- no exit already fired on this bar

On short entry:
- `entry_price = close`
- `tp_price = close * (1 - tp_perc / 100)`
- `sl_price = close * (1 + sl_perc / 100)`
- mark `in_short = true`
- record `lastEntryBar = bar_index`
- record `lastSellTriggerBar = bar_index`
- optionally send alert: `ENTER-SHORT_{webhookKey}`

## Exit Rules
The script uses a custom position state machine.

### Long Exit
If in long and no exit already fired on this bar:
- if `high >= tp_price`, exit by take profit first
- else if `low <= sl_price`, exit by stop loss

Long exit alert payload:
- `EXIT-ALL_{webhookKey}`

### Short Exit
If in short and no exit already fired on this bar:
- if `low <= tp_price`, exit by take profit first
- else if `high >= sl_price`, exit by stop loss

Short exit alert payload:
- `EXIT-ALL_{webhookKey}`

Important execution detail:
- TP is checked before SL in the same bar for both long and short positions
- this ordering matters for parity when a candle touches both levels

## Alert Contract Observed From Pine Script
The Pine script emits plain string messages, not JSON.

### Entry Long
`ENTER-LONG_<webhookKey>`

### Entry Short
`ENTER-SHORT_<webhookKey>`

### Exit
`EXIT-ALL_<webhookKey>`

## Trade State Variables
Persistent state used by the strategy:
- `in_long`
- `in_short`
- `entry_price`
- `sl_price`
- `tp_price`
- `lastEntryBar`
- `lastExitBar`
- `lastBuyTriggerBar`
- `lastSellTriggerBar`
- `lastExitTriggerBar`

These guards prevent duplicate actions on the same bar and allow `alertcondition` to reference persistent trigger flags.

## Backtest / Dashboard Metrics
The script computes internal performance stats:
- `total_trades`
- `wins`
- `total_pl_pct`
- `max_dd`
- `peak_equity`
- `cur_equity`
- derived `win_rate`
- derived `pf`

Implementation note:
- this is display logic only and not required for first signal-engine parity unless you want reporting parity too

## Migration Requirements
To reproduce AD1 outside TradingView, the new engine must support:
- multi-source market data fetch per evaluation bar
- rolling percentile rank over last 500 spreads
- close-confirmed signal generation only
- flat-only entries
- TP-first exit evaluation within each bar
- identical alert string generation using the same webhook key convention
- per-bar duplicate guards

## Known Discrepancies / Risks
- The Pine source default `sl_perc` is `1.0`, but the captured live TradingView inputs confirm the runtime setting is `6`
- This confirms the strategy relies on adjustable inputs and must not be ported using source defaults alone
- `ignore_invalid_symbol=true` plus `nz(..., p_current)` means invalid feeds silently collapse to current-chart price, which can reduce spread and alter signal frequency
- Symbol defaults are BTC-based, but your screenshot example was FARTCOIN-based, so real production symbols are likely reconfigured per bot

## Required Validation Before Porting
1. Confirm the actual runtime parameter set used by each deployed AD1 bot
2. Confirm the exact `webhookKey` routing behavior in TradeRelay
3. Confirm whether TradeRelay expects these raw strings directly or wraps them in additional logic
4. Confirm the current source symbols used for each deployed bot
5. Compare standalone percentile results against TradingView on the same candle history

## Recommended Standalone Event Model
Suggested mapping inside the new system:
- `ENTER-LONG_<key>` -> internal event `ENTER_LONG`
- `ENTER-SHORT_<key>` -> internal event `ENTER_SHORT`
- `EXIT-ALL_<key>` -> internal event `EXIT_ALL`

This keeps external compatibility with TradeRelay while using cleaner internal enums.
