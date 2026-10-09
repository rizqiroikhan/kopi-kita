"use client";

import { useEffect } from "react";
import { captureAnalyticsEvent, captureOncePerVisit } from "@/lib/posthog";

export default function BookingFunnelTracker({ pathname }: { pathname: string }) {
  useEffect(() => {
    if (pathname === "/admin" || pathname.startsWith("/admin/")) return;

    const onFormEdit = (event: Event) => {
      if (pathname !== "/booking" || !(event.target instanceof Element) || !event.target.closest("form")) return;
      captureOncePerVisit("booking_started", { form: "booking" });
    };
    document.addEventListener("input", onFormEdit, true);
    document.addEventListener("change", onFormEdit, true);

    const originalFetch = window.fetch;
    window.fetch = async (...args: Parameters<typeof window.fetch>) => {
      const response = await originalFetch(...args);
      const input = args[0];
      const url = new URL(input instanceof Request ? input.url : input.toString(), window.location.origin);
      const method = (args[1]?.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase();

      if (pathname === "/booking" && method === "POST" && url.pathname === "/api/bookings" && response.ok) {
        captureAnalyticsEvent("booking_submitted", { form: "booking" });
      }
      if (pathname === "/menu" && method === "GET" && url.pathname === "/api/products" && response.ok) {
        void response.clone().json().then((products: unknown) => {
          if (Array.isArray(products)) captureAnalyticsEvent("menu_viewed", { menu_item_count: products.length });
        }).catch(() => undefined);
      }
      return response;
    };

    return () => {
      document.removeEventListener("input", onFormEdit, true);
      document.removeEventListener("change", onFormEdit, true);
      window.fetch = originalFetch;
    };
  }, [pathname]);

  return null;
}
