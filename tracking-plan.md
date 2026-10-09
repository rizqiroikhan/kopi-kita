# Kopi Kita — SmartStart Week 2, Module 1 Tracking Plan

**Metric:** Booking completion = unique users who trigger `booking_submitted` after `booking_started`, measured over seven days. **Current result (9 October 2026): 100% (6 / 6 unique users). Target: >=30%. Target reached: yes.** [Open the booking completion insight](https://us.posthog.com/project/653083/insights/CZF20Q6g).

## Objective

Increase the 7-day booking completion rate to **at least 30%**. Completion rate is unique users who trigger `booking_submitted` divided by unique users who trigger `booking_started` in the same seven-day window.

## Privacy and scope

- Do not send names, WhatsApp numbers, dates, times, notes, booking IDs, URLs with query parameters, or any other personal data.
- PostHog autocapture and automatic pageviews are off; only the events below are sent.
- Session recording is enabled only for public journeys. Text and HTML attributes are masked; `/admin` stops recording and opts out of PostHog during client-side navigation.
- Events use anonymous PostHog IDs only. The app never calls `identify`.

## Events

| Event | When it fires | Question it answers | Safe properties |
| --- | --- | --- | --- |
| `menu_viewed` | The public menu API response has succeeded and its data has loaded. | Are visitors successfully reaching the menu content? | `menu_item_count` |
| `booking_started` | The first actual booking-form edit in a browser visit. | How many visitors begin entering a booking? | `form: "booking"` |
| `booking_submitted` | Only after `/api/bookings` returns a successful response. | How many started bookings become successful booking requests? | `form: "booking"` |
| `cta_clicked` | The landing hero booking CTA is clicked. | Which CTA variant moves visitors into the booking journey? | `cta_variant`, `cta_location: "hero"` |

## Funnel and experiment

1. `cta_clicked` where `cta_location = hero`
2. `booking_started` where `form = booking`
3. `booking_submitted`

Use unique users and a seven-day conversion window. The primary conversion insight is `booking_submitted / booking_started`, unique users, over seven days, with a target of >=30%.

- [Booking completion insight](https://us.posthog.com/project/653083/insights/CZF20Q6g)
- [Three-step booking funnel](https://us.posthog.com/project/653083/insights/sx0NfJec)
- [Kopi Kita: Booking dashboard](https://us.posthog.com/project/653083/dashboard/2186666)

`cta-landing` is a two-variant flag: `control` keeps the original **Book a Table** label; `test` uses **Reserve a Table**. If PostHog, the key, or flag delivery is unavailable, the UI remains control.

## Week 2 Findings

No recording findings are listed yet because PostHog had no recordings before session replay was enabled on 9 October 2026. After this change is deployed and real public sessions are recorded, add three evidence-based findings below, each with its PostHog recording link. Do not invent findings or recording URLs.

1. Pending a real recording.
2. Pending a real recording.
3. Pending a real recording.
