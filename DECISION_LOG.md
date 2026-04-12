# Decision Log (ADR Lite)

Project: Trading Signal Automation (without TradingView)
Created: 2026-04-12

## Purpose
Record important architectural and implementation decisions with rationale and consequences.

## Status Values
- Proposed
- Accepted
- Superseded
- Rejected

## Decisions

### DEC-0001 - Build standalone signal engine outside TradingView
Date: 2026-04-12
Status: Accepted

Context:
Current flow depends on TradingView alerts. Goal is to remove TradingView dependency while keeping webhook-based order routing through TradeRelay.

Decision:
Implement a custom signal engine that computes indicators and emits alerts directly to TradeRelay-compatible webhooks.

Rationale:
- Full control over logic, timing, and deployment
- Reduced external platform dependency
- Better observability and testability

Consequences:
- Must ensure indicator parity/consistency with prior TradingView behavior
- Need robust scheduler, state tracking, and deduplication
- Increased responsibility for uptime and risk controls

Alternatives Considered:
- Keep TradingView alerts and only optimize bridge settings
- Hybrid approach with partial TradingView fallback

### DEC-0002 - Reuse existing TradeRelay execution layer
Date: 2026-04-12
Status: Accepted

Context:
TradeRelay already exists as the webhook receiving and broker execution application. It manages bots and connected brokers, so the new project does not need to replicate order routing.

Decision:
Treat TradeRelay as a fixed downstream integration boundary and only build the upstream signal-generation system.

Rationale:
- Avoids rebuilding broker integrations that already work
- Reduces scope and implementation risk
- Keeps the new system focused on indicator parity, signal quality, and alert reliability

Consequences:
- TradeRelay payload and routing requirements become a hard dependency
- Integration testing must validate real bot/account routing behavior
- Any schema mismatch will block order execution even if signal logic is correct

Alternatives Considered:
- Build a new broker execution layer inside this project
- Replace TradeRelay with direct broker API integration

### DEC-0003 - Use Python for the first standalone AD1 implementation
Date: 2026-04-12
Status: Accepted

Context:
The first standalone indicator needs configurable strategy logic, replay-based validation, and a clean path toward historical testing and data adapters.

Decision:
Implement the first standalone AD1 engine in Python.

Rationale:
- Strong fit for numerical and strategy-validation workflows
- Lower friction for replay testing and future backtesting
- Simpler initial implementation for config-driven indicator logic

Consequences:
- Local runtime validation depends on Python being installed in the environment
- Future deployment packaging should standardize the Python runtime and dependency management

Alternatives Considered:
- Build the first implementation in Node.js
- Delay the implementation language decision until live adapters are selected

### DEC-0004 - Include replay-based backtesting in the standalone platform
Date: 2026-04-12
Status: Accepted

Context:
The standalone project is intended to replace TradingView only for indicator execution and signal generation, but parameter tuning still requires visible performance results.

Decision:
Include replay-based backtesting and performance reporting as a first-class capability in the standalone system.

Rationale:
- Indicator settings cannot be tuned safely without measurable outcomes
- Performance visibility is required to compare parameter sets outside TradingView
- Replay-based validation is the simplest practical foundation before adding more advanced optimization workflows

Consequences:
- Each indicator implementation should expose reusable performance stats
- Historical data storage and replay workflows become part of the architecture
- Future work should add parameter sweeps and comparison tooling

Alternatives Considered:
- Defer backtesting and use only live paper trading for parameter tuning
- Keep backtesting exclusively inside TradingView while signals run elsewhere

### DEC-0005 - Use a TradeRelay-inspired operator UI
Date: 2026-04-12
Status: Accepted

Context:
The standalone platform needs a usable interface for parameter tuning, backtest review, and operational monitoring. The user prefers a visual style similar to TradeRelay.

Decision:
Adopt a lightweight dashboard UI with a visual language inspired by TradeRelay while keeping the product scope focused on indicators, backtesting, and signal delivery.

Rationale:
- Preserves familiarity across the workflow
- Supports faster operational use and parameter adjustment
- Avoids building an unrelated generic admin interface

Consequences:
- Future frontend work should preserve the dark operational dashboard style
- UI should emphasize bots, configs, metrics, and logs rather than charting complexity
- The platform still should not expand into a full TradingView clone

Alternatives Considered:
- Build a plain utility UI with no visual relationship to TradeRelay
- Delay all UI work until backend completion

---

## Entry Template

### DEC-XXXX - <Decision Title>
Date: YYYY-MM-DD
Status: Proposed|Accepted|Superseded|Rejected

Context:

Decision:

Rationale:

Consequences:

Alternatives Considered:
