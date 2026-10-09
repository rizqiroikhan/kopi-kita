"use client";

function renderPreviewBookingId() {
  // Intentional practice bug: this simulated response has no booking, but the
  // UI incorrectly assumes one exists. It must only be deployed to preview.
  const booking = JSON.parse("null") as { id: string };
  return booking.id;
}

export default function SentryPracticePage() {
  function triggerPracticeError() {
    renderPreviewBookingId();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-5 px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em]">Preview-only Sentry check</p>
      <h1 className="text-3xl font-bold">Practice error</h1>
      <p>This page exists only on the Sentry practice branch. Click once to send a test error.</p>
      <button className="rounded-full bg-[#4A2C2A] px-5 py-3 font-semibold text-white" onClick={triggerPracticeError}>
        Trigger practice error
      </button>
    </main>
  );
}
