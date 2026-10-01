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
        <form className="rounded-[1.75rem] border border-[#4A2C2A]/10 bg-[#fffaf2] p-6 shadow-[0_10px_28px_rgba(82,48,28,0.08)] sm:p-9">
          <h2 className="text-2xl font-black tracking-[-0.045em]">Booking details</h2>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold sm:col-span-2">Name<input required name="name" autoComplete="name" className="min-h-12 rounded-xl border border-[#4A2C2A]/15 bg-white px-4 font-medium outline-none transition focus:border-[#d86f3d] focus:ring-2 focus:ring-[#d86f3d]/20" placeholder="Your name" /></label>
            <label className="grid gap-2 text-sm font-bold">Date<input required name="date" type="date" className="min-h-12 rounded-xl border border-[#4A2C2A]/15 bg-white px-4 font-medium outline-none transition focus:border-[#d86f3d] focus:ring-2 focus:ring-[#d86f3d]/20" /></label>
            <label className="grid gap-2 text-sm font-bold">Guests<select name="guests" defaultValue="2" className="min-h-12 rounded-xl border border-[#4A2C2A]/15 bg-white px-4 font-medium outline-none transition focus:border-[#d86f3d] focus:ring-2 focus:ring-[#d86f3d]/20"><option>1</option><option>2</option><option>3</option><option>4</option><option>5+</option></select></label>
            <label className="grid gap-2 text-sm font-bold sm:col-span-2">Notes <span className="font-medium text-[#765444]">(optional)</span><textarea name="notes" rows={3} className="resize-none rounded-xl border border-[#4A2C2A]/15 bg-white px-4 py-3 font-medium outline-none transition focus:border-[#d86f3d] focus:ring-2 focus:ring-[#d86f3d]/20" placeholder="Any occasion or seating preference?" /></label>
          </div>
          <button type="submit" className="mt-7 min-h-12 w-full rounded-full bg-[#4A2C2A] px-6 text-sm font-extrabold text-[#fffaf2] shadow-[0_10px_20px_rgba(74,44,42,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#653a36] active:translate-y-0 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d86f3d]">Request a table</button>
        </form>
      </section>
    </main>
  );
}
