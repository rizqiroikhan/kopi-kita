"use client";

import { FormEvent, useMemo, useState } from "react";

type BookingDetails = { fullName: string; whatsapp: string; date: string; time: string; partySize: string; notes: string };
type FieldName = keyof BookingDetails;
type FieldErrors = Partial<Record<Exclude<FieldName, "notes">, string>>;

const initialDetails: BookingDetails = { fullName: "", whatsapp: "", date: "", time: "", partySize: "2", notes: "" };
const timeOptions = Array.from({ length: 12 }, (_, index) => `${String(index + 10).padStart(2, "0")}:00`);
const inputClassName = "min-h-12 w-full rounded-xl border border-[#4A2C2A]/15 bg-white px-4 font-medium text-[#4A2C2A] outline-none transition placeholder:text-[#9b7a68] focus:border-[#d86f3d] focus:ring-2 focus:ring-[#d86f3d]/20";
const invalidClassName = "border-[#c85b42] focus:border-[#c85b42] focus:ring-[#c85b42]/20";

function todayAsInputValue() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

function validate(details: BookingDetails, today: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!details.fullName.trim()) errors.fullName = "Please enter your full name.";
  if (!details.whatsapp) errors.whatsapp = "Please enter your WhatsApp number.";
  else if (!/^\d+$/.test(details.whatsapp)) errors.whatsapp = "Use digits only for your WhatsApp number.";
  else if (details.whatsapp.length < 10) errors.whatsapp = "Your WhatsApp number needs at least 10 digits.";
  if (!details.date) errors.date = "Please choose a date.";
  else if (details.date < today) errors.date = "Please choose today or a future date.";
  if (!details.time) errors.time = "Please choose a time.";
  const partySize = Number(details.partySize);
  if (!details.partySize) errors.partySize = "Please enter your party size.";
  else if (!Number.isInteger(partySize) || partySize < 1 || partySize > 8) errors.partySize = "Party size must be between 1 and 8.";
  return errors;
}

function ErrorMessage({ id, message }: { id: string; message?: string }) {
  return message ? <p id={id} role="alert" className="text-xs font-medium text-[#b84a35]">{message}</p> : null;
}

