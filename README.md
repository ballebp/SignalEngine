# AD1 Standalone

Standalone Python implementation of AD1 for generating TradeRelay-compatible alerts without TradingView.

## Current Scope
- configurable AD1 runtime settings
- AD1 signal evaluation and position state machine
- replay runner for historical or captured bar snapshots
- replay-based backtest summary for parameter tuning
- raw-string webhook dispatch compatible with the AD1 alert format
- initial UI direction aligned with TradeRelay style
- static no-install operator UI shell that opens directly in a browser
- unit tests for core entry and exit behavior

## What This Version Does
This first version is built for parity validation, not live deployment.

It expects bar snapshots that already contain:
- current symbol OHLC
- 4 arbitrage source closes
- symbol and timeframe
- confirmed-bar state

When a signal is generated, it emits one of these messages:
- `ENTER-LONG_<webhookKey>`
- `ENTER-SHORT_<webhookKey>`
- `EXIT-ALL_<webhookKey>`

## Project Layout
- `src/ad1_engine/config.py`: config model and loader
- `src/ad1_engine/models.py`: data models and runtime state
- `src/ad1_engine/engine.py`: AD1 strategy logic
- `src/ad1_engine/dispatcher.py`: webhook sender
- `src/ad1_engine/cli.py`: replay runner CLI
- `configs/ad1.sample.json`: sample runtime config
- `tests/test_ad1_engine.py`: core behavior tests

## Input Snapshot Format
The CLI reads JSON Lines, one bar snapshot per line.

Example:

```json
{"timestamp":"2026-04-12T12:00:00Z","symbol":"FARTCOINUSDT.P","timeframe":"5m","confirmed":true,"close":100.0,"high":100.4,"low":99.9,"sources":{"sym_1":101.0,"sym_2":100.8,"sym_3":100.9,"sym_4":100.7}}
```

## Quick Start
Create a virtual environment and run the tests:

```powershell
python -m venv .venv
.venv\Scripts\python -m pip install -U pip pytest
.venv\Scripts\python -m pytest
```

Run the engine in dry-run mode:

```powershell
.venv\Scripts\python -m ad1_engine.cli --config configs/ad1.sample.json --input sample.jsonl --dry-run
```

Write a final backtest summary report:

```powershell
.venv\Scripts\python -m ad1_engine.cli --config configs/ad1.sample.json --input sample.jsonl --dry-run --summary-out backtest-summary.json
```

The final summary includes:
- bars processed
- total trades
- wins and losses
- win rate
- net P/L percent
- max drawdown percent
- ending equity
- open position state

## Open The UI Now
Even without Python or Node installed, you can open the static operator dashboard directly:

- [ui/app/index.html](ui/app/index.html)

What it currently shows:
- overview KPI cards
- indicator bot list
- replay scenario summaries
- signal log table
- editable runtime config preview

Current limitation:
- this shell uses sample in-browser data and is not connected to the Python AD1 engine yet

## Notes
- AD1 runtime settings must be configurable per bot.
- Backtesting and performance reporting are first-class requirements because parameter tuning depends on them.
- The eventual UI should feel operationally similar to TradeRelay, but focused on indicators, backtests, configs, and signal logs.
- The current implementation uses a deterministic percentile-rank helper that still needs parity validation against TradingView on the same history.
- Live market-data adapters are intentionally not included yet.
