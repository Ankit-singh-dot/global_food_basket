"use client";

import React from "react";
import Image from "next/image";
import { PRODUCTS, type Product } from "./data/products";
import { money, type Currency } from "./format";
import { ArrowRightIcon } from "./icons";

interface HeroBannerProps {
  currency: Currency;
  onScrollToCatalog: () => void;
  onOpenFlyersModal: () => void;
  onSelectProduct: (product: Product) => void;
}

/**
 * Packs that stand on the hero shelf, left → right.
 * Cut-outs live in /public/hero (white background removed, captions cropped).
 */
const SHELF: { id: string; src: string; w: number; h: number; height: number; tag?: string }[] = [
  { id: "gfb-020", src: "/hero/black-sesame-oatmeal-180g.png", w: 243, h: 312, height: 176 },
  { id: "gfb-015", src: "/hero/blueberry-filling-box-120g.png", w: 203, h: 348, height: 204 },
  { id: "gfb-004", src: "/hero/danish-butter-red-tin.png", w: 283, h: 231, height: 118, tag: "Festive" },
  { id: "gfb-001", src: "/hero/choc-cream-150g.png", w: 297, h: 372, height: 186 },
  { id: "gfb-002", src: "/hero/danish-butter-150g.png", w: 301, h: 372, height: 186 },
  { id: "gfb-014", src: "/hero/strawberry-filling-box-120g.png", w: 206, h: 340, height: 204 },
  { id: "gfb-005", src: "/hero/danish-butter-blue-tin.png", w: 269, h: 231, height: 118 },
  { id: "gfb-016", src: "/hero/pineapple-filling-box-120g.png", w: 203, h: 349, height: 204 },
];

const byId = new Map(PRODUCTS.map((p) => [p.id, p]));

/* ── EAN-13: renders a real, scannable barcode from the product's barcode digits ── */
const L = ["0001101", "0011001", "0010011", "0111101", "0100011", "0110001", "0101111", "0111011", "0110111", "0001011"];
const R = L.map((c) => c.replace(/./g, (b) => (b === "0" ? "1" : "0")));
const G = R.map((c) => c.split("").reverse().join(""));
const PARITY = ["LLLLLL", "LLGLGG", "LLGGLG", "LLGGGL", "LGLLGG", "LGGLLG", "LGGGLL", "LGLGLG", "LGLGGL", "LGGLGL"];

function ean13Modules(code: string): string | null {
  if (!/^\d{13}$/.test(code)) return null;
  const d = code.split("").map(Number);
  const parity = PARITY[d[0]];
  let bits = "101";
  for (let i = 1; i <= 6; i++) bits += parity[i - 1] === "L" ? L[d[i]] : G[d[i]];
  bits += "01010";
  for (let i = 7; i <= 12; i++) bits += R[d[i]];
  return bits + "101";
}

const Barcode: React.FC<{ code: string }> = ({ code }) => {
  const bits = ean13Modules(code);
  if (!bits) return null;
  return (
    <svg viewBox={`0 0 ${bits.length} 20`} preserveAspectRatio="none" className="h-5 w-full" aria-hidden>
      {bits.split("").map((b, i) => (b === "1" ? <rect key={i} x={i} width="1" height="20" fill="currentColor" /> : null))}
    </svg>
  );
};

const casePrice = (p: Product, currency: Currency) =>
  currency === "INR" ? p.wholesaleInr * p.unitsPerCase : Math.round(p.wholesaleGbp * p.unitsPerCase * 100) / 100;

