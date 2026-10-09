# npm Audit — 9 October 2026

## Summary

Command run locally: `npm audit --json`

| Severity | Count |
| --- | ---: |
| Critical | 0 |
| High | 5 |
| Moderate / low / info | 0 |

## Fixed

`next` and `eslint-config-next` were upgraded from 16.3.7 to 16.4.0. This updates the direct Next.js dependency that had high-severity audit findings. `npm run build` completed successfully after the update.

## Postponed with reason

The remaining five high findings are the development lint chain `eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces` (including GHSA-vfj7-8cjw-p6xm). npm's only offered fix is `eslint-config-next@14.2.35`, marked as a semver-major change. That would downgrade the project from Next.js 16.4.0 to a mismatched lint configuration, so `npm audit fix --force` was not run.

These packages are development tooling, not production runtime dependencies. The risk is accepted temporarily while Dependabot alerts and weekly npm updates watch for a compatible remediation. There are no critical findings left unexplained.
