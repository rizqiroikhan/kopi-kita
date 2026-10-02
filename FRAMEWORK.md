# Module 3 Execution Framework

Target repository: `traceability-of-recycled-plastic-supply-chain`

Product: traceability of recycled-plastic batches from collection and processing through final use. This framework is based on the Kopi Kita workflow: inspect before editing, keep public UI stable, isolate admin work, validate API and database behavior, test phone layouts, and commit in small, reviewable stages.

## Non-negotiable scope

- Preserve the Module 2 public frontend. Do not modify `/`, `/batches`, or `/batches/[id]`, existing public components, public styles, or visual identity.
- Add admin work only under `/admin` and isolated admin components/styles. Do not perform unrelated refactoring.
- Read the repository's `AGENTS.md`, existing blueprint, `README`, and relevant Next.js guide in `node_modules/next/dist/docs/` before coding.
- Use TypeScript, semantic HTML, accessible controls, and existing project conventions.

## Four prompt questions

1. **What are we building?** A reliable recycled-plastic batch traceability system.
2. **What must it contain?** Batch records, event history, public read access, validated writes, protected admin management, PostgreSQL persistence, and evidence.
3. **How should it behave?** Correct validation, status codes, sorting, useful errors, responsive admin workflows, and no regressions to public routes.
4. **How should it look?** Consistent with Module 2 publicly; the admin CMS should be clear, calm, readable, touch-friendly, and visually separate.

## Stage plan

For every stage: make only the listed changes, run the commands, complete the QC gate below, commit with the exact message, push, then continue automatically. Stop only for a real blocker (missing credentials, unavailable Docker/database, broken baseline, or an unsafe/destructive ambiguity); report the command, error, and safe next action. Never claim a test passed unless it was actually run.

### 1. Blueprint

Objective: understand the repository and write the design before implementation.

