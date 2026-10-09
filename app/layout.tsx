import type { Metadata } from "next";
import SiteHeader from "./site-header";
import PostHogProvider from "@/components/posthog-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kopi Kita — Coffee for your good days",
  description: "A warm, modern neighbourhood coffee shop.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full bg-[#FAF3E0] font-sans text-[#4A2C2A]">
        <PostHogProvider>
          <SiteHeader />
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
