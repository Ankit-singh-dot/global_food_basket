"use client";

import React from "react";
import Image from "next/image";
import {
  SearchIcon,
  ShoppingBagIcon,
  FileTextIcon,
} from "./icons";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currency: "INR" | "GBP";
  setCurrency: (c: "INR" | "GBP") => void;
  orderItemCount: number;
  totalCases: number;
  onOpenOrderDrawer: () => void;
  onOpenFlyersModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  currency,
  setCurrency,
  orderItemCount,
  totalCases,
  onOpenOrderDrawer,
  onOpenFlyersModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-zinc-200/80">
      {/* Top Utility Bar */}
      <div className="border-b border-zinc-100 bg-zinc-50/70 text-zinc-500 text-[11px] py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium text-zinc-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Primary Wholesale Stockist
            </span>
            <span className="hidden md:inline text-zinc-300">•</span>
            <span className="hidden md:inline text-zinc-500">
              Direct Bonded Depot: Luton, LU2 8EU & Pan-India Distribution
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-zinc-400">Pricing Mode:</span>
            <div className="inline-flex rounded-md p-0.5 bg-zinc-200/60 text-zinc-600 border border-zinc-200">
              <button
                type="button"
                onClick={() => setCurrency("INR")}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                  currency === "INR"
                    ? "bg-white text-zinc-950 shadow-2xs font-semibold"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                ₹ INR Wholesale
              </button>
              <button
                type="button"
                onClick={() => setCurrency("GBP")}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                  currency === "GBP"
                    ? "bg-white text-zinc-950 shadow-2xs font-semibold"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                £ GBP Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div
            className="relative shrink-0 flex items-center justify-start overflow-hidden"
            style={{ width: "170px", height: "40px" }}
          >
            <Image
              src="/brand/logo.png"
              alt="Global Food Basket"
              width={170}
              height={40}
              className="object-contain object-left w-auto h-10"
              style={{ maxHeight: "40px", maxWidth: "170px", objectFit: "contain" }}
              priority
            />
          </div>
          <span className="hidden lg:inline-flex text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 border border-zinc-200/60">
            Wholesale B2B
          </span>
        </div>

        {/* Minimal Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by product, SKU, packing, or barcode..."
              className="w-full pl-9 pr-12 py-1.5 text-xs bg-zinc-50 hover:bg-zinc-100/60 focus:bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-400 transition"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-zinc-400 hover:text-zinc-600"
              >
                Clear
              </button>
            ) : (
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden xl:inline-flex items-center text-[10px] text-zinc-400 bg-white border border-zinc-200 rounded px-1.5 py-0.2">
                ⌘K
              </kbd>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenFlyersModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-950 bg-transparent hover:bg-zinc-100 rounded-lg border border-zinc-200 transition"
          >
            <FileTextIcon className="w-3.5 h-3.5 text-zinc-500" />
            <span className="hidden sm:inline">Trade Releases</span>
            <span className="sm:hidden">Flyers</span>
            <span className="text-[10px] font-mono text-zinc-500">4</span>
          </button>

          <button
            type="button"
            onClick={onOpenOrderDrawer}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-white bg-zinc-950 hover:bg-zinc-800 rounded-lg transition shadow-xs"
          >
            <ShoppingBagIcon className="w-3.5 h-3.5 text-zinc-300" />
            <span>Order Pad</span>
            <span className="inline-flex items-center justify-center min-w-4.5 h-4.5 px-1 rounded-full bg-zinc-700 text-[10px] font-mono font-bold text-white">
              {totalCases}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="px-4 pb-2.5 md:hidden">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, SKUs, or barcodes..."
            className="w-full pl-8 pr-8 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-hidden"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
