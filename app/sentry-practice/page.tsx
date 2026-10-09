"use client";

function renderPreviewBookingId() {
  // Intentional preview-only source-map test. This branch is never merged.
  const booking = JSON.parse("null") as { id: string };
  return booking.id;
}

export default function SentryPracticePage() {
  function triggerSourceMapProofError() {
    renderPreviewBookingId();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-5 px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em]">Preview-only Sentry check</p>
      <h1 className="text-3xl font-bold">Practice error</h1>
      <p>This page exists only to verify that Sentry maps a Preview error to the original source file.</p>
      <button className="rounded-full bg-[#4A2C2A] px-5 py-3 font-semibold text-white" onClick={triggerSourceMapProofError}>
        Trigger source-map proof error
      </button>
    </main>
  );
}
