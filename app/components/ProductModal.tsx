"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "./data/products";
import { XIcon, CopyIcon, CheckIcon, ChevronDownIcon, PlusIcon, MinusIcon } from "./icons";
import { money, marginPercent, type Currency } from "./format";
import { useDismiss } from "./useDismiss";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  currency: Currency;
  onAddCases: (product: Product, cases: number) => void;
  orderQuantity: number;
}

const Accordion: React.FC<{
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, open, onToggle, children }) => (
  <div className="border-b border-line last:border-b-0">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="w-full py-4 text-left flex items-center justify-between text-base font-semibold text-ink"
    >
      {title}
      <ChevronDownIcon
        className={`w-5 h-5 text-stone-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      />
    </button>
    {open && <div className="pb-5 text-stone-600 leading-relaxed">{children}</div>}
  </div>
);

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
    allergens: false,
    nutrition: false,
    logistics: false,
  });

  useDismiss(!!product, onClose);

  if (!product) return null;

  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleCopyBarcode = () => {
    navigator.clipboard.writeText(product.barcode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const casePrice =
    currency === "INR"
      ? product.wholesaleInr * product.unitsPerCase
      : Math.round(product.wholesaleGbp * product.unitsPerCase * 100) / 100;
  const unitPrice = currency === "INR" ? product.wholesaleInr : product.wholesaleGbp;
  const unitMrp = currency === "INR" ? product.mrpInr : product.mrpGbp;

  const details: [string, React.ReactNode][] = [
    ["Pack size", `${product.packing} · ${product.unitsPerCase} per case`],
    ["Product code", product.sku],
    [
      "Barcode (EAN)",
      <button
        key="ean"
        type="button"
        onClick={handleCopyBarcode}
        className="tabular inline-flex items-center gap-1.5 hover:text-leaf-700 transition"
      >
        {product.barcode}
        {copied ? (
          <CheckIcon className="w-4 h-4 text-leaf-600" />
        ) : (
          <CopyIcon className="w-4 h-4 text-stone-400" />
        )}
      </button>,
    ],
    ["Pallet", "48 cases per UK Euro pallet"],
    ["In stock", `${product.inStockCases} cases ready to ship`],
  ];

  const nutrition: [string, string][] = [
    ["Energy", product.nutrition.calories],
    ["Protein", product.nutrition.protein],
    ["Carbs", product.nutrition.carbs],
    ["Fat", product.nutrition.fat],
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-ink/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-[2rem] max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-lift flex flex-col"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 border border-line text-stone-500 hover:text-ink transition"
        >
          <XIcon className="w-4 h-4" />
        </button>

        <div className="overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image */}
            <div className="bg-cream p-8 sm:p-10 flex items-center justify-center">
              <div className="relative aspect-square w-full max-w-md">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain mix-blend-multiply"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              </div>
            </div>

            {/* Info */}
            <div className="p-6 sm:p-10 space-y-6">
              <div className="space-y-2 pr-10">
                <p className="text-sm font-medium text-leaf-700">
                  {product.brand} · {product.category}
                </p>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink leading-tight">
                  {product.name}
                </h2>
                <p className="text-stone-600 leading-relaxed">{product.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {product.dietary.map((d) => (
                    <span
                      key={d}
                      className="text-xs font-medium bg-leaf-50 text-leaf-800 px-2.5 py-1 rounded-full"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="rounded-3xl bg-cream p-5 space-y-4">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="tabular text-3xl font-semibold text-ink leading-none">
                      {money(casePrice, currency)}
                      <span className="text-base font-normal text-stone-500"> / case</span>
                    </p>
                    <p className="tabular text-sm text-stone-500 mt-2">
                      {money(unitPrice, currency)} each · MRP {money(unitMrp, currency)}
                    </p>
                  </div>
                  <span className="tabular shrink-0 rounded-full bg-leaf-600 text-white text-sm font-semibold px-3 py-1.5">
                    {marginPercent(product.mrpInr, product.wholesaleInr)}% margin
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    ["1–10 cases", "Standard price"],
                    ["11–47 cases", "Save 5%"],
                    ["48+ (pallet)", "Save 12%"],
                  ].map(([qty, deal], i) => (
                    <div key={qty} className="rounded-2xl bg-white px-2 py-2.5">
                      <p className="text-sm font-semibold text-ink">{qty}</p>
                      <p className={`text-xs ${i === 0 ? "text-stone-500" : "text-leaf-700 font-medium"}`}>
                        {deal}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-full bg-white border border-line">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Fewer cases"
                      className="w-11 h-11 flex items-center justify-center text-stone-600 hover:text-ink transition"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    <span className="tabular w-8 text-center font-semibold text-ink">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="More cases"
                      className="w-11 h-11 flex items-center justify-center text-stone-600 hover:text-ink transition"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onAddCases(product, quantity)}
                    className="tabular flex-1 h-12 px-5 bg-ink hover:bg-leaf-700 text-white rounded-full font-semibold transition"
                  >
                    Add {quantity} {quantity === 1 ? "case" : "cases"} ·{" "}
                    {money(casePrice * quantity, currency)}
                  </button>
                </div>

                {orderQuantity > 0 && (
                  <p className="text-sm text-leaf-700 font-medium text-center">
                    ✓ {orderQuantity} {orderQuantity === 1 ? "case" : "cases"} already in your order
                  </p>
                )}
              </div>

              {/* Details */}
              <dl className="divide-y divide-line text-sm">
                {details.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 py-2.5">
                    <dt className="text-stone-500">{label}</dt>
                    <dd className="text-ink font-medium text-right">{value}</dd>
                  </div>
                ))}
              </dl>

              <div>
                <Accordion
                  title="Ingredients"
                  open={openSections.ingredients}
                  onToggle={() => toggleSection("ingredients")}
                >
                  {product.ingredients}
                </Accordion>
                <Accordion
                  title="Allergens"
                  open={openSections.allergens}
                  onToggle={() => toggleSection("allergens")}
                >
                  {product.allergens}
                </Accordion>
                <Accordion
                  title="Nutrition (per 100g)"
                  open={openSections.nutrition}
                  onToggle={() => toggleSection("nutrition")}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {nutrition.map(([label, value]) => (
                      <div key={label} className="rounded-2xl bg-cream px-3 py-3 text-center">
                        <p className="text-xs text-stone-500">{label}</p>
                        <p className="tabular font-semibold text-ink mt-0.5">{value}</p>
                      </div>
                    ))}
                  </div>
                  {product.nutrition.fiber && (
                    <p className="text-sm text-stone-500 mt-3">
                      Fibre: {product.nutrition.fiber}
                    </p>
                  )}
                </Accordion>
                <Accordion
                  title="Storage & shipping"
                  open={openSections.logistics}
                  onToggle={() => toggleSection("logistics")}
                >
                  {product.storage}
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
