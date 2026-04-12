from __future__ import annotations

from dataclasses import asdict

from .config import AD1Config
from .models import BacktestSummary, BarSnapshot, EngineState, EventType, SignalEvent


def percentile_rank(values: list[float], current_value: float) -> float:
    if not values:
        return 0.0
    less_or_equal = sum(1 for value in values if value <= current_value)
    return (less_or_equal / len(values)) * 100.0


class AD1Engine:
    def __init__(self, config: AD1Config) -> None:
        self.config = config
        self.state = EngineState()

    def process_bar(self, snapshot: BarSnapshot) -> SignalEvent | None:
        self.state.bar_index += 1

        prices = self._resolve_prices(snapshot)
        current_spread = max(prices) - min(prices)
        average_price = sum(prices) / len(prices)

        self.state.spread_history.append(current_spread)
        if len(self.state.spread_history) > self.config.history_limit:
            self.state.spread_history.pop(0)

        rank = percentile_rank(self.state.spread_history, current_spread)

        exit_event = self._process_exit(snapshot, rank, current_spread)
        if exit_event is not None:
            return exit_event

        is_unusual_spread = rank >= self.config.unusual_percentile_threshold
        valid_long = snapshot.confirmed and is_unusual_spread and snapshot.close < average_price
        valid_short = snapshot.confirmed and is_unusual_spread and snapshot.close > average_price

        if (
            not self.state.in_long
            and not self.state.in_short
            and self.state.last_entry_index != self.state.bar_index
            and self.state.last_exit_index != self.state.bar_index
        ):
            if valid_long:
                return self._enter_long(snapshot, rank, current_spread)
            if valid_short:
                return self._enter_short(snapshot, rank, current_spread)

        return None

    def snapshot_state(self) -> dict[str, object]:
        payload = asdict(self.state)
        payload["config_symbol"] = self.config.symbol
        payload["config_timeframe"] = self.config.timeframe
        return payload

    def backtest_summary(self) -> BacktestSummary:
        total_trades = self.state.stats.total_trades
        wins = self.state.stats.wins
        losses = max(0, total_trades - wins)
        win_rate = (wins / total_trades) * 100.0 if total_trades > 0 else 0.0
        if self.state.in_long:
            open_position = "LONG"
        elif self.state.in_short:
            open_position = "SHORT"
        else:
            open_position = "FLAT"

        return BacktestSummary(
            symbol=self.config.symbol,
            timeframe=self.config.timeframe,
            bars_processed=self.state.bar_index + 1,
            total_trades=total_trades,
            wins=wins,
            losses=losses,
            win_rate=win_rate,
            net_pl_percent=self.state.stats.total_pl_pct,
            max_drawdown_percent=self.state.stats.max_drawdown,
            ending_equity=self.state.stats.current_equity,
            open_position=open_position,
        )

    def _resolve_prices(self, snapshot: BarSnapshot) -> list[float]:
        prices = []
        for source_key in ("sym_1", "sym_2", "sym_3", "sym_4"):
            source_value = snapshot.sources.get(source_key)
            prices.append(snapshot.close if source_value is None else float(source_value))
        prices.append(snapshot.close)
        return prices

    def _process_exit(
        self,
        snapshot: BarSnapshot,
        rank: float,
        current_spread: float,
    ) -> SignalEvent | None:
        if self.state.in_long and self.state.last_exit_index != self.state.bar_index:
            if snapshot.high >= self.state.take_profit_price:
                pct_gain = ((self.state.take_profit_price - self.state.entry_price) / self.state.entry_price) * 100.0
                self._close_position(self.state.bar_index, pct_gain, won=True)
                return self._build_event(snapshot, EventType.EXIT_ALL, rank, current_spread)
            if snapshot.low <= self.state.stop_loss_price:
                pct_loss = ((self.state.stop_loss_price - self.state.entry_price) / self.state.entry_price) * 100.0
                self._close_position(self.state.bar_index, pct_loss, won=False)
                return self._build_event(snapshot, EventType.EXIT_ALL, rank, current_spread)

        if self.state.in_short and self.state.last_exit_index != self.state.bar_index:
            if snapshot.low <= self.state.take_profit_price:
                pct_gain = ((self.state.entry_price - self.state.take_profit_price) / self.state.entry_price) * 100.0
                self._close_position(self.state.bar_index, pct_gain, won=True)
                return self._build_event(snapshot, EventType.EXIT_ALL, rank, current_spread)
            if snapshot.high >= self.state.stop_loss_price:
                pct_loss = ((self.state.entry_price - self.state.stop_loss_price) / self.state.entry_price) * 100.0
                self._close_position(self.state.bar_index, pct_loss, won=False)
                return self._build_event(snapshot, EventType.EXIT_ALL, rank, current_spread)

        self._update_drawdown()
        return None

    def _enter_long(self, snapshot: BarSnapshot, rank: float, current_spread: float) -> SignalEvent:
        self.state.in_long = True
        self.state.last_entry_index = self.state.bar_index
        self.state.last_buy_trigger_index = self.state.bar_index
        self.state.entry_price = snapshot.close
        self.state.take_profit_price = snapshot.close * (1 + self.config.take_profit_percent / 100.0)
        self.state.stop_loss_price = snapshot.close * (1 - self.config.stop_loss_percent / 100.0)
        return self._build_event(snapshot, EventType.ENTER_LONG, rank, current_spread)

    def _enter_short(self, snapshot: BarSnapshot, rank: float, current_spread: float) -> SignalEvent:
        self.state.in_short = True
        self.state.last_entry_index = self.state.bar_index
        self.state.last_sell_trigger_index = self.state.bar_index
        self.state.entry_price = snapshot.close
        self.state.take_profit_price = snapshot.close * (1 - self.config.take_profit_percent / 100.0)
        self.state.stop_loss_price = snapshot.close * (1 + self.config.stop_loss_percent / 100.0)
        return self._build_event(snapshot, EventType.ENTER_SHORT, rank, current_spread)

    def _close_position(self, bar_index: int, pct_move: float, won: bool) -> None:
        self.state.in_long = False
        self.state.in_short = False
        self.state.last_exit_index = bar_index
        self.state.last_exit_trigger_index = bar_index
        self.state.stats.total_trades += 1
        if won:
            self.state.stats.wins += 1
        self.state.stats.total_pl_pct += pct_move
        self.state.stats.current_equity += pct_move
        self._update_drawdown()

    def _update_drawdown(self) -> None:
        self.state.stats.peak_equity = max(self.state.stats.peak_equity, self.state.stats.current_equity)
        peak = self.state.stats.peak_equity
        if peak <= 0:
            self.state.stats.max_drawdown = 0.0
            return
        drawdown = ((peak - self.state.stats.current_equity) / peak) * 100.0
        self.state.stats.max_drawdown = max(self.state.stats.max_drawdown, drawdown)

    def _build_event(
        self,
        snapshot: BarSnapshot,
        event_type: EventType,
        rank: float,
        current_spread: float,
    ) -> SignalEvent:
        if event_type is EventType.ENTER_LONG:
            message = f"ENTER-LONG_{self.config.webhook_key}"
        elif event_type is EventType.ENTER_SHORT:
            message = f"ENTER-SHORT_{self.config.webhook_key}"
        else:
            message = f"EXIT-ALL_{self.config.webhook_key}"

        return SignalEvent(
            event_type=event_type,
            message=message,
            timestamp=snapshot.timestamp,
            symbol=snapshot.symbol,
            timeframe=snapshot.timeframe,
            close=snapshot.close,
            percentile_rank=rank,
            current_spread=current_spread,
        )
