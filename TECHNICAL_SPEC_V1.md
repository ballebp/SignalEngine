# Technical Spec v1

Project: Trading Signal Automation (without TradingView)
Version: 0.1
Date: 2026-04-12

## Objective
Generate trading signals without TradingView and deliver valid webhook alerts to TradeRelay for broker order execution.

## Scope (v1)
- Single strategy engine for one or more symbols/timeframes
- Indicator calculation on OHLCV candles
- Rule evaluation on candle close
- Webhook dispatch to TradeRelay
- Basic retries and idempotency guard
- Event logging for audit/debug
- Replay-based backtesting and performance reporting for parameter tuning
- Lightweight operator UI with a visual style aligned to TradeRelay

## Out of Scope (v1)
- Portfolio optimization
- Advanced multi-strategy orchestration
- Full charting platform or TradingView-equivalent UI
- High-frequency tick strategies

## Proposed System Components
- Market Data Adapter
- Indicator Engine
- Indicator Configuration Layer
- Strategy Rules Engine
- Backtest Runner
- Performance Reporting Layer
- Lightweight Web UI
- Signal State Store
- Webhook Payload Builder
- Webhook Dispatcher
- TradeRelay Integration Boundary
- Scheduler/Worker
- Logger/Audit Trail

## Existing Downstream System
TradeRelay is the already-built receiving application that:
- accepts webhook alerts
- manages signal bots
- routes orders to connected brokers
- tracks bot stats, trades, win rate, PnL, and open positions

Current known endpoint/app:
- TradeRelay
- https://signal-bridge-eight.vercel.app/

Implication for this project:
- broker execution is out of scope for the new build
- the new build must focus on signal generation and strict webhook compatibility with TradeRelay

## Configuration Requirement
Each indicator must support adjustable runtime settings.

Minimum configuration categories:
- webhook routing key or bot identifier
- TP and SL percentages
- signal thresholds
- source symbols / exchanges
- alert enabled flag
- timeframe and symbol assignment

Implementation rule:
- do not hardcode live strategy values into indicator logic
- code defaults may exist, but per-bot runtime config must override them

## Data Flow
1. Scheduler triggers symbol-timeframe job
2. Data adapter fetches latest candles
3. Indicator engine computes required values
4. Strategy rules evaluate entry/exit conditions
5. State store checks cooldown and dedup
6. Payload builder formats webhook message
7. Dispatcher sends webhook to TradeRelay
8. TradeRelay validates the alert and routes the order to the configured broker
9. Result is logged for audit and troubleshooting

## Initial Event Types
- BUY
- SELL
- CLOSE_LONG
- CLOSE_SHORT
- HEARTBEAT
- ERROR

## Candidate Webhook Contract (Draft)
Note: Field names must be aligned with TradeRelay requirements.

{
  "source": "custom-signal-engine",
  "event": "BUY",
  "symbol": "BTCUSDT",
  "timeframe": "15m",
  "timestamp": "2026-04-12T12:00:00Z",
  "price": 65000.12,
  "strategy": "rsi_ema_v1",
  "signal_id": "BTCUSDT-15m-20260412T120000Z-BUY",
  "idempotency_key": "<unique-key>",
  "risk": {
    "size_type": "percent_equity",
    "size_value": 1.0,
    "stop_loss": 64500.0,
    "take_profit": 66200.0
  },
  "meta": {
    "version": "0.1",
    "notes": "draft payload"
  }
}

## Reliability Requirements (v1)
- Timeout and retry policy for webhook delivery
- Idempotency key per signal event
- Dedup window to avoid duplicate orders
- Structured logs for every dispatch attempt

## Error Handling
- Recoverable: timeout, 429, transient 5xx -> retry with backoff
- Non-recoverable: malformed payload, 4xx validation -> log and alert
- Circuit-breaker behavior after repeated failures

## Security Considerations
- Store secrets in environment variables
- Use HTTPS only
- Add optional request signature header if supported by bridge
- Never log API secrets

## Validation Plan
- Unit tests: indicator math and rule logic
- Integration tests: webhook payload + dispatcher
- Simulation: replay historical candles and compare outputs
- Paper-trade phase before live trading

