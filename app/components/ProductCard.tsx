"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "./data/products";
import { CopyIcon, CheckIcon, PlusIcon, MinusIcon } from "./icons";
import { money, marginPercent, type Currency } from "./format";

interface ProductCardProps {
  product: Product;
  currency: Currency;
  onSelectProduct: (p: Product) => void;
  onAddCases: (product: Product, cases: number) => void;
  orderQuantity: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onSelectProduct,
  onAddCases,
  orderQuantity,
}) => {
  const [copied, setCopied] = useState(false);
  const [quantity, setQuantity] = useState(product.moqCases || 1);

  const copyBarcode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(product.barcode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const unitPrice = currency === "INR" ? product.wholesaleInr : product.wholesaleGbp;
  const unitMrp = currency === "INR" ? product.mrpInr : product.mrpGbp;
  const casePrice =
    currency === "INR"
      ? product.wholesaleInr * product.unitsPerCase
      : Math.round(product.wholesaleGbp * product.unitsPerCase * 100) / 100;
  const margin = marginPercent(product.mrpInr, product.wholesaleInr);

  return (
    <article
      onClick={() => onSelectProduct(product)}
      className="group relative bg-white rounded-3xl border border-line p-3 flex flex-col cursor-pointer transition duration-200 hover:-translate-y-0.5 hover:shadow-lift hover:border-transparent"
    >
      {/* Image */}
      <div className="relative aspect-square w-full rounded-2xl bg-cream overflow-hidden">
        <div className="absolute inset-6 transition duration-300 group-hover:scale-105">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain mix-blend-multiply"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        </div>

        <span className="absolute top-3 left-3 rounded-full bg-leaf-600 text-white text-xs font-semibold px-2.5 py-1">
          {margin}% margin
        </span>
        {product.fastMoving && (
          <span className="absolute top-3 right-3 rounded-full bg-white/95 text-ink text-xs font-medium px-2.5 py-1 shadow-soft">
            Best seller
          </span>
        )}

        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink/85 text-white text-xs font-medium px-3 py-1.5 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition">
          View details
        </span>
      </div>

      {/* Body */}
      <div className="px-2 pt-4 pb-1 flex-1 flex flex-col gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-leaf-700">{product.brand}</p>
          <h3 className="text-base font-semibold text-ink leading-snug line-clamp-2">
            {product.name}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-stone-500">
            <span>{product.packing}</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-leaf-500" />
              <span className="tabular">{product.inStockCases}</span> cases in stock
            </span>
          </div>
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="tabular text-2xl font-semibold text-ink leading-none">
                {money(casePrice, currency)}
                <span className="text-sm font-normal text-stone-500"> / case</span>
              </p>
              <p className="tabular text-sm text-stone-500 mt-1.5">
                {product.unitsPerCase} × {money(unitPrice, currency)}
                <span className="text-stone-400"> · MRP {money(unitMrp, currency)}</span>
              </p>
            </div>
          </div>

          <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2">
            <div className="flex items-center rounded-full bg-cream border border-line">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Fewer cases"
                className="w-9 h-9 flex items-center justify-center text-stone-600 hover:text-ink rounded-full transition"
              >
                <MinusIcon className="w-3.5 h-3.5" />
              </button>
              <span className="tabular w-6 text-center text-sm font-semibold text-ink">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="More cases"
                className="w-9 h-9 flex items-center justify-center text-stone-600 hover:text-ink rounded-full transition"
              >
                <PlusIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => onAddCases(product, quantity)}
              className="flex-1 h-10 px-4 bg-ink hover:bg-leaf-700 text-white rounded-full text-sm font-semibold transition"
            >
              Add {quantity} {quantity === 1 ? "case" : "cases"}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-400 min-h-5">
            <button
              type="button"
              onClick={copyBarcode}
              title="Copy barcode"
              className="tabular inline-flex items-center gap-1.5 hover:text-ink transition"
            >
              {copied ? (
                <CheckIcon className="w-3.5 h-3.5 text-leaf-600" />
              ) : (
                <CopyIcon className="w-3.5 h-3.5" />
              )}
              {copied ? "Copied" : `EAN ${product.barcode}`}
            </button>
            {orderQuantity > 0 && (
              <span className="inline-flex items-center gap-1 font-medium text-leaf-700">
                <CheckIcon className="w-3.5 h-3.5" />
                {orderQuantity} in order
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