Files: create `docs/module-3-blueprint.md` (or the repository's existing blueprint location); do not change public app files.

Commands:

```bash
git status --short
rg --files
Get-Content AGENTS.md README.md
git log --oneline -12
```

Document the four prompt questions, route constraints, risks, and this table design:

| Table | Important columns | Purpose/relationships |
|---|---|---|
| `batches` | `id`, `batch_code`, `material_type`, `weight_kg`, `source_location`, `processed_at`, `current_status`, `created_at` | One traceable recycled-plastic batch; unique code. |
| `batch_events` | `id`, `batch_id`, `event_type`, `event_date`, `location`, `actor`, `notes`, `created_at` | Ordered custody/processing events; FK to `batches`. |
| optional `facilities` | only if required by the blueprint | Normalize repeated facilities only when it materially helps the product. |

Expected result: a reviewed, product-specific schema plan with types, constraints, indexes, and relationships. Commit: `chore: define module 3 backend blueprint`.

### 2. PostgreSQL setup and schema

Objective: create reproducible local persistence and realistic seed data.

Files: `docker-compose.yml`, `.env.example`, local ignored `.env`, `api/db/schema.sql`, `api/db/seed.sql`, and a documented runner such as `api/db/apply-schema.ps1` plus `.cmd` fallback on Windows.

Commands:

```bash
docker compose up -d
docker compose ps
docker compose exec db psql -U <project_user> -d <project_db> -f /tmp/schema.sql
docker compose exec db psql -U <project_user> -d <project_db> -f /tmp/seed.sql
```

Use a project-specific database/user/volume. Add `.env` to `.gitignore` and put `!.env.example` immediately below any `.env*` rule. Verify `git check-ignore -v .env` succeeds and `.env.example` is not ignored. Seed believable batch rows and multiple events, not placeholder lorem ipsum.

Expected result: `docker compose ps` shows healthy/running Postgres; `SELECT COUNT(*)` and representative `SELECT` queries return seeded rows. Commit: `chore: add postgres docker setup and schema`.

### 3. Batch API

Objective: expose public reads and validated writes with consistent JSON errors.

Files: `api/server.ts`, `api/db.ts`, API-specific helpers/types, package scripts/dependencies, and `.env.example` only as needed. Do not touch public frontend files.

Commands:

```bash
npm install express pg dotenv cors
npm install -D tsx @types/express @types/pg @types/cors
npm run dev:api
curl -i http://localhost:4000/api/batches
curl -i http://localhost:4000/api/batches/<batch_code>
```

Implement a public `GET /api/batches` (optional status/material filter) and `GET /api/batches/:id` with events. Implement a validated write endpoint such as `POST /api/batches` and/or `PATCH /api/batches/:id`. Validate required fields, positive weights, valid dates/statuses, unique batch codes, and event relationships. Return JSON only: `201` create, `200` read/update, `400` invalid input, `404` missing batch, `401` unauthenticated admin operation, `500` server failure. Preserve date-only values as `YYYY-MM-DD` strings with the PostgreSQL type parser. Add `dev:api` using `tsx watch`.

Expected result: happy and malformed curl requests prove body and status behavior; server stays running after bad input. Commit: `feat: add recycled plastic batch api`.

### 4. Protected admin CMS

Objective: let authenticated staff manage batches and inspect event history without changing public pages.

Files: `app/admin/**`, isolated `components/admin/**` and `lib/admin/**` if useful, login/session middleware, and only API files required for authentication/status updates.

Commands:

```bash
npm run dev
npm run dev:api
```

Add `/admin/login`, `/admin/batches`, and an add/edit batch workflow. Protect writes and admin reads with a real login/session or signed token; never expose secrets in client bundles. Show validation errors inline, loading/empty/error states, status and event history, and accessible labels. Keep public routes and components untouched. Test at desktop and `375px` width.

Expected result: unauthenticated admin request returns `401`; login permits CMS operations; create/edit/status changes remain after refresh and are visible in PostgreSQL. Commit: `feat: add protected batch management cms`.

### 5. Happy and naughty paths

Objective: prove the backend and CMS reject bad input without crashing and preserve valid data.

Files: tests or `docs/module-3-test-evidence.md`, plus fixes only in affected implementation files.

Commands:

```bash
curl -i -X POST http://localhost:4000/api/batches -H "Content-Type: application/json" -d '<valid JSON>'
curl -i -X POST http://localhost:4000/api/batches -H "Content-Type: application/json" -d '<missing field JSON>'
curl -i -X PATCH http://localhost:4000/api/batches/<id> -H "Authorization: Bearer <token>" -d '<invalid status JSON>'
docker compose exec db psql -U <user> -d <db> -c "SELECT ... FROM batches;"
npm run lint
npm run build
```

Check malformed JSON, missing fields, negative weight, duplicate code, unknown batch, invalid event/status, unauthorized write, and valid create/update. Record actual outputs and status codes. Commit: `test: verify backend and cms happy and naughty paths`.

### 6. Admin visual polish

Objective: improve hierarchy and responsive usability without scope creep.

Files: admin-only components/styles and relevant admin metadata.

Commands:

```bash
npm run lint
npm run build
```

Fix only observed admin issues: clipping, overlap, bad wrapping, tiny touch targets, horizontal overflow, unreadable status labels, or console errors. Re-test desktop and `375px`; confirm public pages remain unchanged. Commit: `style: polish admin cms`.

## Mandatory QC/QA gate before every commit

1. Run `git diff --stat` and `git diff`; confirm only intended files changed.
2. Confirm `/`, `/batches`, `/batches/[id]`, public components, and public styles were not changed.
3. Test the current feature and both valid and invalid inputs.
4. Verify JSON response bodies and exact HTTP status codes with `curl -i`.
5. Check relevant database rows with `psql`.
6. Confirm public routes still load and links work.
7. Test `/admin` at desktop and `375px`; check clipping, overlap, wrapping, touch targets, and horizontal overflow.
8. Check browser console for errors and warnings.
9. Run `npm run lint` and `npm run build`.
10. Confirm `.env` does not appear in `git status`; inspect staged files and ensure no secrets are committed.
11. Commit only after all checks pass, then push. Continue to the next stage automatically.

## Safe environment and Git rules

- Keep real secrets only in ignored `.env`; commit `.env.example` with variable names and safe placeholders.
- Never print, commit, or paste passwords, tokens, or connection strings.
- Use `git add` with reviewed paths (or `git add -A` only after the diff review). Check `git status --short` before and after commits.
- Do not use `git reset --hard`, broad deletion, force-push, or destructive database commands. Prefer recoverable, explicit operations.
- Do not invent test results, screenshots, routes, or database rows.

## Final verification and LMS evidence

Before final submission, verify:

- Docker Postgres is running with a named volume and data survives `down` then `up`.
- Schema, seed rows, relationships, and event history are queryable with `psql`.
- Public batch reads work; validated writes and status/event changes persist.
- Admin login protects all write operations and unauthorized requests return `401`.
- Public routes are unchanged and responsive; admin works at desktop and `375px` with no console errors or overflow.
- `npm run lint` and `npm run build` pass.
- `.env` is ignored and absent from GitHub; staged diff contains no secrets.

Capture LMS evidence without secrets:

1. One terminal screenshot showing `docker compose ps`, a public `curl` response, and representative `psql` row counts.
2. One screenshot of `/admin/batches` at desktop with realistic rows/events.
3. One screenshot of `/admin/batches` at `375px` proving readable responsive layout.
4. One terminal screenshot of an unauthenticated admin request showing `401`, plus a valid authenticated request if required.
5. Include actual commands/results, not fabricated output.

## Final LMS note

Use this concise structure:

> Built a traceability backend and isolated admin CMS for recycled-plastic batches. `batches` stores each uniquely identified material batch; `batch_events` records collection, processing, custody, and final-use milestones linked by foreign key. The API provides public batch listing/detail reads plus validated protected writes with clear `200/201/400/401/404/500` responses. The admin CMS adds authenticated batch management and event/status visibility while preserving the Module 2 public frontend. PostgreSQL in Docker provides repeatable local persistence, and the evidence shows API behavior, database rows, authentication fencing, and responsive CMS behavior.

Final commit URL format:

```text
https://github.com/<owner>/<repo>/commit/<full-commit-sha>
```
