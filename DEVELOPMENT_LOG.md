# Development Log

Project: Trading Signal Automation (without TradingView)
Created: 2026-04-12
Owner: balle

## Purpose
Track development progress, architecture decisions, errors, solutions, and updates while building a system that generates trading signals and sends webhook alerts to TradeRelay without using TradingView.

Target execution bridge/app:
- TradeRelay
- https://signal-bridge-eight.vercel.app/

## Project Goal
Build custom indicators/strategies and alert generation outside TradingView, then deliver webhook payloads compatible with TradeRelay so broker orders can be placed automatically.

## High-Level Scope
- Replace TradingView alert dependency with a custom signal engine
- Produce reliable buy/sell/close signals
- Send webhook alerts to TradeRelay in the required format
- Add monitoring, retry, logging, and safety controls

## Architecture Notes (Initial)
- Signal Engine: computes indicators and evaluates trade conditions
- Market Data Feed: source for candles/ticks (exchange/broker API)
- Alert Dispatcher: sends webhook messages to TradeRelay
- TradeRelay: existing webhook receiver that validates alerts and routes orders to brokers
- Job Scheduler: runs strategy checks per timeframe/symbol
- State Store: tracks positions, last signal, cooldown, idempotency keys
- Observability: logs, metrics, and error reporting

## Risks and Constraints (Initial)
- Signal mismatch versus TradingView formulas
- Timing differences between candle close and real-time updates
- Rate limits from data providers and webhook target
- Duplicate alerts causing repeated orders
- Need strict risk controls and fail-safe behavior

## Milestones
- [ ] M1: Define indicator formulas and exact signal rules
- [ ] M2: Choose stack and project structure
- [ ] M3: Integrate market data source
- [ ] M4: Implement signal engine + backtest validation
- [ ] M5: Implement webhook formatter + dispatcher
- [ ] M6: Add retries, deduplication, and alert audit trail
- [ ] M7: Paper-trade validation phase
- [ ] M8: Controlled live rollout

## Log Entries

### 2026-04-12 - Kickoff
Status: Started

Progress:
- Project log initialized
- Core objective documented: remove TradingView dependency while preserving webhook-to-order flow through TradeRelay

Open Decisions:
- Programming language/runtime
- Hosting/deployment model
- Data provider/API
- Exact payload schema expected by TradeRelay

Errors:
- None yet

Solutions:
- N/A

Updates:
- Next step is to define technical stack and create a minimal prototype that emits one valid test webhook

### 2026-04-12 - Project Documentation Baseline
Status: Completed

Progress:
- Created dedicated bug tracking document
- Created architecture/decision record document
- Created technical specification v1 draft

Errors:
- None

Solutions:
- Established clear templates and process docs for consistent development tracking

Updates:
- Project now has baseline documentation for execution and auditability from day one

Next:
- Confirm TradeRelay webhook schema and authentication requirements

### 2026-04-12 - TradeRelay Context Added
Status: Completed

Progress:
- Confirmed the receiving app is TradeRelay, the existing webhook handling and broker execution system
- Captured that the new project only needs to generate signals and send valid alerts into TradeRelay
- Confirmed downstream broker execution already exists in your app flow

Errors:
- None

Solutions:
- Narrowed project scope to signal generation, webhook compatibility, and reliability around alert delivery

Updates:
- Architecture should now be treated as Custom Signal Engine -> TradeRelay -> Broker

Next:
- Document the exact TradeRelay webhook payload and required fields from your current bot setup

### 2026-04-12 - First Indicator Example Captured
Status: In Progress

Progress:
- Captured the first TradingView indicator/strategy example as a migration source
- Confirmed current TradingView usage includes active alerts and a templated alert message via {{message}}
- Observed visible TP/SL presentation and strategy stats that may need parity in the standalone implementation

Errors:
- Exact indicator formulas and alert payload content are still unknown from the screenshot alone

Solutions:
- Added indicator inventory tracking so each TradingView strategy can be documented and migrated systematically

Updates:
- The migration effort now has a concrete first source strategy to reverse-engineer

Next:
- Capture the Pine Script code and one real alert payload emitted by this indicator

### 2026-04-12 - AD1 Pine Script Extracted
Status: Completed

Progress:
- Received the full Pine Script source for AD1
- Extracted the actual signal logic, state machine behavior, and exact alert strings
- Identified that AD1 sends plain string alerts: `ENTER-LONG_<webhookKey>`, `ENTER-SHORT_<webhookKey>`, and `EXIT-ALL_<webhookKey>`
- Confirmed entries only trigger on confirmed bar close
- Confirmed spread logic uses 4 external symbols plus the current chart symbol, with a rolling 500-sample percentile rank

