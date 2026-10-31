"use client";

import React from "react";
import Image from "next/image";
import { ChevronRightIcon, BoxIcon, TruckIcon, ShieldCheckIcon } from "./icons";

interface HeroBannerProps {
  onScrollToCatalog: () => void;
  onOpenOrderDrawer: () => void;
  onOpenFlyersModal: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onScrollToCatalog,
  onOpenOrderDrawer,
  onOpenFlyersModal,
}) => {
  return (
    <section className="bg-white border-b border-zinc-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Editorial Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 text-xs font-mono tracking-tight border border-zinc-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-900"></span>
              PRIMARY FMCG DISTRIBUTION • DIRECT FACTORY LOTS
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-zinc-950 leading-[1.12]">
                Wholesale Confectionery &amp; Bakery.
              </h1>
              <p className="text-sm sm:text-base text-zinc-600 max-w-xl leading-relaxed">
                Direct trade allocations for retail grocers, cash &amp; carry distributors, and export consolidators. Sourced directly from Ever Delicious and Royal Danish bakeries.
              </p>
            </div>

            {/* Restrained Metric Row */}
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-zinc-100 max-w-lg">
              <div>
                <p className="font-mono text-xs text-zinc-400 uppercase tracking-wider">Active Inventory</p>
                <p className="text-base font-semibold text-zinc-900 mt-0.5">8,240 Cases</p>
                <p className="text-[11px] text-zinc-500">20 Primary SKUs</p>
              </div>

              <div>
                <p className="font-mono text-xs text-zinc-400 uppercase tracking-wider">Despatch Minimum</p>
                <p className="text-base font-semibold text-zinc-900 mt-0.5">1 Pallet / Case</p>
                <p className="text-[11px] text-zinc-500">Dry &amp; Ambient</p>
              </div>

              <div>
                <p className="font-mono text-xs text-zinc-400 uppercase tracking-wider">Typical Margin</p>
                <p className="text-base font-semibold text-zinc-900 mt-0.5">32% – 44%</p>
                <p className="text-[11px] text-zinc-500">FMCG Retail ROI</p>
              </div>
            </div>

            {/* Action Group */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onScrollToCatalog}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-medium rounded-lg transition"
              >
                <span>Browse Inventory Catalog</span>
                <ChevronRightIcon className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              <button
                type="button"
                onClick={onOpenOrderDrawer}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-zinc-50 text-zinc-900 text-xs font-medium rounded-lg border border-zinc-200 transition"
              >
                <span>Open Purchase Order Pad</span>
              </button>

              <button
                type="button"
                onClick={onOpenFlyersModal}
                className="text-xs text-zinc-500 hover:text-zinc-950 font-medium transition ml-1"
              >
                Trade Sheets (4 Releases) →
              </button>
            </div>
          </div>

          {/* Right Visual Frame */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50 shadow-xs">
              <div
                className="relative aspect-16/10 w-full overflow-hidden bg-zinc-100"
                style={{ aspectRatio: "16 / 10", minHeight: "220px" }}
              >
                <Image
                  src="/brand/hero-banner.jpg"
                  alt="Ever Delicious Wholesale Confectionery"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="px-4 py-3 bg-white border-t border-zinc-200 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <p className="font-medium text-zinc-900">
                    Ever Delicious &amp; Royal Danish Master Portfolio
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Butter tins, fruit preserves, and whole-grain oat lines
                  </p>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                  Luton Depot
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
