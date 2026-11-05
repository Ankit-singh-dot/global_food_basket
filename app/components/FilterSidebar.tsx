"use client";

import React, { useState } from "react";
import { FilterIcon, ChevronDownIcon } from "./icons";
import {
  CATEGORIES,
  BRANDS,
  DIETARY_TAGS,
  PACKAGING_TYPES,
  Product,
} from "./data/products";

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

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="space-y-2.5 pt-5 border-t border-line first:pt-0 first:border-t-0">
    <h4 className="text-sm font-semibold text-ink">{title}</h4>
    {children}
  </div>
);

const OptionButton: React.FC<{
  label: string;
  count: number;
  selected: boolean;
  onClick: () => void;
}> = ({ label, count, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition text-left ${
      selected
        ? "bg-leaf-50 text-leaf-800 font-semibold"
        : "text-stone-600 hover:bg-cream hover:text-ink"
    }`}
  >
    <span className="truncate pr-2">{label}</span>
    <span
      className={`tabular text-xs rounded-full px-2 py-0.5 ${
        selected ? "bg-leaf-600 text-white" : "bg-sand text-stone-500"
      }`}
    >
      {count}
    </span>
  </button>
);

const CheckOption: React.FC<{
  label: string;
  checked: boolean;
  onChange: () => void;
}> = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2.5 text-sm text-stone-600 hover:text-ink cursor-pointer select-none py-1">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 rounded accent-leaf-600"
    />
    <span className="truncate">{label}</span>
  </label>
);

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
  const categoryCount = (cat: string) =>
    cat === "All Lines" ? products.length : products.filter((p) => p.category === cat).length;
  const brandCount = (brand: string) => products.filter((p) => p.brand === brand).length;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <button
        type="button"
        onClick={() => setMobileOpen((o) => !o)}
        aria-expanded={mobileOpen}
        className="lg:hidden w-full flex items-center justify-between rounded-full bg-white border border-line px-5 py-3 text-sm font-semibold text-ink"
      >
        <span className="flex items-center gap-2">
          <FilterIcon className="w-4 h-4 text-leaf-600" />
          Filters
          {activeFilterCount > 0 && (
            <span className="tabular rounded-full bg-leaf-600 text-white text-xs px-2 py-0.5">
              {activeFilterCount}
            </span>
          )}
        </span>
        <ChevronDownIcon className={`w-4 h-4 transition ${mobileOpen ? "rotate-180" : ""}`} />
      </button>
      <div
        className={`${mobileOpen ? "block mt-3" : "hidden"} lg:block bg-white p-5 rounded-3xl border border-line space-y-5`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-ink">Refine</h3>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="text-sm text-leaf-700 hover:text-leaf-900 font-medium transition"
            >
              Clear all ({activeFilterCount})
            </button>
          )}
        </div>

        <label className="flex items-center justify-between gap-3 rounded-2xl bg-cream px-3.5 py-3 cursor-pointer">
          <span className="text-sm font-medium text-ink">Best sellers only</span>
          <span className="relative inline-flex">
            <input
              type="checkbox"
              checked={onlyFastMoving}
              onChange={(e) => setOnlyFastMoving(e.target.checked)}
              className="peer sr-only"
            />
            <span className="w-10 h-6 rounded-full bg-stone-300 peer-checked:bg-leaf-600 transition" />
            <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
          </span>
        </label>

        <div className="space-y-5">
          <Section title="Category">
            <div className="space-y-0.5">
              {CATEGORIES.map((cat) => (
                <OptionButton
                  key={cat}
                  label={cat === "All Lines" ? "All products" : cat}
                  count={categoryCount(cat)}
                  selected={selectedCategory === cat}
                  onClick={() => setSelectedCategory(cat)}
                />
              ))}
            </div>
          </Section>

          <Section title="Brand">
            <div className="space-y-0.5">
              <OptionButton
                label="All brands"
                count={products.length}
                selected={selectedBrand === "All Brands"}
                onClick={() => setSelectedBrand("All Brands")}
              />
              {BRANDS.map((brand) => (
                <OptionButton
                  key={brand}
                  label={brand}
                  count={brandCount(brand)}
                  selected={selectedBrand === brand}
                  onClick={() => setSelectedBrand(brand)}
                />
              ))}
            </div>
          </Section>

          <Section title="Dietary">
            <div>
              {DIETARY_TAGS.map((tag) => (
                <CheckOption
                  key={tag}
                  label={tag}
                  checked={selectedDietary.includes(tag)}
                  onChange={() => toggleDietary(tag)}
                />
              ))}
            </div>
          </Section>

          <Section title="Pack type">
            <div>
              {PACKAGING_TYPES.map((type) => (
                <CheckOption
                  key={type}
                  label={type}
                  checked={selectedPackaging.includes(type)}
                  onChange={() => togglePackaging(type)}
                />
              ))}
            </div>
          </Section>
        </div>
      </div>
    </aside>
  );
};
