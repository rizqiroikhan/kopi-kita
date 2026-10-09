# Kopi Kita Threat Model

## 1. Assets

- Customer booking data: name, WhatsApp number, visit date/time, party size, and notes.
- Admin ability to read bookings and change menu or booking status.
- Admin session cookie, database connection string, and session secret.
- Availability and integrity of the booking and menu experience.

## 2. Entry Points

- Public booking form and `POST /api/bookings`.
- Admin login plus protected product and booking API routes.
- Next.js API proxy, deployment environment variables, npm dependencies, and CI/CD build path.

## 3. Threats & Mitigations

| Threat | OWASP Top 10:2025 | Mitigation |
| --- | --- | --- |
| An unauthenticated user reads or changes bookings/products. | A01 Broken Access Control; A07 Authentication Failures | Server-side `requireAdmin` protects privileged routes; the session uses an HTTP-only cookie. Keep authorization checks on every protected endpoint; add login rate limiting and CSRF/origin protection before wider release. |
| Malicious booking or product input changes a database query. | A05 Injection | Validate required fields, types, ranges, and enum values; use parameterized PostgreSQL queries (`$1…$n`), never string-built SQL. |
| A secret or customer data is exposed through configuration, telemetry, or an overly detailed health/error response. | A02 Security Misconfiguration; A04 Cryptographic Failures | Keep `.env*` ignored, store secrets only in Vercel environment variables, return only `{\"status\":\"ok\"}` from health, and keep PostHog capture disabled on admin pages. Review production environment scopes before deployment. |
| A compromised or vulnerable dependency reaches the build/runtime. | A03 Software Supply Chain Failures | Commit the lockfile, run `npm audit`, patch direct runtime dependencies, and enable weekly Dependabot updates/alerts. Review remaining advisories before upgrading or releasing. |
| An unexpected failure leaks internals or leaves the user without an actionable response. | A10 Mishandling of Exceptional Conditions; A09 Security Logging & Alerting Failures | Return generic API errors, use Sentry for error visibility, and use `/api/health` with UptimeRobot for availability alerts. |

## 4. Residual Risk

This small app has no dedicated identity provider, rate limiter, or automated penetration test. Admin credentials and Vercel secret access remain high-value operational controls. Five high-severity, development-only lint dependency advisories remain because npm's offered remediation is an incompatible major downgrade; they are documented in `security/npm-audit.md` and will be tracked by Dependabot.
