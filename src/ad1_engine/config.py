from __future__ import annotations

from dataclasses import dataclass
import json
from pathlib import Path


@dataclass(slots=True)
class AD1Config:
    indicator_id: str
    symbol: str
    timeframe: str
    webhook_url: str
    webhook_key: str
    alerts_enabled: bool
    request_format: str
    take_profit_percent: float
    stop_loss_percent: float
    unusual_percentile_threshold: float
    history_limit: int
    source_symbols: dict[str, str]
    auth_header_name: str | None = None
    auth_header_value: str | None = None


def load_config(path: str | Path) -> AD1Config:
    file_path = Path(path)
    with file_path.open("r", encoding="utf-8") as handle:
        raw = json.load(handle)

    return AD1Config(
        indicator_id=raw["indicator_id"],
        symbol=raw["symbol"],
        timeframe=raw["timeframe"],
        webhook_url=raw["webhook_url"],
        webhook_key=raw["webhook_key"],
        alerts_enabled=raw.get("alerts_enabled", True),
        request_format=raw.get("request_format", "raw_text"),
        take_profit_percent=float(raw["take_profit_percent"]),
        stop_loss_percent=float(raw["stop_loss_percent"]),
        unusual_percentile_threshold=float(raw["unusual_percentile_threshold"]),
        history_limit=int(raw.get("history_limit", 500)),
        source_symbols=dict(raw["source_symbols"]),
        auth_header_name=raw.get("auth_header_name"),
        auth_header_value=raw.get("auth_header_value"),
    )