Errors:
- A discrepancy exists between the earlier screenshot showing `SL: -6%` and the AD1 source default `sl_perc = 1.0`
- Actual runtime parameters used in production are still unknown

Solutions:
- Created a dedicated AD1 migration spec to use the Pine Script as the source of truth for implementation
- Recorded the stop-loss discrepancy as a validation item before parity work starts

Updates:
- AD1 is now the first fully specified migration target
- The project can move from generic planning into implementation planning for a standalone AD1 engine

Next:
- Confirm one live AD1 bot's runtime parameters and one real alert received by TradeRelay

### 2026-04-12 - AD1 Adjustable Settings Confirmed
Status: Completed

Progress:
- Confirmed AD1 is operated with adjustable TradingView inputs rather than source defaults alone
- Captured live AD1 runtime settings from the TradingView inputs panel
- Confirmed `webhookKey = Binance_Dem`
- Confirmed `tp_perc = 1.5`, `sl_perc = 6`, and `unusual_th = 90`
- Confirmed configurable exchange source symbols are part of the strategy runtime setup

Errors:
- None

Solutions:
- Added a project requirement that each indicator must support adjustable runtime settings in the standalone system
- Resolved the earlier stop-loss discrepancy by separating Pine defaults from live runtime configuration

Updates:
- AD1 parity must be based on bot configuration plus code logic, not code defaults only

Next:
- Capture one real AD1 alert as received by TradeRelay and define the standalone indicator config model

### 2026-04-12 - Standalone AD1 Python Build Started
Status: In Progress

Progress:
- Chose Python for the first standalone AD1 implementation
- Created a structured Python project with config loader, AD1 engine, webhook dispatcher, CLI runner, sample config, sample replay input, and unit tests
- Implemented configurable runtime settings for webhook key, TP, SL, threshold, and source symbols
- Implemented TradeRelay-compatible raw alert string generation for long, short, and exit events

Errors:
- Local runtime validation is currently blocked because Python is not installed or not available on PATH in this workspace environment

Solutions:
- Completed editor-level validation and added a test suite that can be run immediately once Python is available

Updates:
- The project has moved from planning into actual standalone AD1 code

Next:
- Run the Python tests in an environment with Python installed and then wire a real market-data adapter

### 2026-04-12 - Backtesting Requirement Added
Status: Completed

Progress:
- Confirmed the standalone platform must include performance visibility and backtesting support for parameter tuning
- Extended the AD1 replay runner to emit a final backtest summary
- Added summary metrics for trades, wins, losses, win rate, net P/L, max drawdown, ending equity, and open position state

Errors:
- Runtime verification is still blocked in this environment until Python is installed

Solutions:
- Exposed internal strategy stats through a dedicated backtest summary instead of leaving them buried in engine state

Updates:
- Backtesting is now a core system requirement, not an optional later feature

Next:
- Add parameter sweep capability after Python runtime validation is available

### 2026-04-12 - UI Direction Added
Status: Completed

Progress:
- Added a UI design brief for a lightweight dashboard styled in a TradeRelay-like operational aesthetic
- Created a static dashboard mockup showing overview cards, indicator bots, backtest controls, and recent signal logs
- Updated the technical spec to include a lightweight web UI as part of the platform scope

Errors:
- None

Solutions:
- Defined the UI goal early so backend and future frontend work can align around the same operator workflow

Updates:
- The product direction is now: standalone signal engine plus backtesting plus TradeRelay-inspired operator dashboard

Next:
- Convert the static mockup into a real frontend once the Python service/API shape is defined

### 2026-04-12 - Static Frontend Shell Added
Status: Completed

Progress:
- Built a self-contained frontend shell under `ui/app` that opens without Python, Node, or a build step
- Added interactive sections for dashboard overview, indicator bots, replay scenarios, signal log, and runtime config preview
- Used a TradeRelay-inspired visual language so the operator experience already matches the target product direction

Errors:
- The UI is currently powered by sample in-browser data and is not yet connected to the Python AD1 engine

Solutions:
- Chose a no-install frontend so the project has a runnable interface even while local runtimes are unavailable

Updates:
- The project now has a real openable app shell, not just backend code and static mockups

Next:
- Add an API contract between the frontend shell and the Python engine, then replace sample data with replay/backtest output

---

## Entry Template
Copy this template for each session/day.

### YYYY-MM-DD - <Session Title>
Status: Planned | In Progress | Blocked | Completed

Progress:
- 

Errors:
- 

Solutions:
- 

Updates:
- 

Next:
- 

## Change Summary (Optional)
- Version: 0.0.1
- Last updated: 2026-04-12
- Notes: Initial project log created
