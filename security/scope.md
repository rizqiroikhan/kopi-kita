# Authorized Security Scope — Kopi Kita

**Owner:** Rizqi Roikhan  
**Date:** 9 October 2026  
**Purpose:** checkpoint security review only; this is not permission for production testing.

## Assets I may test

- This local `kopi-kita` source checkout, its Git history, dependency manifest and lockfile.
- Local, non-production dependency and secret checks: `npm audit` and `gitleaks git -v`.
- My own GitHub repository configuration for Dependabot, viewed and configured through GitHub.
- Documentation and evidence created for this checkpoint.

## Assets I may not test

- The production site, preview deployments, APIs, database, Vercel infrastructure, or domains.
- Other users' accounts, bookings, sessions, personal data, or credentials.
- PostHog, Sentry, UptimeRobot, GitHub, Neon, npm, and any other third-party service beyond normal dashboard use.

## Allowed and prohibited methods

Allowed: passive source/configuration review and the local commands named above.  
Prohibited: port scans, vulnerability scans, fuzzing, load tests, brute force, exploitation, or any request intended to alter or interrupt a service.

## Owner acknowledgement

I authorize only the scope above. I understand that work outside it requires new written permission.

**Signature:** ________________________________  
**Signed date:** ______________________________

> Attach a photo/scan of this signed page to the pull request description as `scope-signed.jpg` or `scope-signed.pdf`.
