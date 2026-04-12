from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum


class EventType(str, Enum):
    ENTER_LONG = "ENTER_LONG"
    ENTER_SHORT = "ENTER_SHORT"
    EXIT_ALL = "EXIT_ALL"


@dataclass(slots=True)
class BarSnapshot:
    timestamp: str
    symbol: str
    timeframe: str
    confirmed: bool
    close: float
    high: float
    low: float
    sources: dict[str, float | None]


@dataclass(slots=True)
class SignalEvent:
    event_type: EventType
    message: str
    timestamp: str
    symbol: str
    timeframe: str
    close: float
    percentile_rank: float
    current_spread: float


@dataclass(slots=True)
class PerformanceStats:
    total_trades: int = 0
    wins: int = 0
    total_pl_pct: float = 0.0
    max_drawdown: float = 0.0
    peak_equity: float = 100.0
    current_equity: float = 100.0


@dataclass(slots=True)
class BacktestSummary:
    symbol: str
    timeframe: str
    bars_processed: int
    total_trades: int
    wins: int
    losses: int
    win_rate: float
    net_pl_percent: float
    max_drawdown_percent: float
    ending_equity: float
    open_position: str


@dataclass(slots=True)
class EngineState:
    spread_history: list[float] = field(default_factory=list)
    in_long: bool = False
    in_short: bool = False
    entry_price: float = 0.0
    stop_loss_price: float = 0.0
    take_profit_price: float = 0.0
    last_entry_index: int = -1
    last_exit_index: int = -1
    last_buy_trigger_index: int = -1
    last_sell_trigger_index: int = -1
    last_exit_trigger_index: int = -1
    bar_index: int = -1
    stats: PerformanceStats = field(default_factory=PerformanceStats)