## Performance and Backtesting Requirement
The standalone system must provide enough performance visibility to tune indicator parameters outside TradingView.

Minimum reporting output per replay or backtest run:
- total trades
- wins and losses
- win rate
- net P/L percent
- max drawdown
- ending equity
- open position state at end of run

Operational implication:
- indicator settings must be testable across replayed historical data
- parameter tuning depends on reproducible replay runs using stored configurations

## UI Requirement
The standalone platform should include a lightweight operator dashboard with a visual style inspired by TradeRelay.

Primary UI goals:
- familiar dark operational interface
- overview KPI cards
- indicator bot list with status and recent performance
- backtest workbench for parameter tuning
- signal log and webhook delivery visibility
- configuration editing for per-bot runtime settings

Important scope boundary:
- the goal is TradeRelay-like operational clarity, not a full TradingView replacement UI

Initial delivery approach:
- ship a static no-install frontend shell first
- connect it to the Python engine later through a lightweight API or local service layer

## TradingView Migration Inputs
Each existing TradingView indicator/strategy should be migrated using the following source artifacts:
- Pine Script source code
- Indicator inputs and default parameter values
- Exact alert message body currently emitted through {{message}}
- Symbol and timeframe mapping rules
- Entry, exit, TP, SL, cooldown, and sizing behavior
- Whether alerts fire intrabar or only after candle close

## First Known Source Strategy Notes
The first extracted source strategy is `AD1`.

AD1 behavior summary:
- Fetches close prices from 4 configured external symbols plus the current chart symbol
- Replaces invalid external prices with the current chart close
- Computes spread as `max(prices) - min(prices)`
- Maintains a rolling history of the last 500 spreads
- Computes percentile rank of the latest spread
- Marks spread as unusual when `rank >= unusual_th`
- Enters long on confirmed close when unusual spread is true and `current_price < average_price`
- Enters short on confirmed close when unusual spread is true and `current_price > average_price`
- Exits by TP/SL using a custom state machine with same-bar duplicate guards
- Checks TP before SL on the same bar

AD1 default parameters extracted from Pine:
- `tp_perc = 1.5`
- `sl_perc = 1.0`
- `unusual_th = 90`
- `useAlerts = true`

AD1 confirmed runtime settings from TradingView inputs:
- `webhookKey = Binance_Dem`
- `tp_perc = 1.5`
- `sl_perc = 6`
- `unusual_th = 90`
- `sym_1 = BINANCE:BTCUSDT`
- `sym_2 = COINBASE:BTCUSD`
- `sym_3 = KRAKEN:BTCUSD`
- `sym_4 = BITSTAMP:BTCUSD`
- `show_table = true`

AD1 alert strings extracted from Pine:
- `ENTER-LONG_<webhookKey>`
- `ENTER-SHORT_<webhookKey>`
- `EXIT-ALL_<webhookKey>`

Important configuration note:
- The earlier Pine default `sl_perc = 1.0` is not the live runtime setting for the captured AD1 bot
- The captured TradingView inputs confirm `sl_perc = 6`
- This means parity depends on migrating adjustable settings, not just source defaults

## Open Questions
- Exact payload schema expected by TradeRelay
- Authentication method (token/header/signature)
- Accepted order types and required fields
- Response codes and retry guidance
- Bot routing rules: how TradeRelay maps incoming alerts to a specific bot/account
- Which parts of the TradingView alert message are generated by Pine logic versus TradingView placeholders
- Whether TradeRelay consumes the raw AD1 string alerts directly: `ENTER-LONG_<key>`, `ENTER-SHORT_<key>`, `EXIT-ALL_<key>`
- Whether deployed AD1 bots use custom source symbols, thresholds, TP, or SL values versus Pine defaults

## Next Implementation Steps
1. Confirm webhook schema with TradeRelay
2. Choose stack (Node.js or Python)
3. Build minimal sender script for one test BUY signal
4. Add idempotency + retry logic
5. Add strategy evaluator for first indicator set
