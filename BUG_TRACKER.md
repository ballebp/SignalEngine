# Bug Tracker

Project: Trading Signal Automation (without TradingView)
Created: 2026-04-12

## Purpose
Track defects, incidents, and reliability issues with status, impact, root cause, and resolution.

## Severity Scale
- S1: Critical (live trading risk, wrong orders, or major outage)
- S2: High (incorrect behavior with workaround)
- S3: Medium (partial feature impact)
- S4: Low (minor issue, cosmetic, or documentation)

## Status Values
- Open
- Investigating
- Blocked
- Fixed
- Verified
- Closed

## Bugs

| ID | Date | Title | Severity | Status | Area | Environment | Repro Steps | Expected | Actual | Root Cause | Fix | Owner | Verified On |
|----|------|-------|----------|--------|------|-------------|------------|----------|--------|------------|-----|-------|-------------|
| BUG-0001 | 2026-04-12 | Placeholder: duplicate alert dedup check | S2 | Open | Alert Dispatcher | Local | Send same signal twice in <60s | One webhook accepted | Two webhooks sent | Pending | Pending | balle | Pending |
| BUG-0002 | 2026-04-12 | AD1 screenshot stop-loss does not match Pine default | S3 | Verified | Strategy Config | Documentation / Source Comparison | Compare screenshot labels with AD1 Pine defaults | Visual evidence and source defaults align | Screenshot shows SL -6 percent while Pine default is 1.0 percent | Runtime TradingView inputs override Pine defaults for the deployed bot | Capture runtime settings and treat source defaults separately from bot config | balle | 2026-04-12 |

## Incident Log

### 2026-04-12
- No production incidents yet.

---

## Bug Entry Template

ID: BUG-XXXX
Date:
Title:
Severity: S1|S2|S3|S4
Status: Open|Investigating|Blocked|Fixed|Verified|Closed
Area:
Environment:

Repro Steps:
1.
2.
3.

Expected:

Actual:

Root Cause:

Fix:

Owner:
Verified On:
Notes:
