# SPEC — Scheduled takeaway order for routine morning coffee

> Status: specification only. No implementation belongs in this checkpoint.

## 1. Summary and Hill

Build the smallest end-to-end flow that lets a time-constrained office worker submit a routine takeaway order before arriving, receive a clear pickup time and order code, and lets staff see that order in the existing admin area.

This tests the Hill in [docs/hill.md](docs/hill.md): office workers with a routine coffee order should be able to collect it with predictable timing. The Wow target is 80% of valid morning orders collected within two minutes of arrival. The first release records information needed to measure this later; it does not claim the target has been achieved.

## 2. User and problem

The primary user is the worker represented by Interviewee B in [docs/empathy-map.md](docs/empathy-map.md). B arrived at 07.40, saw six people at the register, waited about eight minutes, and entered work at 07.58. B already messages a barista while travelling so the coffee can be made ahead, but that message is not always answered. The feature must reduce uncertainty in this workaround, not add unrelated engagement features.

## 3. Scope: in

- A customer page for choosing one currently available menu item, a valid same-day morning pickup time, and collection details required by the final design.
- Server-side creation of one takeaway order with a generated public order code, item snapshot, requested pickup time, and initial `received` status.
- A confirmation view that visibly shows the order code, item, pickup time, and received status after successful submission.
- An authenticated admin list for takeaway orders, including status changes from `received` to `ready`, `collected`, or `cancelled`.
- Privacy-safe analytics events for order-flow start and successful submission; names, phone numbers, notes, and order codes must never be analytics properties.
- Documentation of the new outcome metric in `tracking-plan.md`.

## 4. Out of scope

- WhatsApp, SMS, email, push notifications, or other third-party messaging.
- Payment, refunds, discounts, loyalty points, inventory reservation, delivery, and multi-item carts.
- Real-time queue length, preparation timers, capacity optimization, or a promise that a drink is physically ready at a particular minute.
- Table booking changes, menu-management redesign, and changes to the existing booking flow.
- Support for non-routine/customized orders in the first release.

## 5. User flow

1. A customer opens the scheduled takeaway page before the configured morning cutoff.
2. The page loads only currently available products from the existing products source and presents one choice.
3. The customer selects an allowed pickup time and provides required collection details.
4. Client validation explains missing or invalid values without submitting.
5. The server validates availability, cutoff, pickup time, and required fields; it creates the order only if all checks pass.
6. On success, the confirmation view displays the public order code, product, requested pickup time, and `received` status. On failure, the page shows a helpful error and keeps non-sensitive selections where safe.
7. An authenticated staff member opens the admin takeaway-order list, sees the new order, and can update its operational status.

## 6. Data and files involved

### Data model

Add a `takeaway_orders` table (or equivalent isolated model) rather than overloading `bookings`. Proposed fields: internal `id`, non-sequential public `order_code`, `product_id`, product-name/price snapshot, `customer_name`, `whatsapp`, `pickup_date`, `pickup_time`, `status`, and timestamps. Define a status constraint for `received`, `ready`, `collected`, and `cancelled`. Store the product snapshot so later menu edits do not rewrite historic orders.

### Existing files expected to change in Module 4

- `api/db/schema.sql` — new table, constraints, and indexes.
- `app/api/[...slug]/route.ts` — authenticated and public API routes plus server-side validation.
- `app/menu/page.tsx` or a new customer page — discoverable entry point and customer flow; final route name remains an implementation decision.
- New focused client components — picker/form and confirmation state, rather than expanding `components/booking-form.tsx` for a different domain.
- `app/admin/bookings/page.tsx` or a new focused admin page — final placement is an open implementation decision; it must remain authenticated.
- `components/booking-funnel-tracker.tsx`, `lib/posthog.ts`, and `tracking-plan.md` — add privacy-safe order events and metric definition.

### Open questions before implementation

- What morning cutoff and pickup-time increments match actual operations?
- Can staff reliably prepare an order before the requested time, and what capacity limit applies per slot?
- Is a contact number needed for collection if no notification channel is in scope? If not, remove it to minimize personal-data collection.

## 7. Acceptance criteria

1. **Given** a customer opens the flow before the configured cutoff, **when** they select one available product, a valid same-day pickup time, and submit valid required details, **then** exactly one takeaway order is persisted with status `received` and a non-empty public order code.
2. **Given** the flow is opened after the cutoff or with an invalid/past pickup time, **when** the customer submits, **then** no order is created and the UI explains why the requested time is unavailable.
3. **Given** an order is created successfully, **when** the server responds, **then** the confirmation view shows the same order code, product, requested pickup time, and `received` status that were saved.
4. **Given** an unauthenticated visitor requests the admin takeaway-order list or status update, **when** the request reaches the server, **then** it is rejected and no order data is disclosed or changed.
5. **Given** an authenticated staff member changes an order from `received` to `ready`, **when** the update succeeds, **then** a reload displays `ready` for that same order.
6. **Given** analytics is enabled, **when** the flow starts or submits successfully, **then** the corresponding event is captured without customer name, contact number, free-text content, or public order code.

## 8. End-to-end verification steps

1. Seed or create an available product; open the customer flow before the test cutoff and place one valid order.
2. Confirm the success view matches the database/API response and contains a public code, selected item, pickup time, and `received` status.
3. Sign in as an admin; confirm the same order appears, change it to `ready`, and reload to verify persistence.
4. In a logged-out browser, attempt to access the admin list and update route; verify both are rejected.
5. Submit after the cutoff and with a past or invalid time; verify no new row is created and the error is understandable.
6. Inspect analytics/debug output and confirm start/success events contain only approved non-personal properties.
7. Run lint, typecheck/build, and relevant automated tests before release.
