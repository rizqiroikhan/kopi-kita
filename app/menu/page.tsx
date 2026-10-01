"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/product-card";
import { menuItems, type MenuItem } from "@/lib/menu-data";

const filters = [
  { label: "All", value: "all" },
  { label: "Coffee", value: "kopi" },
  { label: "Non-Coffee", value: "non-kopi" },
  { label: "Pastry", value: "pastry" },
] as const;

type Filter = (typeof filters)[number]["value"];

export default function MenuPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");

  const filteredItems = useMemo(
    () => activeFilter === "all" ? menuItems : menuItems.filter((item) => item.category === activeFilter),
    [activeFilter],
  );

  return (
    <main className="min-h-screen bg-[#FAF3E0] text-[#4A2C2A]">
      <section className="mx-auto max-w-7xl px-5 pb-9 pt-10 sm:px-8 sm:pb-12 sm:pt-14 lg:px-10">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#d86f3d]/25 bg-[#f7dfc5] px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-[#a94d2d]"><span className="size-1.5 rounded-full bg-[#d86f3d]" />Made for slow moments</p>
        <h1 className="mt-5 max-w-2xl text-5xl font-black leading-[0.92] tracking-[-0.075em] sm:text-6xl lg:text-7xl">The menu your<br /><span className="text-[#d86f3d]">mood ordered.</span></h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-[#765444] sm:text-lg">Thoughtful coffee, non-coffee comforts, and pastries made to make your everyday ritual feel a little better.</p>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10 lg:pb-24" aria-labelledby="menu-list-heading">
        <div className="mb-7 flex flex-col gap-5 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
          <div><h2 id="menu-list-heading" className="text-2xl font-black tracking-[-0.05em] sm:text-3xl">Pick your current favourite.</h2><p className="mt-1 text-sm text-[#886252]">Freshly picked for every kind of day.</p></div>
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0" role="group" aria-label="Filter menu by category">
            {filters.map((filter) => {
              const isActive = activeFilter === filter.value;
              return <button key={filter.value} type="button" onClick={() => setActiveFilter(filter.value)} aria-pressed={isActive} className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d86f3d] ${isActive ? "bg-[#4A2C2A] text-[#fffaf2] shadow-[0_8px_18px_rgba(74,44,42,0.18)]" : "border border-[#4A2C2A]/10 bg-white/65 text-[#765444] hover:border-[#d86f3d]/40 hover:bg-white active:scale-95"}`}>{filter.label}</button>;
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {filteredItems.map((item: MenuItem) => <ProductCard key={item.id} item={item} />)}
        </div>
      </section>
    </main>
  );
}
