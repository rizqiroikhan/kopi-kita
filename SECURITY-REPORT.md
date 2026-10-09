# Kopi Kita — Security & Reliability Report

## Product & Data

Kopi Kita is a public coffee-menu and table-booking app with a small authenticated admin CMS. The product metric is booking completion: unique users who send `booking_submitted` after `booking_started` over seven days. The target is **at least 30%**; the current production sample on 9 October 2026 is **100% (6/6 unique users)**. [Open the PostHog booking-completion insight](https://us.posthog.com/project/653083/insights/CZF20Q6g).

Sentry is installed with source maps; the practice issue `JAVASCRIPT-NEXTJS-1` was fixed and resolved. UptimeRobot monitors `https://kopi-kita-rust.vercel.app/api/health` and is currently up. Health replies only `{"status":"ok"}` and exposes no database detail.

## Scope

Only the Kopi Kita repository, its local CI containers, and owned preview environments are in scope. Production active scanning and any third-party asset are out of scope. The signed boundaries are recorded in [security/scope.md](security/scope.md).

## Methodology

The Autopilot GitHub Actions workflow runs on pull requests, weekly schedule, manual dispatch, and updates to `master`. It uses `npm audit`, Gitleaks history scanning, Semgrep OWASP rules, a ZAP baseline against `http://localhost:3000` with a disposable Postgres service container, and Lighthouse CI against `/`, `/menu`, and `/booking`.

Lighthouse reads only `NEON_CI_DATABASE_URL`, a GitHub secret that must point to the isolated Neon child branch named `ci`; it never uses a production database URL. The workflow has only `contents: read` permission and contains no credential values.

## Findings

| Finding | OWASP Top 10:2025 | Status | Evidence / action |
| --- | --- | --- | --- |
| Missing browser headers, CSP, and secure production cookie flags | A02 Security Misconfiguration; A05 Injection; A07 Authentication Failures | Fixed | Merged PR [#9](https://github.com/rizqiroikhan/kopi-kita/pull/9) adds CSP, HSTS, frame/MIME/referrer/permissions headers and `HttpOnly; Secure; SameSite=Lax` session cookies. |
| Unlimited failed admin logins | A07 Authentication Failures | Fixed | Merged PR [#10](https://github.com/rizqiroikhan/kopi-kita/pull/10) returns `429` after five failed attempts in a 15-minute window. |
| Known seeded admin password in production | A07 Authentication Failures | Open until operator confirms reset | Reset the production password to a unique value and revoke sessions. This action is intentionally not automated by CI. |
| Five high findings in development lint tooling | A06 Vulnerable and Outdated Components | Accepted temporarily | `npm audit` has no critical finding. The only offered remediation downgrades the Next.js lint chain; details are in [security/npm-audit.md](security/npm-audit.md). |
| Unauthenticated access to admin APIs | A01 Broken Access Control | Fixed | Local curl proof in [security/temuan-w2m4.md](security/temuan-w2m4.md) shows `401` for every protected admin route without a login cookie. |
| Framework disclosure and missing embedder isolation | A02 Security Misconfiguration | Fixed | Autopilot PR disables `X-Powered-By` and sets `Cross-Origin-Embedder-Policy: require-corp`. |

## Proof of Fixes

- [PR #9](https://github.com/rizqiroikhan/kopi-kita/pull/9): SecurityHeaders score reached A after the CSP/header deployment; PostHog production `$pageview` events continued and `/admin` showed no CSP console errors.
- [PR #10](https://github.com/rizqiroikhan/kopi-kita/pull/10): six invalid preview-only logins demonstrate five `401` responses followed by `429` with `Retry-After`.
- The Autopilot run links are added to the merge PR once the first PR run and the post-merge `master` run complete.

## Accepted Risk

The login counter is intentionally in-memory for this small deployment and therefore is per server instance; adopt a shared store before treating it as an internet-scale rate limit. `unsafe-inline` remains in CSP for the current Next.js styling/runtime compatibility and is tracked as a CSP hardening follow-up. Dynamic and intentional 404 responses remain non-cacheable. Both ZAP accepted warnings have explicit reasons in `.zap/rules.tsv` and [security/temuan-w2m4.md](security/temuan-w2m4.md). Development-only npm audit findings are accepted only while Dependabot and weekly Autopilot checks remain enabled.

## Before / After Baseline

| Check | Baseline | Current threshold / result |
| --- | --- | --- |
| Lighthouse performance | Baseline captured by first Autopilot run | Must remain **>= 0.70** for `/`, `/menu`, `/booking` |
| Lighthouse accessibility | Baseline captured by first Autopilot run | Must remain **>= 0.80** for `/`, `/menu`, `/booking` |
| Headers | Previous preview scan lacked `Permissions-Policy` | Production SecurityHeaders scan is A with CSP, HSTS, XFO, XCTO, referrer and permissions policy present |
| Error/uptime | Practice TypeError was unresolved | Issue resolved; `/api/health` monitor is up |
