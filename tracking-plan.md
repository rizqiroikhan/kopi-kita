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

1. A visitor opened the booking form and interacted with the name and contact fields, then left before submitting. The same session continued to the menu, where they browsed coffee and non-coffee items. This indicates that visitors can move from booking back to discovery without a completed request. [Watch recording](https://us.posthog.com/project/653083/replay/01a11f45-d8e6-71d7-835f-ad2c5c54fd23).
2. A visitor browsed the menu, started a booking, and saw WhatsApp validation requiring at least 10 digits. After correcting the number, they submitted successfully and reached the booking confirmation. This confirms both validation feedback and recovery work in the observed journey. [Watch recording](https://us.posthog.com/project/653083/replay/01a11f44-53ae-72b3-8842-e3002a666b5c).
3. A visitor reviewed menu items, navigated to booking, filled in the form and a note, then submitted successfully and reached the confirmation screen. This is an observed end-to-end path from menu discovery to completed booking. [Watch recording](https://us.posthog.com/project/653083/replay/01a11f42-da9e-7359-be07-4397ca7e9cd8).
