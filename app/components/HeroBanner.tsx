"use client";

import React from "react";
import Image from "next/image";
import { PRODUCTS } from "./data/products";
import { ArrowRightIcon, LeafIcon, TruckIcon } from "./icons";

interface HeroBannerProps {
  onScrollToCatalog: () => void;
  onOpenOrderDrawer: () => void;
  onOpenFlyersModal: () => void;
}

const casesInStock = PRODUCTS.reduce((sum, p) => sum + p.inStockCases, 0);

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onScrollToCatalog,
  onOpenOrderDrawer,
  onOpenFlyersModal,
}) => {
  const stats = [
    { value: casesInStock.toLocaleString("en-IN"), label: "cases ready to ship" },
    { value: String(PRODUCTS.length), label: "product lines" },
    { value: "32–44%", label: "typical retail margin" },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* soft background shapes */}
      <div className="pointer-events-none absolute -top-40 -right-32 w-[520px] h-[520px] rounded-full bg-leaf-100/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -left-40 w-[420px] h-[420px] rounded-full bg-sand blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-8">
            <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-stone-500">
              <span className="h-px w-8 bg-stone-300" />
              Good food has no borders
            </p>

            <div className="space-y-5">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-ink leading-[1.05]">
                Biscuits &amp; treats from around the{" "}
                <span className="font-script font-bold text-leaf-600 text-5xl sm:text-6xl lg:text-7xl">
                  globe
                </span>
                , by the case.
              </h1>
              <p className="text-lg text-stone-600 max-w-xl leading-relaxed">
                We supply grocers, cash &amp; carries and distributors with butter cookies,
                festive tins, cream biscuits and oat crackers, from a single case to a full
                container.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onScrollToCatalog}
                className="group inline-flex items-center gap-2 px-6 py-3.5 bg-ink hover:bg-leaf-700 text-white text-sm font-semibold rounded-full transition shadow-soft"
              >
                Shop the range
                <ArrowRightIcon className="w-4 h-4 transition group-hover:translate-x-0.5" />
              </button>
              <button
                type="button"
                onClick={onOpenOrderDrawer}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-sand text-ink text-sm font-semibold rounded-full border border-line transition"
              >
                View your order
              </button>
              <button
                type="button"
                onClick={onOpenFlyersModal}
                className="px-2 py-3 text-sm font-medium text-leaf-700 hover:text-leaf-900 underline-offset-4 hover:underline transition"
              >
                Download price lists
              </button>
            </div>

            <dl className="grid grid-cols-3 gap-3 max-w-lg">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-white/80 border border-line px-4 py-3">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="tabular text-2xl font-semibold text-ink">{s.value}</dd>
                  <dd className="text-xs text-stone-500 mt-0.5 leading-snug">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-6">
            <div className="relative">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] shadow-lift">
                <Image
                  src="/brand/hero-banner.jpg"
                  alt="A selection of snack packs from our wholesale range"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>

              <div className="absolute -bottom-5 left-5 sm:left-8 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lift">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-leaf-50 text-leaf-600">
                  <TruckIcon className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">Pallet &amp; container shipping</p>
                  <p className="text-xs text-stone-500">Dispatched from our Luton depot</p>
                </div>
              </div>

              <div className="absolute -top-4 -right-2 sm:right-6 flex items-center gap-1.5 rounded-full bg-leaf-600 text-white px-4 py-2 text-sm font-medium shadow-soft rotate-3">
                <LeafIcon className="w-4 h-4" />
                Halal &amp; veg options
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
