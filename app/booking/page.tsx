import BookingForm from "@/components/booking-form";

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-[#FAF3E0] px-5 py-12 sm:px-8 sm:py-16">
      <section className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div className="rounded-[1.75rem] bg-[#4A2C2A] p-8 text-[#fffaf2] shadow-[0_18px_35px_rgba(74,44,42,0.18)] sm:p-10">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#f1b37f]">Save your seat</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.065em] sm:text-5xl">Let&apos;s make it a coffee date.</h1>
          <p className="mt-5 max-w-sm leading-7 text-[#f4dfca]">Tell us when you&apos;re coming and we&apos;ll keep a cozy corner ready for you.</p>
          <dl className="mt-10 space-y-5 text-sm leading-6"><div><dt className="font-extrabold text-[#f1b37f]">Hours</dt><dd>Every day · 08.00 — 22.00 WIB</dd></div><div><dt className="font-extrabold text-[#f1b37f]">Address</dt><dd>Jl. Kemang Raya No. 18<br />Jakarta Selatan, 12730</dd></div></dl>
        </div>
        <BookingForm />
      </section>
    </main>
  );
}
