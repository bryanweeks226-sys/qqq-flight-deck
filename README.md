# QQQ Flight Deck

Mobile-first, read-only QQQ research dashboard. **Research and shadow-mode decision support only**; it does not authorize or place trades.

## Open the dashboard

The app is static HTML (`index.html`) plus published, sanitized JSON files under `data/`. Serve it from the repository root on HTTPS (for example via GitHub Pages, if configured). The precise production URL is controlled by the repository's hosting settings; do not assume a URL from the repository name alone.

On an iPhone, open the deployed HTTPS URL in Safari, then use Share → Add to Home Screen. The top **QQQ AT A GLANCE** card is the primary summary. Native `<details>` sections below it provide tap-to-expand analysis.

## Data contract and safety

The primary JSON inputs are `data/shadow_live_latest.json` and `data/position_transition_plan.json`. Additional public research feeds enrich the dashboard. The primary shadow feed must explicitly report `execution_authorized: false`, synchronized inputs, an expected market session matching its reported market date, a finite nonnegative exposure, and a valid recently generated timestamp. Otherwise the app shows an unverified/stale warning and withholds the headline exposure and tactical state. Valid but delayed publications are separately labeled **PUBLICATION DELAY — VERIFY**; they are still withheld from the current headline.

The current client-side timestamp limit is 36 hours from `generated_at_utc` for displaying **CURRENT**. A valid but older publication is labeled **PUBLICATION DELAY — VERIFY**, rather than treated as malformed. This is an operational freshness limit, **not** a trading-session calendar; weekends, holidays, missed schedules, and market closures require careful review. Never equate a green UI with permission to trade.

## Checks before and after deployment

1. Run `node tests/flight-deck.test.cjs` from the repository root (Node 22 recommended). The `Flight Deck UI safety tests` GitHub Actions workflow also runs on pushes to `main` and pull requests when Actions is enabled.
2. Verify the hosted page loads over HTTPS on iPhone Safari, is readable at normal zoom, and all collapsible panels open and close.
3. Inspect browser network requests or open `data/shadow_live_latest.json` and `data/position_transition_plan.json` at the same deployed origin. Both must return valid JSON with successful HTTP responses.
4. Compare the displayed market session and generated timestamp to the latest engine publication. Check `execution_authorized` is explicitly false.
5. Simulate a missing or invalid primary feed in a staging copy. Confirm the headline changes to **DATA UNAVAILABLE** or **UNVERIFIED**, never a current exposure or live tactical signal.
6. Check the GitHub Actions run and hosting deployment status. A merge or successful commit alone does **not** verify production availability.

## Troubleshooting

- **DATA UNAVAILABLE:** Primary JSON failed to load or parse. Check hosting, paths, HTTP status, and publication workflow.
- **UNVERIFIED / STALE:** Data failed integrity, expected-session, or 36-hour timestamp checks. Check engine generation time, market calendar, and synchronization.
- **Optional panels unavailable:** An optional feed may be missing independently; do not infer its state from the headline card.
- **No Actions checks:** Verify Actions is enabled and the workflow has run; GitHub's combined commit status may be empty even when Actions exists.

The private `qqq-trader` engine owns strategy validation, research parameters, and publication. This public repository is presentation-only. Never publish credentials, brokerage identifiers, or private portfolio records here.
