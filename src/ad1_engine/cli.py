from __future__ import annotations

import argparse
from dataclasses import asdict
import json
from pathlib import Path

from .config import load_config
from .dispatcher import WebhookDispatcher
from .engine import AD1Engine
from .models import BarSnapshot


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run the standalone AD1 engine over JSONL snapshots.")
    parser.add_argument("--config", required=True, help="Path to the AD1 config JSON file")
    parser.add_argument("--input", required=True, help="Path to JSONL snapshot input")
    parser.add_argument("--dry-run", action="store_true", help="Generate events without sending webhooks")
    parser.add_argument("--summary-out", help="Optional path to write the final backtest summary JSON")
    return parser.parse_args()


def load_snapshot(line: str) -> BarSnapshot:
    raw = json.loads(line)
    return BarSnapshot(
        timestamp=raw["timestamp"],
        symbol=raw["symbol"],
        timeframe=raw["timeframe"],
        confirmed=bool(raw["confirmed"]),
        close=float(raw["close"]),
        high=float(raw["high"]),
        low=float(raw["low"]),
        sources={key: (None if value is None else float(value)) for key, value in raw.get("sources", {}).items()},
    )


def main() -> None:
    args = parse_args()
    config = load_config(args.config)
    engine = AD1Engine(config)
    dispatcher = WebhookDispatcher(config, dry_run=args.dry_run)

    input_path = Path(args.input)
    with input_path.open("r", encoding="utf-8") as handle:
        for line_number, line in enumerate(handle, start=1):
            stripped = line.strip()
            if not stripped:
                continue
            snapshot = load_snapshot(stripped)
            event = engine.process_bar(snapshot)
            if event is None:
                continue
            result = dispatcher.dispatch(event)
            print(
                json.dumps(
                    {
                        "line": line_number,
                        "event": event.event_type,
                        "message": event.message,
                        "timestamp": event.timestamp,
                        "dispatch": result,
                    }
                )
            )

    summary = asdict(engine.backtest_summary())
    print(json.dumps({"summary": summary}))

    if args.summary_out:
        output_path = Path(args.summary_out)
        output_path.write_text(json.dumps(summary, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
