# Temuan Week 2 Module 4

| Finding | OWASP Top 10:2025 | Attack scenario | Evidence / remediation | Status |
| --- | --- | --- | --- | --- |
| Missing browser security headers and a restrictive CSP | A02 Security Misconfiguration; A05 Injection | A malicious site frames the app or injects content that the browser is allowed to load. | This PR adds CSP, HSTS, clickjacking, MIME, referrer, permissions, and cross-origin headers in `next.config.ts`. CSP retains the required PostHog and Sentry connections. | Fixed in this PR |
| Session cookie was not marked `Secure` for production HTTPS | A07 Authentication Failures | A session cookie could be sent over an insecure connection if one were available. | `Set-Cookie` now has `HttpOnly; SameSite=Lax; Secure` when `NODE_ENV=production`. | Fixed in this PR |
| Brute-force attempts against admin login are not rate limited | A07 Authentication Failures | An attacker repeatedly guesses the admin password. | Follow-up rate-limit PR will return `429` after five failed attempts in a 15-minute window. | Open — follow-up PR |
| Seeded admin password must be replaced in the production database | A07 Authentication Failures | Anyone who knows the sample credential can attempt an admin login. | Change the production admin password to a unique value and remove/avoid the seed credential outside local development. | Open — operator action |
| Protected admin endpoints must reject requests without a session | A01 Broken Access Control | An unauthenticated caller requests booking or product administration APIs. | `requireAdmin` guards product mutation and booking read/update routes. Local curl proof is recorded in this PR. | Fixed — verified locally |

## Local curl proof: unauthenticated admin routes

Verified against `http://localhost:3010` without a `kopikita_session` cookie:

```text
GET    /api/bookings              -> 401 Unauthorized
POST   /api/products              -> 401 Unauthorized
PUT    /api/products/1            -> 401 Unauthorized
DELETE /api/products/1            -> 401 Unauthorized
PATCH  /api/bookings/1            -> 401 Unauthorized
```

No production or third-party target was used for this verification.

## Local header proof after hardening

```text
Content-Security-Policy: default-src 'self'; ... connect-src 'self' https://us.i.posthog.com https://o4512224644956160.ingest.us.sentry.io; ...
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: DENY
```
