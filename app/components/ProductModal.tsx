"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "./data/products";
import {
  XIcon,
  BarcodeIcon,
  CopyIcon,
  CheckIcon,
  ChevronDownIcon,
  ShoppingBagIcon,
  PlusIcon,
  MinusIcon,
  BoxIcon,
  TruckIcon,
} from "./icons";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  currency: "INR" | "GBP";
  onAddCases: (product: Product, cases: number) => void;
  orderQuantity: number;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  currency,
  onAddCases,
  orderQuantity,
}) => {
  const [copied, setCopied] = useState(false);
  const [quantity, setQuantity] = useState(product?.moqCases || 1);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    ingredients: true,
    allergens: true,
    nutrition: true,
    logistics: false,
  });

  if (!product) return null;

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopyBarcode = () => {
    navigator.clipboard.writeText(product.barcode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const casePrice =
    currency === "INR"
      ? product.wholesaleInr * product.unitsPerCase
      : Math.round(product.wholesaleGbp * product.unitsPerCase * 100) / 100;

  const displayCasePrice =
    currency === "INR" ? `₹${casePrice.toLocaleString()}` : `£${casePrice.toFixed(2)}`;
  const displayUnitWholesale =
    currency === "INR" ? `₹${product.wholesaleInr}` : `£${product.wholesaleGbp.toFixed(2)}`;
  const displayUnitMrp =
    currency === "INR" ? `₹${product.mrpInr}` : `£${product.mrpGbp.toFixed(2)}`;

  const orderSubtotal =
    currency === "INR"
      ? (casePrice * quantity).toLocaleString()
      : (casePrice * quantity).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-zinc-200/90 flex flex-col"
      >
        {/* Modal Top Bar */}
        <div className="px-5 py-3 bg-zinc-50 border-b border-zinc-200/80 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span>Wholesale</span>
            <span>/</span>
            <span>{product.category}</span>
            <span>/</span>
            <span className="text-zinc-900 font-semibold">{product.sku}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-900 p-1 rounded-md transition"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Product Photo */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative aspect-square w-full rounded-xl bg-zinc-50 border border-zinc-200/80 p-6 flex items-center justify-center overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>

              <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-200/70 text-xs space-y-1 font-mono">
                <div className="flex items-center justify-between text-zinc-600">
                  <span>Stock Allocation:</span>
                  <span className="font-semibold text-zinc-900">
                    {product.inStockCases} Cases Ready
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Catalog Source:</span>
                  <span className="text-zinc-600 truncate max-w-[190px]">
                    {product.sheetSource}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Product Specifications */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                    {product.brand}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                    {product.packagingType}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-zinc-950 tracking-tight leading-snug">
                  {product.name}
                </h2>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Technical Specifications Table */}
              <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white text-xs divide-y divide-zinc-100 font-mono">
                <div className="grid grid-cols-12 px-3.5 py-2.5 bg-zinc-50/50">
                  <div className="col-span-4 text-zinc-500 font-sans">Packing Format</div>
                  <div className="col-span-8 font-semibold text-zinc-950">
                    {product.packing} ({product.unitsPerCase} units/case)
                  </div>
                </div>

                <div className="grid grid-cols-12 px-3.5 py-2.5">
                  <div className="col-span-4 text-zinc-500 font-sans">Product Code</div>
                  <div className="col-span-8 font-semibold text-zinc-900">
                    {product.sku}
                  </div>
                </div>

                <div className="grid grid-cols-12 px-3.5 py-2.5">
                  <div className="col-span-4 text-zinc-500 font-sans">EAN Barcode</div>
                  <div className="col-span-8 flex items-center gap-2">
                    <span className="text-zinc-900 font-semibold">{product.barcode}</span>
                    <button
                      type="button"
                      onClick={handleCopyBarcode}
                      className="text-zinc-400 hover:text-zinc-800 p-0.5 rounded"
                      title="Copy Barcode"
                    >
                      {copied ? (
                        <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <CopyIcon className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-12 px-3.5 py-2.5">
                  <div className="col-span-4 text-zinc-500 font-sans">Pallet Standard</div>
                  <div className="col-span-8 text-zinc-800 font-sans">
                    48 Cases / UK Euro Pallet (1,152 Units)
                  </div>
                </div>

                <div className="grid grid-cols-12 px-3.5 py-2.5">
                  <div className="col-span-4 text-zinc-500 font-sans">Certifications</div>
                  <div className="col-span-8 flex flex-wrap gap-1 font-sans">
                    {product.dietary.map((d) => (
                      <span
                        key={d}
                        className="text-[10px] bg-zinc-100 text-zinc-700 px-1.5 py-0.2 rounded border border-zinc-200"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing Box */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                      Wholesale Case Rate
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold font-mono text-zinc-950">
                        {displayCasePrice}
                      </span>
                      <span className="text-xs text-zinc-500">
                        ({displayUnitWholesale} / retail unit)
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-medium text-zinc-700 bg-white px-2 py-0.5 rounded border border-zinc-200">
                      MRP {displayUnitMrp}
                    </span>
                    <p className="text-[11px] font-mono text-emerald-700 mt-1">
                      Margin: +{Math.round(((product.mrpInr - product.wholesaleInr) / product.mrpInr) * 100)}%
                    </p>
                  </div>
                </div>

                {/* Tier Discounts */}
                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-center pt-2 border-t border-zinc-200/60">
                  <div className="bg-white p-2 rounded border border-zinc-200/80">
                    <p className="text-zinc-900 font-semibold">1 – 10 Cases</p>
                    <p className="text-zinc-500 text-[10px]">Standard Rate</p>
                  </div>
                  <div className="bg-white p-2 rounded border border-zinc-200/80">
                    <p className="text-zinc-900 font-semibold">11 – 47 Cases</p>
                    <p className="text-emerald-700 text-[10px]">5% Wholesale Dis.</p>
                  </div>
                  <div className="bg-white p-2 rounded border border-zinc-200/80">
                    <p className="text-zinc-900 font-semibold">48+ (Pallet)</p>
                    <p className="text-emerald-700 text-[10px]">12% Pallet Dis.</p>
                  </div>
                </div>

                {/* Stepper & Add */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex items-center bg-white border border-zinc-200 rounded-md">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 rounded-l-md transition"
                    >
                      <MinusIcon className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-mono font-medium text-sm text-zinc-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 rounded-r-md transition"
                    >
                      <PlusIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onAddCases(product, quantity)}
                    className="flex-1 py-2 px-4 bg-zinc-950 hover:bg-zinc-800 text-white rounded-md font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition"
                  >
                    <span>
                      Add {quantity} {quantity === 1 ? "Case" : "Cases"} (
                      {currency === "INR" ? `₹${orderSubtotal}` : `£${orderSubtotal}`})
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Collapsible Accordions */}
          <div className="space-y-2 pt-2 border-t border-zinc-100">
            {/* Ingredients */}
            <div className="border border-zinc-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("ingredients")}
                className="w-full px-4 py-3 bg-zinc-50 hover:bg-zinc-100/70 text-left flex items-center justify-between text-xs font-semibold text-zinc-900 transition"
              >
                <span>Ingredients</span>
                <ChevronDownIcon
                  className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                    openSections.ingredients ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.ingredients && (
                <div className="p-4 bg-white text-xs text-zinc-600 leading-relaxed border-t border-zinc-100">
                  {product.ingredients}
                </div>
              )}
            </div>

            {/* Allergens */}
            <div className="border border-zinc-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("allergens")}
                className="w-full px-4 py-3 bg-zinc-50 hover:bg-zinc-100/70 text-left flex items-center justify-between text-xs font-semibold text-zinc-900 transition"
              >
                <span>Allergen Declaration</span>
                <ChevronDownIcon
                  className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                    openSections.allergens ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.allergens && (
                <div className="p-4 bg-white text-xs text-zinc-600 leading-relaxed border-t border-zinc-100">
                  {product.allergens}
                </div>
              )}
            </div>

            {/* Nutrition */}
            <div className="border border-zinc-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("nutrition")}
                className="w-full px-4 py-3 bg-zinc-50 hover:bg-zinc-100/70 text-left flex items-center justify-between text-xs font-semibold text-zinc-900 transition"
              >
                <span>Nutrition Facts (Per 100g)</span>
                <ChevronDownIcon
                  className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                    openSections.nutrition ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.nutrition && (
                <div className="p-4 bg-white text-xs border-t border-zinc-100">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
                    <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-200">
                      <p className="text-zinc-400 text-[10px] font-sans">Energy</p>
                      <p className="font-semibold text-zinc-950 mt-0.5">
                        {product.nutrition.calories}
                      </p>
                    </div>
                    <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-200">
                      <p className="text-zinc-400 text-[10px] font-sans">Protein</p>
                      <p className="font-semibold text-zinc-950 mt-0.5">
                        {product.nutrition.protein}
                      </p>
                    </div>
                    <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-200">
                      <p className="text-zinc-400 text-[10px] font-sans">Carbohydrates</p>
                      <p className="font-semibold text-zinc-950 mt-0.5">
                        {product.nutrition.carbs}
                      </p>
                    </div>
                    <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-200">
                      <p className="text-zinc-400 text-[10px] font-sans">Fat</p>
                      <p className="font-semibold text-zinc-950 mt-0.5">
                        {product.nutrition.fat}
                      </p>
                    </div>
                  </div>
                  {product.nutrition.fiber && (
                    <p className="text-[11px] font-mono text-zinc-500 mt-2 text-center">
                      Dietary Fiber: {product.nutrition.fiber}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Storage & Logistics */}
            <div className="border border-zinc-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("logistics")}
                className="w-full px-4 py-3 bg-zinc-50 hover:bg-zinc-100/70 text-left flex items-center justify-between text-xs font-semibold text-zinc-900 transition"
              >
                <span>Storage &amp; Logistics Guidelines</span>
                <ChevronDownIcon
                  className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                    openSections.logistics ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.logistics && (
                <div className="p-4 bg-white text-xs text-zinc-600 leading-relaxed border-t border-zinc-100">
                  {product.storage}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
