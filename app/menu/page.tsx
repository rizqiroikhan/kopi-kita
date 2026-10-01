"use client";

import { useMemo, useState } from "react";
import {
  menuCategories,
  menuProducts,
  type MenuCategory,
} from "@/lib/menu-data";

const formatRupiah = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>("All");

  const visibleProducts = useMemo(
    () =>
      selectedCategory === "All"
        ? menuProducts
        : menuProducts.filter((product) => product.category === selectedCategory),
    [selectedCategory],
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#FAF3E0] text-[#4A2C2A]">
      <section className="mx-auto max-w-7xl px-5 pb-8 pt-7 sm:px-8 sm:pb-12 sm:pt-12 lg:px-10">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#e8b17b]/30 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#9a4e2c]">
            <span className="size-1.5 rounded-full bg-[#c76238]" />
            Made for your little rituals
          </p>
          <h1 className="max-w-2xl text-5xl font-black leading-[0.92] tracking-[-0.075em] sm:text-6xl lg:text-7xl">
            Your mood, in a cup.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#6d4a3a] sm:text-lg">
            Good coffee, soft pastries, and zero boring choices. Pick your current obsession.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10 lg:pb-24" aria-labelledby="menu-heading">
        <div className="mb-7 flex flex-col gap-5 sm:mb-9 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="menu-heading" className="text-2xl font-black tracking-[-0.05em] sm:text-3xl">
              The good stuff
            </h2>
            <p className="mt-1 text-sm text-[#886252]">8 favourites, made with lots of feeling.</p>
          </div>
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0" role="group" aria-label="Filter menu by category">
            {menuCategories.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  aria-pressed={isSelected}
                  className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c76238] ${
                    isSelected
                      ? "bg-[#3a2118] text-[#fffaf2] shadow-[0_8px_18px_rgba(58,33,24,0.18)]"
                      : "border border-[#3a2118]/10 bg-white/65 text-[#6d4a3a] hover:border-[#c76238]/40 hover:bg-white active:scale-95"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {visibleProducts.map((product) => (
            <article
              key={product.name}
              className={`group relative min-w-0 overflow-hidden rounded-[1.5rem] border border-[#3a2118]/[0.07] bg-[#fffdf9] shadow-[0_8px_24px_rgba(82,48,28,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(82,48,28,0.13)] ${
                product.available ? "" : "opacity-80"
              }`}
            >
              <div className={`relative grid aspect-[1.12] place-items-center overflow-hidden ${product.image.tone}`}>
                <span className="absolute -right-5 -top-8 size-28 rounded-full border-[18px] border-white/20" />
                <span
                  role="img"
                  aria-label={product.image.alt}
                  className="relative text-5xl drop-shadow-[0_8px_6px_rgba(62,35,24,0.18)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 sm:text-6xl"
                >
                  {product.image.emoji}
                </span>
                {!product.available && (
                  <span className="absolute left-3 top-3 rounded-full bg-[#3a2118] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white shadow-sm">
                    Sold Out
                  </span>
                )}
              </div>
              <div className="p-3.5 sm:p-4">
                <span className="inline-flex rounded-full bg-[#f5e7d5] px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#9a4e2c]">
                  {product.category}
                </span>
                <h3 className="mt-3 text-base font-black leading-[1.05] tracking-[-0.045em] sm:text-lg">
                  {product.name}
                </h3>
                <p className="mt-2 hidden text-sm leading-5 text-[#765444] sm:block">{product.description}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <p className="text-sm font-extrabold text-[#3a2118] sm:text-base">{formatRupiah(product.price)}</p>
                  <span className={`grid size-7 place-items-center rounded-full text-sm transition-transform duration-200 ${product.available ? "bg-[#e8b17b]/45 text-[#7c3f27] group-hover:translate-x-0.5" : "bg-[#eee5dc] text-[#967d6e]"}`} aria-hidden="true">
                    {product.available ? "↗" : "—"}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
