"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { capturePublicPageview, pausePostHogForAdmin, resumePostHog } from "@/lib/posthog";
import BookingFunnelTracker from "@/components/booking-funnel-tracker";

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin" || pathname.startsWith("/admin/")) {
      pausePostHogForAdmin();
      return;
    }
    resumePostHog();
    capturePublicPageview();
  }, [pathname]);

  return <><BookingFunnelTracker pathname={pathname} />{children}</>;
}
