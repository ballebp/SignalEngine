from __future__ import annotations

import json
from urllib import request

from .config import AD1Config
from .models import SignalEvent


class WebhookDispatcher:
    def __init__(self, config: AD1Config, dry_run: bool = False) -> None:
        self.config = config
        self.dry_run = dry_run

    def dispatch(self, event: SignalEvent) -> dict[str, object]:
        if not self.config.alerts_enabled:
            return {"sent": False, "reason": "alerts_disabled", "message": event.message}

        if self.dry_run:
            return {"sent": False, "reason": "dry_run", "message": event.message}

        if self.config.request_format == "raw_text":
            body = event.message.encode("utf-8")
            content_type = "text/plain; charset=utf-8"
        else:
            body = json.dumps({"message": event.message}).encode("utf-8")
            content_type = "application/json"

        headers = {"Content-Type": content_type}
        if self.config.auth_header_name and self.config.auth_header_value:
            headers[self.config.auth_header_name] = self.config.auth_header_value

        http_request = request.Request(
            url=self.config.webhook_url,
            data=body,
            headers=headers,
            method="POST",
        )

        with request.urlopen(http_request, timeout=10) as response:
            response_body = response.read().decode("utf-8", errors="replace")
            return {
                "sent": True,
                "status": response.status,
                "message": event.message,
                "response": response_body,
            }
