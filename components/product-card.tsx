"use client";

import { useState } from "react";
import Image from "next/image";
import type { MenuItem } from "@/lib/menu-data";

const categoryLabel: Record<MenuItem["category"], string> = {
  kopi: "Coffee",
  "non-kopi": "Non-Coffee",
  pastry: "Pastry",
};

const imageTone: Record<MenuItem["category"], string> = {
  kopi: "bg-[#c9966b]",
  "non-kopi": "bg-[#b8c69a]",
  pastry: "bg-[#e9c887]",
};

function formatRupiah(price: number) {
  return `Rp ${price.toLocaleString("id-ID")}`;
}

export default function ProductCard({ item }: { item: MenuItem }) {
  const [imageUnavailable, setImageUnavailable] = useState(false);

  return (
    <article className="group min-w-0 overflow-hidden rounded-[1.5rem] border border-[#4A2C2A]/8 bg-[#fffaf2] shadow-[0_8px_24px_rgba(82,48,28,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(82,48,28,0.13)]">
      <div className={`relative aspect-[1.1] overflow-hidden ${imageTone[item.category]} ${item.available ? "" : "opacity-55"}`}>
        {!imageUnavailable ? (
          <Image src={item.image} alt={item.name} fill sizes="(min-width: 1024px) 25vw, 50vw" onError={() => setImageUnavailable(true)} className="object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div role="img" aria-label={`${item.name} placeholder`} className="grid size-full place-items-center">
            <span className="absolute -right-5 -top-8 size-28 rounded-full border-[18px] border-white/25" />
            <span className="relative grid size-20 place-items-center rounded-b-[2rem] rounded-t-xl border-[5px] border-[#fff6e8]/80 bg-[#8e593d] shadow-[0_12px_14px_rgba(93,51,26,0.18)]"><span className="size-8 rounded-full border-[4px] border-[#fff4dc]/90 bg-[#d6a370]" /></span>
          </div>
        )}
        {!item.available && <span className="absolute left-3 top-3 rounded-full bg-[#4A2C2A] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white shadow-sm">Sold Out</span>}
      </div>
      <div className="p-3.5 sm:p-4">
        <span className="inline-flex rounded-full bg-[#f5e7d5] px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#9a4e2c]">{categoryLabel[item.category]}</span>
        <h2 className="mt-3 text-base font-black leading-[1.05] tracking-[-0.045em] sm:text-lg">{item.name}</h2>
        <p className="mt-2 text-sm leading-5 text-[#765444]">{item.description}</p>
        <p className="mt-3 text-sm font-extrabold text-[#4A2C2A] sm:text-base">{formatRupiah(item.price)}</p>
      </div>
    </article>
  );
}
