# Kopi Kita — Module 2 Monitoring Evidence

## Production health

- Health endpoint: [https://kopi-kita-rust.vercel.app/api/health](https://kopi-kita-rust.vercel.app/api/health)
- Expected response: `{"status":"ok"}`
- The endpoint returns no database host, credentials, or other implementation details.

## Error-to-fix evidence

This section must only be completed from a real Sentry issue created on a preview deployment. The practice bug must remain on its own branch and must never merge into `master`.

- Sentry issue URL and screenshot: pending Sentry project setup.
- Fix PR URL, mentioning the Sentry issue ID: pending.
- Resolved issue screenshot: pending after the fix deploys.

## Production monitor evidence

This section must only be completed from a real active monitor and alert.

- Uptime monitor URL and green-status screenshot: pending UptimeRobot setup.
- Deliberate monitor-failure alert email screenshot: pending after a controlled test.
- Vercel Speed Insights or Observability screenshot: pending Vercel dashboard capture.

## Completion checklist

- [x] Public health endpoint implemented.
- [ ] Sentry connected with source maps and server/client error reporting.
- [ ] Practice bug deployed only to a preview branch and captured as a Sentry issue.
- [ ] Root-cause fix PR references the Sentry issue, is merged, and the issue is resolved.
- [ ] Uptime monitor is active, green, and has sent one test alert.
- [ ] Vercel Speed Insights or Observability evidence captured.
