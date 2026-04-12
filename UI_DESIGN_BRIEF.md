# UI Design Brief

Project: Trading Signal Automation (without TradingView)
Date: 2026-04-12

## Goal
The standalone platform should feel visually aligned with TradeRelay so the workflow feels familiar, even though this project is a simpler upstream signal and backtest system.

## Design Direction
- dark control-room interface
- compact metric cards
- strong visual separation between overview, strategies, and logs
- teal/green accents for active and profitable states
- red accents for loss, failure, or drawdown states
- dense but readable layout optimized for desktop first

## Product Role
This UI is not a broker execution terminal.

Its job is to help you:
- manage indicator configs
- run backtests and inspect results
- compare parameter sets
- monitor recent signals sent to TradeRelay
- inspect runtime errors and delivery logs

## Core Screens
### 1. Overview Dashboard
- global metric cards
- active indicators count
- total backtest runs
- last signal status
- recent net performance
- current alerts/webhook health

### 2. Indicator Bots
- list of configured bots or indicator deployments
- symbol and timeframe
- key parameters
- current status
- recent win rate and net P/L
- run or pause controls

### 3. Backtest Workbench
- parameter editor
- run button
- summary metrics
- equity curve placeholder
- trade list
- comparison table for multiple parameter sets

### 4. Signal Log
- timestamp
- indicator id
- symbol
- event type
- raw TradeRelay message
- delivery result

### 5. Error Log
- failed webhook attempts
- config validation issues
- missing market data sources
- parity mismatch notes

## Visual Language
### Colors
- background: near-black / charcoal
- surface: deep slate panels
- accent primary: teal-cyan
- success: vivid green
- danger: coral-red
- warning: amber
- text primary: soft off-white
- text secondary: muted gray-blue

### Typography
- use a technical, condensed-looking interface style
- strong numeric emphasis for KPI cards
- compact labels and uppercase section cues where useful

### Motion
- subtle load-in fades and panel reveals
- no decorative animation loops
- state changes should be sharp and functional

## TradeRelay-Inspired Elements To Preserve
- top-row KPI cards
- card-based account or bot sections
- dense, high-signal list layout
- strong active-state indicators
- operational dashboard feel rather than marketing-site feel

## Intentional Differences From TradeRelay
- focus on signal generation and backtesting instead of broker balances
- stronger emphasis on parameter editing and replay results
- clearer exposure of strategy internals and diagnostics

## Initial UI Modules
- dashboard shell
- metrics cards
- bot list table
- parameter form panel
- backtest summary card
- recent events list
- webhook status panel

## Implementation Note
The first UI should be a lightweight web dashboard that can later connect to the Python engine through an API or local service process.
