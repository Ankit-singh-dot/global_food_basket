"use client";

import React, { useState, useMemo, useRef } from "react";
import { PRODUCTS, Product, CATEGORIES } from "./components/data/products";
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
import {
  GridIcon,
  ListIcon,
  SearchIcon,
  XIcon,
  FileTextIcon,
} from "./components/icons";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Lines");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedPackaging, setSelectedPackaging] = useState<string[]>([]);
  const [onlyFastMoving, setOnlyFastMoving] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [currency, setCurrency] = useState<"INR" | "GBP">("INR");
  const [sortBy, setSortBy] = useState<
    "featured" | "price-asc" | "price-desc" | "stock-desc" | "margin-desc"
  >("featured");

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrderDrawerOpen, setIsOrderDrawerOpen] = useState(false);
  const [isFlyersModalOpen, setIsFlyersModalOpen] = useState(false);

  const [orderItems, setOrderItems] = useState<Record<string, number>>({
    "gfb-001": 2, // 2 cases × ₹360 = ₹720
    "gfb-008": 1, // 1 case × ₹684 = ₹684
    "gfb-013": 2, // 2 cases × ₹624 = ₹1,248
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
    <div className="min-h-screen flex flex-col bg-zinc-50/50 text-zinc-950 font-sans selection:bg-zinc-200 selection:text-zinc-900">
      {/* 1. Header */}
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

      {/* 2. Sleek Editorial Category Sub-Navigation */}
      <div className="bg-white border-b border-zinc-200/80 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 sm:gap-2 py-2 whitespace-nowrap text-xs font-medium">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  scrollToCatalog();
                }}
                className={`px-3 py-1.5 rounded-md transition ${
                  isSelected
                    ? "bg-zinc-950 text-white font-semibold"
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Hero Section */}
      <HeroBanner
        onScrollToCatalog={scrollToCatalog}
        onOpenOrderDrawer={() => setIsOrderDrawerOpen(true)}
        onOpenFlyersModal={() => setIsFlyersModalOpen(true)}
      />

      {/* 4. Main Catalog Section */}
      <main
        ref={catalogRef}
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10"
      >
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Faceted Filters */}
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

          {/* Right Catalog View */}
          <div className="flex-1 w-full space-y-4">
            {/* Header Control Bar */}
            <div className="bg-white p-4 rounded-xl border border-zinc-200/80 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-zinc-950">
                  {selectedCategory === "All Lines"
                    ? "Wholesale Product Catalog"
                    : selectedCategory}
                </h3>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">
                  {filteredProducts.length} of {PRODUCTS.length} SKUs available
                </p>
              </div>

              {/* View Switcher & Sorting */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
                  <span className="hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-zinc-50 border border-zinc-200 text-zinc-800 rounded-md py-1 px-2.5 text-xs font-sans font-medium focus:outline-hidden"
                  >
                    <option value="featured">Featured First</option>
                    <option value="price-asc">Case Rate: Low to High</option>
                    <option value="price-desc">Case Rate: High to Low</option>
                    <option value="stock-desc">Stock: High to Low</option>
                    <option value="margin-desc">Margin %: High to Low</option>
                  </select>
                </div>

                {/* Grid / Table Toggle */}
                <div className="inline-flex rounded-md p-0.5 bg-zinc-100 border border-zinc-200">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded transition ${
                      viewMode === "grid"
                        ? "bg-white text-zinc-950 shadow-2xs"
                        : "text-zinc-500 hover:text-zinc-800"
                    }`}
                    title="Grid View"
                  >
                    <GridIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("table")}
                    className={`p-1.5 rounded transition ${
                      viewMode === "table"
                        ? "bg-white text-zinc-950 shadow-2xs"
                        : "text-zinc-500 hover:text-zinc-800"
                    }`}
                    title="Table View"
                  >
                    <ListIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-xs">
                <span className="text-[11px] text-zinc-400 font-mono">Filters:</span>
                {selectedCategory !== "All Lines" && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded border border-zinc-200">
                    {selectedCategory}
                    <button
                      type="button"
                      onClick={() => setSelectedCategory("All Lines")}
                      className="hover:text-zinc-950"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedBrand !== "All Brands" && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded border border-zinc-200">
                    {selectedBrand}
                    <button
                      type="button"
                      onClick={() => setSelectedBrand("All Brands")}
                      className="hover:text-zinc-950"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedDietary.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-[11px] font-medium bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded border border-zinc-200"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => toggleDietary(tag)}
                      className="hover:text-zinc-950"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {selectedPackaging.map((type) => (
                  <span
                    key={type}
                    className="inline-flex items-center gap-1 text-[11px] font-medium bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded border border-zinc-200"
                  >
                    {type}
                    <button
                      type="button"
                      onClick={() => togglePackaging(type)}
                      className="hover:text-zinc-950"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded border border-zinc-200">
                    &ldquo;{searchQuery}&rdquo;
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="hover:text-zinc-950"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] text-zinc-500 hover:text-zinc-950 underline ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Catalog Grid or Table */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl border border-zinc-200/80 p-12 text-center space-y-2">
                <p className="text-xs font-medium text-zinc-900">
                  No products match the selected criteria
                </p>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Try clearing your search query or reset your filter parameters.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-zinc-950 text-white text-xs font-medium hover:bg-zinc-800 transition mt-2"
                >
                  Reset filters
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

            {/* Bottom Callout to Master Trade Sheets */}
            <div className="p-4 rounded-xl bg-zinc-100 border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="space-y-0.5 text-center sm:text-left">
                <p className="font-semibold text-zinc-950">
                  Primary Manufacturer Trade Releases
                </p>
                <p className="text-zinc-500">
                  Inspect the 4 master trade sheets containing original packing dimensions, barcodes, and master shipper specifications.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFlyersModalOpen(true)}
                className="px-3.5 py-1.5 bg-white hover:bg-zinc-50 text-zinc-900 rounded-md font-medium shrink-0 border border-zinc-200 shadow-2xs transition"
              >
                View Trade Sheets →
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 5. Wholesale Narrative */}
      <WholesaleInfo />

      {/* 6. Footer */}
      <Footer
        onOpenFlyersModal={() => setIsFlyersModalOpen(true)}
        onOpenOrderDrawer={() => setIsOrderDrawerOpen(true)}
      />

      {/* 7. Technical Specs Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        currency={currency}
        onAddCases={handleAddCases}
        orderQuantity={selectedProduct ? orderItems[selectedProduct.id] || 0 : 0}
      />

      {/* 8. Master Trade Sheets Modal */}
      <FlyerModal
        isOpen={isFlyersModalOpen}
        onClose={() => setIsFlyersModalOpen(false)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* 9. Order Drawer */}
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
