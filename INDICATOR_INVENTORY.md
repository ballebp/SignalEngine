# Indicator Inventory

Project: Trading Signal Automation (without TradingView)
Created: 2026-04-12

## Purpose
Track each TradingView indicator or strategy that must be migrated into the standalone signal engine.

## Status Values
- Identified
- Inspecting
- Specified
- Implemented
- Validated

## Indicators

### IND-0001 - AD1
Status: Specified
Date Added: 2026-04-12

Source Context:
- Pine Script source received
- Script name: `AD1`
- Overlay indicator with custom backtest and alert logic
- Screenshot context still suggests this logic is used on Binance perpetual charts across multiple bots/timeframes

Observed Visual Behavior:
- Detects unusual cross-exchange spread and fades the outlier direction
- Uses bar-close-only entries
- Uses fixed TP/SL exits
- Emits string alerts, not JSON
- Long alert format: `ENTER-LONG_<webhookKey>`
- Short alert format: `ENTER-SHORT_<webhookKey>`
- Exit alert format: `EXIT-ALL_<webhookKey>`

Known Migration Requirements:
- Reproduce 5-source price aggregation with fallback-to-current-price behavior
- Reproduce rolling 500-sample spread percentile rank
- Reproduce bar-close-only entry conditions
- Reproduce flat-only position state machine with same-bar entry/exit guards
- Reproduce TP-first exit ordering on each bar
- Reproduce exact alert strings currently sent from TradingView to TradeRelay
- Support per-bot symbol source configuration and webhook key routing
- Preserve adjustable indicator settings so runtime bot configuration can override source defaults

Unknowns To Extract:
- Bot routing fields used by TradeRelay beyond `webhookKey`
- Position sizing rules
- Whether TradeRelay consumes these raw strings directly or transforms them server-side
- Whether the displayed dashboard stats are relied on operationally or are visual-only

Next Capture Needed:
1. One real alert received by TradeRelay from AD1
2. Required TradeRelay bot identifier fields
3. Symbol normalization rules between TradingView and TradeRelay
4. Confirmation of how per-bot settings are stored outside TradingView

---

## Entry Template

### IND-XXXX - <Indicator Name>
Status: Identified|Inspecting|Specified|Implemented|Validated
Date Added: YYYY-MM-DD

Source Context:
- 

Observed Visual Behavior:
- 

Known Migration Requirements:
- 

Unknowns To Extract:
- 

Next Capture Needed:
1. 