export const HeroBanner: React.FC<HeroBannerProps> = ({
  currency,
  onScrollToCatalog,
  onOpenFlyersModal,
  onSelectProduct,
}) => {
  const items = SHELF.flatMap((s) => {
    const product = byId.get(s.id);
    return product ? [{ ...s, product }] : [];
  });

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* catalogue meta row */}
        <div className="flex items-center justify-between gap-4 border-b border-ink/10 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">
          <span>Trade catalogue · 2026/27</span>
          <span className="hidden sm:inline">{PRODUCTS.length} lines · Luton, UK</span>
        </div>

        {/* headline + intro */}
        <div className="pt-10 sm:pt-12 space-y-8">
          <h1 className="font-semibold text-ink tracking-[-0.045em] leading-[0.95] text-[2.75rem] sm:text-7xl lg:text-[5.5rem] xl:text-[6.25rem] shelf-in">
            Biscuits by the case,
            <br />
            from around the{" "}
            <span className="font-script font-bold tracking-normal text-leaf-600 text-[1.12em] leading-none">
              globe
            </span>
            .
          </h1>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 shelf-in [animation-delay:80ms]">
            <p className="text-[1.05rem] text-stone-600 leading-relaxed max-w-lg">
              Butter cookies, festive tins, cream biscuits and oat crackers for grocers,
              cash &amp; carries and distributors. Order one case or fill a container.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <button
                type="button"
                onClick={onScrollToCatalog}
                className="group inline-flex items-center gap-3 rounded-full bg-ink pl-6 pr-2 py-2 text-sm font-semibold text-white transition hover:bg-leaf-700"
              >
                Shop the range
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink transition group-hover:translate-x-0.5">
                  <ArrowRightIcon className="w-4 h-4" />
                </span>
              </button>
              <button
                type="button"
                onClick={onOpenFlyersModal}
                className="text-sm font-semibold text-ink underline decoration-ink/25 decoration-2 underline-offset-[6px] transition hover:decoration-leaf-500"
              >
                Download price lists
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ───────────── The shelf ───────────── */}
      <div className="relative mt-10 sm:mt-14 overflow-x-auto no-scrollbar snap-x snap-mandatory">
        {/* shelf top + front rail, full-bleed, behind the tickets */}
        <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 min-w-full w-[1112px] h-[158px]">
          <div className="h-4 shelf-top" />
          <div className="h-[142px] bg-ink shelf-rail" />
        </div>
        <div className="relative min-w-[1080px] max-w-7xl mx-auto px-4 sm:px-6">

          <ul className="relative grid grid-cols-8">
            {items.map(({ product, src, w, h, height, tag }, i) => (
              <li key={product.id} className="snap-start">
                <button
                  type="button"
                  onClick={() => onSelectProduct(product)}
                  className="group flex w-full flex-col items-center px-2 text-left focus-visible:outline-none"
                  aria-label={`${product.name}, ${money(casePrice(product, currency), currency)} per case`}
                >
                  {/* pack */}
                  <div className="relative flex h-[220px] w-full items-end justify-center">
                    <span className="absolute bottom-0 h-3 w-3/4 rounded-[50%] bg-ink/25 blur-md" aria-hidden />
                    <span className="relative flex max-w-full shelf-drop" style={{ animationDelay: `${120 + i * 60}ms` }}>
                      <Image
                        src={src}
                        alt=""
                        width={w}
                        height={h}
                        sizes="180px"
                        priority
                        style={{ height }}
                        className="w-auto max-w-full object-contain transition duration-300 ease-out group-hover:-translate-y-2 pack-shadow"
                      />
                    </span>
                  </div>

                  {/* shelf-edge ticket */}
                  <div className="mt-4 mb-[14px] w-full max-w-[148px] h-[126px] flex flex-col rounded-[3px] bg-white px-2.5 pt-2 pb-1.5 text-ink ticket-shadow transition group-hover:-translate-y-0.5 group-focus-visible:ring-2 group-focus-visible:ring-leaf-400">
                    <div className="flex items-center justify-between gap-1 text-[9px] font-semibold uppercase tracking-wider text-stone-400 whitespace-nowrap">
                      <span className="truncate">{product.sku}</span>
                      {tag && <span className="shrink-0 rounded-sm bg-amber-300 px-1 text-ink">{tag}</span>}
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-[11px] font-medium leading-tight">{product.name}</p>
                    <p className="mt-auto flex items-baseline gap-1">
                      <span className="tabular text-xl font-bold tracking-tight">
                        {money(casePrice(product, currency), currency)}
                      </span>
                      <span className="text-[10px] text-stone-500">/ case</span>
                    </p>
                    <p className="text-[10px] text-stone-500 -mt-0.5">{product.packing}</p>
                    <div className="mt-1 text-ink">
                      <Barcode code={product.barcode} />
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-stone-500">
        <span>Case prices ex-VAT · tap any ticket for specs, MOQ &amp; stock</span>
        <button
          type="button"
          onClick={onScrollToCatalog}
          className="inline-flex items-center gap-1.5 font-semibold text-ink hover:text-leaf-700"
        >
          See all {PRODUCTS.length} lines <ArrowRightIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
