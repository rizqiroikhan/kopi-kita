"use client";

import posthog from "posthog-js";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
let initialized = false;

function isAdminPath() {
  return typeof window !== "undefined" && (window.location.pathname === "/admin" || window.location.pathname.startsWith("/admin/"));
}

export function initializePostHog() {
  if (initialized || !POSTHOG_KEY || isAdminPath()) return false;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: false,
    // Record only public journeys. Text and HTML attributes remain masked;
    // the provider stops capture entirely on /admin routes.
    disable_session_recording: false,
    mask_all_text: true,
    mask_all_element_attributes: true,
    person_profiles: "identified_only",
  });
  initialized = true;
  return true;
}

export function isPostHogInitialized() {
  return initialized;
}

export function pausePostHogForAdmin() {
  if (!initialized) return;
  posthog.stopSessionRecording();
  posthog.opt_out_capturing();
}

export function resumePostHog() {
  if (initializePostHog()) return;
  if (initialized && !isAdminPath()) posthog.opt_in_capturing();
}

export function capturePublicPageview() {
  if (!initialized || isAdminPath()) return;
  posthog.capture("$pageview");
}

export function captureAnalyticsEvent(event: "menu_viewed" | "booking_started" | "booking_submitted" | "cta_clicked", properties: Record<string, string | number | boolean>) {
  if (!initialized || isAdminPath()) return;
  posthog.capture(event, properties);
}

export function captureOncePerVisit(event: "booking_started", properties: Record<string, string | number | boolean>) {
  if (typeof window === "undefined" || window.sessionStorage.getItem(`kopi-kita:${event}`)) return;
  window.sessionStorage.setItem(`kopi-kita:${event}`, "1");
  captureAnalyticsEvent(event, properties);
}

export function getCtaLandingVariant(): "control" | "test" {
  return initialized && posthog.getFeatureFlag("cta-landing") === "test" ? "test" : "control";
}

export { posthog };
