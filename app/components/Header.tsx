"use client";

import React from "react";
import Image from "next/image";
import { SearchIcon, ShoppingBagIcon, FileTextIcon, LeafIcon, XIcon } from "./icons";
import type { Currency } from "./format";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  orderItemCount: number;
  totalCases: number;
  onOpenOrderDrawer: () => void;
  onOpenFlyersModal: () => void;
}

const SearchField: React.FC<{
  value: string;
  onChange: (v: string) => void;
  className?: string;
}> = ({ value, onChange, className = "" }) => (
  <div className={`relative ${className}`}>
    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4 pointer-events-none" />
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search products, brands or barcodes"
      aria-label="Search products"
      className="w-full pl-11 pr-10 py-2.5 text-sm bg-white border border-line rounded-full text-ink placeholder-stone-400 focus:outline-hidden focus:border-leaf-400 focus:ring-4 focus:ring-leaf-100 transition"
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange("")}
        aria-label="Clear search"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-stone-400 hover:text-ink hover:bg-sand transition"
      >
        <XIcon className="w-3.5 h-3.5" />
      </button>
    )}
  </div>
);

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  currency,
  setCurrency,
  totalCases,
  onOpenOrderDrawer,
  onOpenFlyersModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Announcement strip */}
      <div className="bg-ink text-white/80 text-[13px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-4">
          <p className="flex items-center gap-2 truncate">
            <LeafIcon className="w-3.5 h-3.5 text-leaf-400 shrink-0" />
            <span className="truncate">
              Wholesale supply from Luton, UK
              <span className="hidden md:inline"> · delivering across the UK &amp; India</span>
            </span>
          </p>

          <div
            role="group"
            aria-label="Price currency"
            className="flex items-center gap-1 shrink-0 rounded-full bg-white/10 p-0.5"
          >
            {(["INR", "GBP"] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurrency(c)}
                aria-pressed={currency === c}
                className={`px-3 py-0.5 rounded-full text-xs font-medium transition ${
                  currency === c ? "bg-white text-ink" : "text-white/70 hover:text-white"
                }`}
              >
                {c === "INR" ? "₹ INR" : "£ GBP"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="bg-cream/90 backdrop-blur-md border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-6">
          <a href="#" className="shrink-0" aria-label="Global Food Basket home">
            <Image
              src="/brand/logo.png"
              alt="Global Food Basket"
              width={1104}
              height={590}
              className="h-12 sm:h-14 w-auto mix-blend-multiply"
              priority
            />
          </a>

          <SearchField
            value={searchQuery}
            onChange={setSearchQuery}
            className="flex-1 max-w-lg hidden md:block"
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenFlyersModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-ink bg-white hover:bg-sand rounded-full border border-line transition"
            >
              <FileTextIcon className="w-4 h-4 text-leaf-600" />
              <span className="hidden sm:inline">Price lists</span>
            </button>

            <button
              type="button"
              onClick={onOpenOrderDrawer}
              className="inline-flex items-center gap-2 pl-4 pr-2 py-2 text-sm font-medium text-white bg-leaf-600 hover:bg-leaf-700 rounded-full transition shadow-soft"
            >
              <ShoppingBagIcon className="w-4 h-4" />
              <span>Your order</span>
              <span className="tabular inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full bg-white text-leaf-700 text-xs font-semibold">
                {totalCases}
              </span>
            </button>
          </div>
        </div>

        <div className="px-4 pb-3 md:hidden">
          <SearchField value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>
    </header>
  );
};
