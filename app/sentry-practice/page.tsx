"use client";

import { useState } from "react";

function renderPreviewBookingId() {
  // A preview response may legitimately have no booking. Render the empty
  // state instead of dereferencing a missing object.
  const booking = JSON.parse("null") as { id: string } | null;
  return booking?.id ?? "No booking selected";
}

export default function SentryPracticePage() {
  const [result, setResult] = useState<string | null>(null);

  function checkEmptyBookingState() {
    setResult(renderPreviewBookingId());
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-5 px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em]">Preview-only Sentry check</p>
      <h1 className="text-3xl font-bold">Practice error</h1>
      <p>This preview page safely handles a booking response with no selected booking.</p>
      <button className="rounded-full bg-[#4A2C2A] px-5 py-3 font-semibold text-white" onClick={checkEmptyBookingState}>
        Check empty booking state
      </button>
      {result ? <p role="status">{result}</p> : null}
    </main>
  );
}
