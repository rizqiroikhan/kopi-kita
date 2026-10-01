import type { Metadata } from "next";

export const metadata: Metadata = { title: "Bookings · Kopi Kita" };
type Booking = { id: number; customer_name: string; whatsapp: string; booking_date: string; booking_time: string; party_size: number; notes: string | null; status: string };

async function getBookings(): Promise<Booking[]> {
  try {
    const response = await fetch("http://localhost:4000/api/bookings", { headers: { Authorization: `Bearer ${process.env.ADMIN_TOKEN ?? ""}` }, cache: "no-store" });
    return response.ok ? response.json() : [];
  } catch { return []; }
}

export default async function AdminBookingsPage() {
  const bookings = await getBookings();
  return <main className="min-h-screen bg-[#f7efe0] px-5 py-12 text-[#4A2C2A] sm:px-10"><div className="mx-auto max-w-6xl"><p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#bd6b36]">Kopi Kita CMS</p><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-4xl font-black tracking-tight">Bookings</h1><p className="mt-2 text-[#765655]">Keep every table moment feeling effortless.</p></div><span className="rounded-full bg-[#4A2C2A] px-4 py-2 text-sm font-bold text-[#FAF3E0]">{bookings.length} bookings</span></div><div className="overflow-hidden rounded-3xl border border-[#eadbc5] bg-white/70 shadow-[0_12px_40px_rgba(74,44,42,0.08)]"><div className="overflow-x-auto"><table className="w-full min-w-[860px] text-left"><thead className="bg-[#4A2C2A] text-sm uppercase tracking-wider text-[#FAF3E0]"><tr><th className="px-6 py-4">Guest</th><th className="px-6 py-4">Date & time</th><th className="px-6 py-4">Party</th><th className="px-6 py-4">Notes</th><th className="px-6 py-4">Status</th></tr></thead><tbody className="divide-y divide-[#eadbc5]">{bookings.map((booking) => <tr key={booking.id}><td className="px-6 py-5"><div className="font-bold">{booking.customer_name}</div><div className="text-sm text-[#765655]">{booking.whatsapp}</div></td><td className="px-6 py-5 font-medium">{booking.booking_date}<div className="text-sm text-[#765655]">{booking.booking_time}</div></td><td className="px-6 py-5">{booking.party_size} people</td><td className="max-w-xs px-6 py-5 text-sm text-[#765655]">{booking.notes || "—"}</td><td className="px-6 py-5"><span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${booking.status === "confirmed" ? "bg-emerald-100 text-emerald-800" : booking.status === "done" ? "bg-blue-100 text-blue-800" : booking.status === "cancelled" ? "bg-red-100 text-red-800" : "bg-[#f5dfc4] text-[#8d542d]"}`}>{booking.status}</span></td></tr>)}</tbody></table></div>{bookings.length === 0 && <p className="p-8 text-center text-[#765655]">No bookings found. Add bookings through the public booking form.</p>}</div></div></main>;
}
