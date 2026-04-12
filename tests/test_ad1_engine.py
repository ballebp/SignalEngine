from ad1_engine.config import AD1Config
from ad1_engine.engine import AD1Engine
from ad1_engine.models import BarSnapshot, EventType


def make_config() -> AD1Config:
    return AD1Config(
        indicator_id="AD1",
        symbol="FARTCOINUSDT.P",
        timeframe="5m",
        webhook_url="https://example.invalid/webhook",
        webhook_key="Binance_Dem",
        alerts_enabled=True,
        request_format="raw_text",
        take_profit_percent=1.5,
        stop_loss_percent=6.0,
        unusual_percentile_threshold=90.0,
        history_limit=500,
        source_symbols={
            "sym_1": "BINANCE:BTCUSDT",
            "sym_2": "COINBASE:BTCUSD",
            "sym_3": "KRAKEN:BTCUSD",
            "sym_4": "BITSTAMP:BTCUSD",
        },
    )


def make_bar(*, close: float, high: float, low: float, sources: dict[str, float | None], confirmed: bool = True) -> BarSnapshot:
    return BarSnapshot(
        timestamp="2026-04-12T12:00:00Z",
        symbol="FARTCOINUSDT.P",
        timeframe="5m",
        confirmed=confirmed,
        close=close,
        high=high,
        low=low,
        sources=sources,
    )


def seed_engine(engine: AD1Engine, count: int = 9) -> None:
    for _ in range(count):
        event = engine.process_bar(
            make_bar(
                close=100.0,
                high=100.1,
                low=99.9,
                sources={"sym_1": 100.0, "sym_2": 100.0, "sym_3": 100.0, "sym_4": 100.0},
            )
        )
        assert event is None


def test_generates_long_entry_when_current_price_is_below_average_and_spread_is_unusual() -> None:
    engine = AD1Engine(make_config())
    seed_engine(engine)

    event = engine.process_bar(
        make_bar(
            close=100.0,
            high=100.2,
            low=99.8,
            sources={"sym_1": 104.0, "sym_2": 103.0, "sym_3": 102.5, "sym_4": 102.0},
        )
    )

    assert event is not None
    assert event.event_type == EventType.ENTER_LONG
    assert event.message == "ENTER-LONG_Binance_Dem"


def test_generates_short_entry_when_current_price_is_above_average_and_spread_is_unusual() -> None:
    engine = AD1Engine(make_config())
    seed_engine(engine)

    event = engine.process_bar(
        make_bar(
            close=104.0,
            high=104.2,
            low=103.8,
            sources={"sym_1": 100.0, "sym_2": 100.5, "sym_3": 101.0, "sym_4": 101.5},
        )
    )

    assert event is not None
    assert event.event_type == EventType.ENTER_SHORT
    assert event.message == "ENTER-SHORT_Binance_Dem"


def test_exits_long_at_take_profit_before_stop_loss() -> None:
    engine = AD1Engine(make_config())
    seed_engine(engine)
    entry = engine.process_bar(
        make_bar(
            close=100.0,
            high=100.2,
            low=99.8,
            sources={"sym_1": 104.0, "sym_2": 103.0, "sym_3": 102.5, "sym_4": 102.0},
        )
    )
    assert entry is not None

    exit_event = engine.process_bar(
        make_bar(
            close=100.5,
            high=102.0,
            low=93.0,
            sources={"sym_1": 100.5, "sym_2": 100.5, "sym_3": 100.5, "sym_4": 100.5},
        )
    )

    assert exit_event is not None
    assert exit_event.event_type == EventType.EXIT_ALL
    assert exit_event.message == "EXIT-ALL_Binance_Dem"
    assert engine.state.stats.wins == 1


def test_does_not_enter_on_unconfirmed_bar() -> None:
    engine = AD1Engine(make_config())
    seed_engine(engine)

    event = engine.process_bar(
        make_bar(
            close=100.0,
            high=100.2,
            low=99.8,
            confirmed=False,
            sources={"sym_1": 104.0, "sym_2": 103.0, "sym_3": 102.5, "sym_4": 102.0},
        )
    )

    assert event is None


def test_backtest_summary_reports_completed_trade_metrics() -> None:
    engine = AD1Engine(make_config())
    seed_engine(engine)

    entry = engine.process_bar(
        make_bar(
            close=100.0,
            high=100.2,
            low=99.8,
            sources={"sym_1": 104.0, "sym_2": 103.0, "sym_3": 102.5, "sym_4": 102.0},
        )
    )
    assert entry is not None

    exit_event = engine.process_bar(
        make_bar(
            close=100.5,
            high=102.0,
            low=93.0,
            sources={"sym_1": 100.5, "sym_2": 100.5, "sym_3": 100.5, "sym_4": 100.5},
        )
    )
    assert exit_event is not None

    summary = engine.backtest_summary()

    assert summary.total_trades == 1
    assert summary.wins == 1
    assert summary.losses == 0
    assert summary.win_rate == 100.0
    assert summary.net_pl_percent == 1.5
    assert summary.ending_equity == 101.5
    assert summary.open_position == "FLAT"
