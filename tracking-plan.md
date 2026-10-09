# Kopi Kita — SmartStart Week 2, Module 1 Tracking Plan

## Objective

Increase the 7-day booking completion rate to **at least 30%**. Completion rate is unique users who trigger `booking_submitted` divided by unique users who trigger `booking_started` in the same seven-day window.

## Privacy and scope

- Do not send names, WhatsApp numbers, dates, times, notes, booking IDs, URLs with query parameters, or any other personal data.
- PostHog autocapture and automatic pageviews are off; only the events below are sent.
- Session recording is disabled application-wide. `/admin` also opts out of PostHog during client-side navigation.
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

`cta-landing` is a two-variant flag: `control` keeps the original **Book a Table** label; `test` uses **Reserve a Table**. If PostHog, the key, or flag delivery is unavailable, the UI remains control.
