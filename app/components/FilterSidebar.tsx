"use client";

import React from "react";
import {
  CATEGORIES,
  BRANDS,
  DIETARY_TAGS,
  PACKAGING_TYPES,
  Product,
} from "./data/products";
import { FilterIcon, XIcon } from "./icons";

interface FilterSidebarProps {
  products: Product[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  selectedDietary: string[];
  toggleDietary: (tag: string) => void;
  selectedPackaging: string[];
  togglePackaging: (type: string) => void;
  onlyFastMoving: boolean;
  setOnlyFastMoving: (v: boolean) => void;
  onReset: () => void;
  activeFilterCount: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  products,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  selectedDietary,
  toggleDietary,
  selectedPackaging,
  togglePackaging,
  onlyFastMoving,
  setOnlyFastMoving,
  onReset,
  activeFilterCount,
}) => {
  const getCategoryCount = (cat: string) => {
    if (cat === "All Lines") return products.length;
    return products.filter((p) => p.category === cat).length;
  };

  const getBrandCount = (brand: string) => {
    return products.filter((p) => p.brand === brand).length;
  };

  return (
    <aside className="w-full lg:w-60 shrink-0 space-y-6">
      <div className="bg-white p-4 rounded-xl border border-zinc-200/80 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2 text-zinc-950 font-medium text-xs">
            <FilterIcon className="w-3.5 h-3.5 text-zinc-500" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-zinc-950 text-white font-mono text-[10px]">
                {activeFilterCount}
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="text-[11px] text-zinc-500 hover:text-zinc-950 font-medium inline-flex items-center gap-1 transition"
            >
              <XIcon className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            Category
          </p>
          <div className="space-y-0.5">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count = getCategoryCount(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition text-left ${
                    isSelected
                      ? "bg-zinc-950 text-white font-semibold"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                  }`}
                >
                  <span className="truncate pr-2">{cat}</span>
                  <span
                    className={`font-mono text-[10px] px-1 rounded ${
                      isSelected ? "text-zinc-400" : "text-zinc-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Brands */}
        <div className="space-y-2 pt-3 border-t border-zinc-100">
          <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            Brand
          </p>
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => setSelectedBrand("All Brands")}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition text-left ${
                selectedBrand === "All Brands"
                  ? "bg-zinc-950 text-white font-semibold"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
              }`}
            >
              <span>All Brands</span>
              <span className="font-mono text-[10px] text-zinc-400">
                {products.length}
              </span>
            </button>
            {BRANDS.map((brand) => {
              const isSelected = selectedBrand === brand;
              const count = getBrandCount(brand);
              return (
                <button
                  key={brand}
                  type="button"
                  onClick={() => setSelectedBrand(brand)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition text-left ${
                    isSelected
                      ? "bg-zinc-950 text-white font-semibold"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                  }`}
                >
                  <span className="truncate pr-2">{brand}</span>
                  <span
                    className={`font-mono text-[10px] px-1 rounded ${
                      isSelected ? "text-zinc-400" : "text-zinc-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dietary */}
        <div className="space-y-2 pt-3 border-t border-zinc-100">
          <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            Certifications
          </p>
          <div className="space-y-1.5">
            {DIETARY_TAGS.map((tag) => {
              const checked = selectedDietary.includes(tag);
              return (
                <label
                  key={tag}
                  className="flex items-center gap-2 text-xs text-zinc-600 hover:text-zinc-950 cursor-pointer select-none py-0.5"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleDietary(tag)}
                    className="w-3.5 h-3.5 rounded border-zinc-300 text-zinc-950 accent-zinc-950 focus:ring-zinc-950"
                  />
                  <span className="truncate">{tag}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Packaging Types */}
        <div className="space-y-2 pt-3 border-t border-zinc-100">
          <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            Packaging Format
          </p>
          <div className="space-y-1.5">
            {PACKAGING_TYPES.map((type) => {
              const checked = selectedPackaging.includes(type);
              return (
                <label
                  key={type}
                  className="flex items-center gap-2 text-xs text-zinc-600 hover:text-zinc-950 cursor-pointer select-none py-0.5"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => togglePackaging(type)}
                    className="w-3.5 h-3.5 rounded border-zinc-300 text-zinc-950 accent-zinc-950 focus:ring-zinc-950"
                  />
                  <span>{type}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};
