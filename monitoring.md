# Kopi Kita — Module 2 Monitoring Evidence

## Production health

- Health endpoint: [https://kopi-kita-rust.vercel.app/api/health](https://kopi-kita-rust.vercel.app/api/health)
- Expected response: `{"status":"ok"}`
- The endpoint returns no database host, credentials, or other implementation details.
- Verified after deployment: HTTP `200` with `{"status":"ok"}`.

## Sentry setup

- Sentry is initialized for the browser, Node.js server, and Edge runtime.
- Client initialization keeps PostHog enabled from `instrumentation-client.ts`.
- PII-heavy categories are disabled in the Sentry SDK configuration.
- Source maps are configured for upload during the Vercel build. `SENTRY_AUTH_TOKEN` must be stored in Vercel environment variables and is intentionally excluded from Git.

## Error-to-fix evidence

The faulty revision was deployed only to the `codex/sentry-practice-bug` Preview environment. It dereferenced `.id` from an empty booking response; the production branch did not receive that faulty deployment.

- Sentry issue: [JAVASCRIPT-NEXTJS-1](https://rizqi-roikhan.sentry.io/issues/7782673972/?project=4512224649674752&query=is%3Aunresolved&referrer=issue-stream) — `TypeError: Cannot read properties of null (reading 'id')` from `/sentry-practice` in Preview.
- Fix PR: [#1 — fix: handle empty booking response (JAVASCRIPT-NEXTJS-1)](https://github.com/rizqiroikhan/kopi-kita/pull/1) — merged into `master`.
- Root-cause fix: treats a missing booking as the explicit empty state `No booking selected`, rather than dereferencing `.id` from `null`.
- Resolved evidence: Sentry issue status was changed to **Resolved** after the safe Preview behavior was verified; capture the resolved-status screenshot with the submission.
- Source-map stack-trace screenshot: capture the **Stack Trace** tab for `JAVASCRIPT-NEXTJS-1` with `app/sentry-practice/page.tsx` visible before submission.

## Production monitor evidence

This section must only be completed from a real active monitor and alert.

- Uptime monitor URL and green-status screenshot: pending UptimeRobot setup.
- Deliberate monitor-failure alert email screenshot: pending after a controlled test.
- Vercel Speed Insights or Observability screenshot: pending Vercel dashboard capture.

## Completion checklist

- [x] Public health endpoint implemented.
- [x] Sentry connected with server/client error reporting. Source-map stack-trace screenshot still needs to be captured.
- [x] Practice bug deployed only to a preview branch and captured as `JAVASCRIPT-NEXTJS-1`.
- [x] Root-cause fix PR references the Sentry issue, is merged, and the issue is resolved.
- [ ] Uptime monitor is active, green, and has sent one test alert.
- [ ] Vercel Speed Insights or Observability evidence captured.