export default function BookingForm() {
  const [details, setDetails] = useState<BookingDetails>(initialDetails);
  const [submittedDetails, setSubmittedDetails] = useState<BookingDetails | null>(null);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const today = useMemo(() => todayAsInputValue(), []);
  const errors = validate(details, today);
  const isValid = Object.keys(errors).length === 0;

  function updateDetail(field: FieldName, value: string) { setDetails((current) => ({ ...current, [field]: value })); }
  function markTouched(field: FieldName) { setTouched((current) => ({ ...current, [field]: true })); }
  function fieldProps(field: Exclude<FieldName, "notes">) {
    const error = touched[field] ? errors[field] : undefined;
    return { error, className: `${inputClassName} ${error ? invalidClassName : ""}`, "aria-invalid": Boolean(error), "aria-describedby": error ? `${field}-error` : undefined };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched({ fullName: true, whatsapp: true, date: true, time: true, partySize: true });
    if (!isValid) return;
    setSubmittedDetails(details);
  }

  function makeAnotherBooking() { setDetails(initialDetails); setTouched({}); setSubmittedDetails(null); }

  if (submittedDetails) {
    return <section aria-live="polite" className="rounded-[1.75rem] border border-[#4A2C2A]/10 bg-[#fffaf2] p-6 shadow-[0_10px_28px_rgba(82,48,28,0.08)] sm:p-9"><span className="grid size-12 place-items-center rounded-2xl bg-[#f7dfc5] text-xl font-black text-[#a94d2d]">✓</span><p className="mt-5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#d86f3d]">Booking request received</p><h2 className="mt-2 text-3xl font-black tracking-[-0.055em]">We got your booking!</h2><p className="mt-3 leading-7 text-[#765444]">We&apos;ll keep an eye out for you at Kopi Kita.</p><dl className="mt-7 divide-y divide-[#4A2C2A]/10 rounded-2xl border border-[#4A2C2A]/10 bg-white/60 px-4"><div className="flex justify-between gap-5 py-3 text-sm"><dt className="text-[#765444]">Name</dt><dd className="text-right font-extrabold">{submittedDetails.fullName}</dd></div><div className="flex justify-between gap-5 py-3 text-sm"><dt className="text-[#765444]">WhatsApp</dt><dd className="text-right font-extrabold">{submittedDetails.whatsapp}</dd></div><div className="flex justify-between gap-5 py-3 text-sm"><dt className="text-[#765444]">Date</dt><dd className="text-right font-extrabold">{submittedDetails.date}</dd></div><div className="flex justify-between gap-5 py-3 text-sm"><dt className="text-[#765444]">Time</dt><dd className="text-right font-extrabold">{submittedDetails.time}</dd></div><div className="flex justify-between gap-5 py-3 text-sm"><dt className="text-[#765444]">Party size</dt><dd className="text-right font-extrabold">{submittedDetails.partySize} people</dd></div><div className="py-3 text-sm"><dt className="text-[#765444]">Notes</dt><dd className="mt-1 font-extrabold">{submittedDetails.notes || "No notes added."}</dd></div></dl><button type="button" onClick={makeAnotherBooking} className="mt-7 min-h-12 w-full rounded-full bg-[#4A2C2A] px-6 text-sm font-extrabold text-[#fffaf2] shadow-[0_10px_20px_rgba(74,44,42,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#653a36] active:translate-y-0 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d86f3d]">Make Another Booking</button></section>;
  }

  const fullName = fieldProps("fullName"); const whatsapp = fieldProps("whatsapp"); const date = fieldProps("date"); const time = fieldProps("time"); const partySize = fieldProps("partySize");
  return <form noValidate onSubmit={handleSubmit} className="rounded-[1.75rem] border border-[#4A2C2A]/10 bg-[#fffaf2] p-6 shadow-[0_10px_28px_rgba(82,48,28,0.08)] sm:p-9"><h2 className="text-2xl font-black tracking-[-0.045em]">Booking details</h2><p className="mt-2 text-sm leading-6 text-[#765444]">A few details and your coffee date is in motion.</p><div className="mt-7 grid gap-5 sm:grid-cols-2">
    <label className="grid gap-2 text-sm font-bold sm:col-span-2">Full name<input required name="fullName" autoComplete="name" value={details.fullName} onChange={(event) => updateDetail("fullName", event.target.value)} onBlur={() => markTouched("fullName")} className={fullName.className} aria-invalid={fullName["aria-invalid"]} aria-describedby={fullName["aria-describedby"]} placeholder="Your name" /><ErrorMessage id="fullName-error" message={fullName.error} /></label>
    <label className="grid gap-2 text-sm font-bold sm:col-span-2">WhatsApp number<input required name="whatsapp" autoComplete="tel" inputMode="numeric" value={details.whatsapp} onChange={(event) => updateDetail("whatsapp", event.target.value)} onBlur={() => markTouched("whatsapp")} className={whatsapp.className} aria-invalid={whatsapp["aria-invalid"]} aria-describedby={whatsapp["aria-describedby"]} placeholder="08xx xxxx xxxx" /><ErrorMessage id="whatsapp-error" message={whatsapp.error} /></label>
    <label className="grid gap-2 text-sm font-bold">Date<input required name="date" type="date" min={today} value={details.date} onChange={(event) => updateDetail("date", event.target.value)} onBlur={() => markTouched("date")} className={date.className} aria-invalid={date["aria-invalid"]} aria-describedby={date["aria-describedby"]} /><ErrorMessage id="date-error" message={date.error} /></label>
    <label className="grid gap-2 text-sm font-bold">Time<select required name="time" value={details.time} onChange={(event) => updateDetail("time", event.target.value)} onBlur={() => markTouched("time")} className={time.className} aria-invalid={time["aria-invalid"]} aria-describedby={time["aria-describedby"]}><option value="" disabled>Select time</option>{timeOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select><ErrorMessage id="time-error" message={time.error} /></label>
    <label className="grid gap-2 text-sm font-bold sm:col-span-2">Party size<input required name="partySize" type="number" min="1" max="8" value={details.partySize} onChange={(event) => updateDetail("partySize", event.target.value)} onBlur={() => markTouched("partySize")} className={partySize.className} aria-invalid={partySize["aria-invalid"]} aria-describedby={partySize["aria-describedby"]} /><ErrorMessage id="partySize-error" message={partySize.error} /></label>
    <label className="grid gap-2 text-sm font-bold sm:col-span-2">Notes <span className="font-medium text-[#765444]">(optional)</span><textarea name="notes" rows={3} value={details.notes} onChange={(event) => updateDetail("notes", event.target.value)} className={`${inputClassName} min-h-0 resize-none py-3`} placeholder="Any occasion or seating preference?" /></label>
  </div><button type="submit" disabled={!isValid} className="mt-7 min-h-12 w-full rounded-full bg-[#4A2C2A] px-6 text-sm font-extrabold text-[#fffaf2] shadow-[0_10px_20px_rgba(74,44,42,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#653a36] active:translate-y-0 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d86f3d] disabled:cursor-not-allowed disabled:bg-[#9b7a68] disabled:shadow-none disabled:hover:translate-y-0">Book Now</button></form>;
}
