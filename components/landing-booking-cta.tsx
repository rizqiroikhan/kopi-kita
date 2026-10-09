"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { captureAnalyticsEvent, getCtaLandingVariant, initializePostHog, isPostHogInitialized, posthog } from "@/lib/posthog";

const className = "inline-flex min-h-14 w-full items-center justify-center rounded-full border-2 border-[#4A2C2A] bg-[#fffaf2] px-7 text-base font-extrabold text-[#4A2C2A] shadow-[0_8px_18px_rgba(74,44,42,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d86f3d] hover:text-[#a94d2d] active:translate-y-0 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d86f3d] md:w-auto";

export default function LandingBookingCta() {
  const [variant, setVariant] = useState<"control" | "test">("control");

  useEffect(() => {
    initializePostHog();
    if (!isPostHogInitialized()) return;
    setVariant(getCtaLandingVariant());
    return posthog.onFeatureFlags(() => setVariant(getCtaLandingVariant()));
  }, []);

  return <Link href="/booking" onClick={() => captureAnalyticsEvent("cta_clicked", { cta_variant: variant, cta_location: "hero" })} className={className}>{variant === "test" ? "Reserve a Table" : "Book a Table"}</Link>;
}
