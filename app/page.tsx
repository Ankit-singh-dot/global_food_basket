"use client";

import React, { useState, useMemo, useRef } from "react";
import { PRODUCTS, Product, CATEGORIES, MASTER_TRADE_SHEETS } from "./components/data/products";
import { Header } from "./components/Header";
import { HeroBanner } from "./components/HeroBanner";
import { FilterSidebar } from "./components/FilterSidebar";
import { ProductCard } from "./components/ProductCard";
import { ProductTableView } from "./components/ProductTableView";
import { ProductModal } from "./components/ProductModal";
import { OrderDrawer } from "./components/OrderDrawer";
import { FlyerModal } from "./components/FlyerModal";
import { WholesaleInfo } from "./components/WholesaleInfo";
import { Footer } from "./components/Footer";
import { GridIcon, ListIcon, XIcon, FileTextIcon, ArrowRightIcon } from "./components/icons";
import type { Currency } from "./components/format";

type SortKey = "featured" | "price-asc" | "price-desc" | "stock-desc" | "margin-desc";

const FilterChip: React.FC<{ label: React.ReactNode; onRemove: () => void }> = ({
  label,
  onRemove,
}) => (
  <span className="inline-flex items-center gap-1.5 text-sm bg-white text-ink pl-3 pr-1.5 py-1 rounded-full border border-line">
    {label}
    <button
      type="button"
      onClick={onRemove}
      aria-label="Remove filter"
      className="p-0.5 rounded-full text-stone-400 hover:text-ink hover:bg-sand transition"
    >
      <XIcon className="w-3.5 h-3.5" />
    </button>
  </span>
);

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Lines");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedPackaging, setSelectedPackaging] = useState<string[]>([]);
  const [onlyFastMoving, setOnlyFastMoving] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [currency, setCurrency] = useState<Currency>("INR");
  const [sortBy, setSortBy] = useState<SortKey>("featured");

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrderDrawerOpen, setIsOrderDrawerOpen] = useState(false);
  const [isFlyersModalOpen, setIsFlyersModalOpen] = useState(false);

  const [orderItems, setOrderItems] = useState<Record<string, number>>({
    "gfb-001": 2,
    "gfb-008": 1,
    "gfb-013": 2,
  });

  const catalogRef = useRef<HTMLDivElement>(null);

  const toggleDietary = (tag: string) => {
    setSelectedDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const togglePackaging = (type: string) => {
    setSelectedPackaging((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Lines");
    setSelectedBrand("All Brands");
    setSelectedDietary([]);
    setSelectedPackaging([]);
    setOnlyFastMoving(false);
    setSortBy("featured");
  };

  const activeFilterCount =
    (selectedCategory !== "All Lines" ? 1 : 0) +
    (selectedBrand !== "All Brands" ? 1 : 0) +
    selectedDietary.length +
    selectedPackaging.length +
    (onlyFastMoving ? 1 : 0) +
    (searchQuery.trim().length > 0 ? 1 : 0);

  const handleAddCases = (product: Product, cases: number) => {
    setOrderItems((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + cases,
    }));
  };

  const handleUpdateQuantity = (productId: string, cases: number) => {
    setOrderItems((prev) => {
      const updated = { ...prev };
      if (cases <= 0) {
        delete updated[productId];
      } else {
        updated[productId] = cases;
      }
      return updated;
    });
  };

  const handleClearOrder = () => {
    setOrderItems({});
  };

  const totalCasesInOrder = Object.values(orderItems).reduce((a, b) => a + b, 0);
  const orderItemCount = Object.keys(orderItems).length;

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesSku = p.sku.toLowerCase().includes(query);
        const matchesBarcode = p.barcode.includes(query);
        const matchesPacking = p.packing.toLowerCase().includes(query);
        const matchesBrand = p.brand.toLowerCase().includes(query);
        if (
          !matchesName &&
          !matchesSku &&
          !matchesBarcode &&
          !matchesPacking &&
          !matchesBrand
        ) {
          return false;
        }
      }

      if (selectedCategory !== "All Lines" && p.category !== selectedCategory) {
        return false;
      }

      if (selectedBrand !== "All Brands" && p.brand !== selectedBrand) {
        return false;
      }

      if (onlyFastMoving && !p.fastMoving) {
        return false;
      }

      if (selectedDietary.length > 0) {
        const hasAll = selectedDietary.every((tag) => p.dietary.includes(tag));
        if (!hasAll) return false;
      }

      if (
        selectedPackaging.length > 0 &&
        !selectedPackaging.includes(p.packagingType)
      ) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") {
        return a.wholesaleInr * a.unitsPerCase - b.wholesaleInr * b.unitsPerCase;
      }
      if (sortBy === "price-desc") {
        return b.wholesaleInr * b.unitsPerCase - a.wholesaleInr * a.unitsPerCase;
      }
      if (sortBy === "stock-desc") {
        return b.inStockCases - a.inStockCases;
      }
      if (sortBy === "margin-desc") {
        const marginA = (a.mrpInr - a.wholesaleInr) / a.mrpInr;
        const marginB = (b.mrpInr - b.wholesaleInr) / b.mrpInr;
        return marginB - marginA;
      }
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [
    searchQuery,
    selectedCategory,
    selectedBrand,
    onlyFastMoving,
    selectedDietary,
    selectedPackaging,
    sortBy,
  ]);

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink font-sans">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currency={currency}
        setCurrency={setCurrency}
        orderItemCount={orderItemCount}
        totalCases={totalCasesInOrder}
        onOpenOrderDrawer={() => setIsOrderDrawerOpen(true)}
        onOpenFlyersModal={() => setIsFlyersModalOpen(true)}
      />

      <HeroBanner
        onScrollToCatalog={scrollToCatalog}
        onOpenFlyersModal={() => setIsFlyersModalOpen(true)}
        onSelectProduct={setSelectedProduct}
      />

      <main
        ref={catalogRef}
        className="flex-1 w-full bg-white/60 border-t border-line scroll-mt-28"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          {/* Section heading + category pills */}
          <div className="space-y-6 mb-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-script text-2xl text-leaf-600">Our range</p>
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
                  {selectedCategory === "All Lines" ? "Shop by the case" : selectedCategory}
                </h2>
                <p className="text-stone-500 mt-1">
                  Showing <span className="tabular">{filteredProducts.length}</span> of{" "}
                  <span className="tabular">{PRODUCTS.length}</span> products
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="sr-only" htmlFor="sort">
                  Sort products
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                  className="bg-white border border-line text-ink rounded-full py-2.5 pl-4 pr-8 text-sm font-medium focus:outline-hidden focus:ring-4 focus:ring-leaf-100 focus:border-leaf-400"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="stock-desc">Most in stock</option>
                  <option value="margin-desc">Best margin</option>
                </select>

                <div className="inline-flex rounded-full p-1 bg-white border border-line">
                  {(
                    [
                      ["grid", GridIcon, "Grid view"],
                      ["table", ListIcon, "List view"],
                    ] as const
                  ).map(([mode, Icon, label]) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setViewMode(mode)}
                      aria-pressed={viewMode === mode}
                      title={label}
                      className={`p-2 rounded-full transition ${
                        viewMode === mode
                          ? "bg-ink text-white"
                          : "text-stone-500 hover:text-ink"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    aria-pressed={isSelected}
                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition ${
                      isSelected
                        ? "bg-leaf-600 border-leaf-600 text-white"
                        : "bg-white border-line text-stone-600 hover:border-leaf-300 hover:text-ink"
                    }`}
                  >
                    {cat === "All Lines" ? "All products" : cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <FilterSidebar
              products={PRODUCTS}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              selectedDietary={selectedDietary}
              toggleDietary={toggleDietary}
              selectedPackaging={selectedPackaging}
              togglePackaging={togglePackaging}
              onlyFastMoving={onlyFastMoving}
              setOnlyFastMoving={setOnlyFastMoving}
              onReset={handleResetFilters}
              activeFilterCount={activeFilterCount}
            />

            <div className="flex-1 w-full space-y-6">
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {selectedCategory !== "All Lines" && (
                    <FilterChip
                      label={selectedCategory}
                      onRemove={() => setSelectedCategory("All Lines")}
                    />
                  )}
                  {selectedBrand !== "All Brands" && (
                    <FilterChip
                      label={selectedBrand}
                      onRemove={() => setSelectedBrand("All Brands")}
                    />
                  )}
                  {selectedDietary.map((tag) => (
                    <FilterChip key={tag} label={tag} onRemove={() => toggleDietary(tag)} />
                  ))}
                  {selectedPackaging.map((type) => (
                    <FilterChip key={type} label={type} onRemove={() => togglePackaging(type)} />
                  ))}
                  {onlyFastMoving && (
                    <FilterChip label="Best sellers" onRemove={() => setOnlyFastMoving(false)} />
                  )}
                  {searchQuery && (
                    <FilterChip
                      label={<>&ldquo;{searchQuery}&rdquo;</>}
                      onRemove={() => setSearchQuery("")}
                    />
                  )}
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-sm font-medium text-leaf-700 hover:text-leaf-900 px-2"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-3xl border border-line px-6 py-16 text-center">
                  <p className="font-script text-3xl text-leaf-600">Hmm…</p>
                  <p className="text-lg font-semibold text-ink mt-1">
                    Nothing matches those filters
                  </p>
                  <p className="text-stone-500 mt-1 max-w-sm mx-auto">
                    Try a different search or clear a few filters.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="mt-6 px-5 py-2.5 rounded-full bg-ink text-white text-sm font-semibold hover:bg-leaf-700 transition"
                  >
                    Show all products
                  </button>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      currency={currency}
                      onSelectProduct={setSelectedProduct}
                      onAddCases={handleAddCases}
                      orderQuantity={orderItems[product.id] || 0}
                    />
                  ))}
                </div>
              ) : (
                <ProductTableView
                  products={filteredProducts}
                  currency={currency}
                  onSelectProduct={setSelectedProduct}
                  onAddCases={handleAddCases}
                  orderItems={orderItems}
                />
              )}

              <div className="rounded-3xl bg-leaf-50 border border-leaf-100 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div className="flex items-start gap-4">
                  <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white text-leaf-600 shrink-0">
                    <FileTextIcon className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-lg font-semibold text-ink">Prefer a printed price list?</p>
                    <p className="text-stone-600 mt-0.5">
                      See our {MASTER_TRADE_SHEETS.length} trade sheets with pack sizes, barcodes and carton details.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFlyersModalOpen(true)}
                  className="group inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-ink hover:text-white text-ink rounded-full text-sm font-semibold shrink-0 border border-leaf-200 hover:border-ink transition"
                >
                  View price lists
                  <ArrowRightIcon className="w-4 h-4 transition group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <WholesaleInfo />

      <Footer
        onOpenFlyersModal={() => setIsFlyersModalOpen(true)}
        onOpenOrderDrawer={() => setIsOrderDrawerOpen(true)}
      />

      <ProductModal
        key={selectedProduct?.id}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        currency={currency}
        onAddCases={handleAddCases}
        orderQuantity={selectedProduct ? orderItems[selectedProduct.id] || 0 : 0}
      />

      <FlyerModal
        isOpen={isFlyersModalOpen}
        onClose={() => setIsFlyersModalOpen(false)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <OrderDrawer
        isOpen={isOrderDrawerOpen}
        onClose={() => setIsOrderDrawerOpen(false)}
        orderItems={orderItems}
        onUpdateQuantity={handleUpdateQuantity}
        onClearOrder={handleClearOrder}
        currency={currency}
      />
    </div>
  );
}
