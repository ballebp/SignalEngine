# Indicator Settings Registry

Project: Trading Signal Automation (without TradingView)
Created: 2026-04-12

## Purpose
Track adjustable runtime settings for each migrated indicator so the standalone engine matches live bot behavior instead of only Pine defaults.

## Design Requirement
Each indicator implementation must expose adjustable settings for:
- alert routing
- signal thresholds
- TP and SL levels
- source symbols
- visual or reporting flags where operationally relevant

The standalone system should separate:
- code defaults
- per-indicator defaults
- per-bot runtime overrides

## Indicators

### AD1
Status: Runtime settings captured
Date Captured: 2026-04-12

#### Confirmed Runtime Settings
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

#### Notes
- Runtime stop loss is confirmed as `6`, which overrides the Pine default of `1.0`
- Runtime webhook key is a bot/account routing value and must remain configurable
- Source symbols are also runtime-configurable and must not be hardcoded in the standalone engine

#### Standalone Config Shape
Suggested normalized config fields:
- `indicatorId`
- `botId` or `routeKey`
- `timeframe`
- `tpPercent`
- `slPercent`
- `unusualPercentileThreshold`
- `sourceSymbols[]`
- `alertsEnabled`
- `showStats`

---

## Entry Template

### <Indicator ID>
Status:
Date Captured:

#### Confirmed Runtime Settings
- 

#### Notes
- 

#### Standalone Config Shape
- 
