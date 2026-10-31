"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "./data/products";
import {
  BarcodeIcon,
  CopyIcon,
  CheckIcon,
  EyeIcon,
  PlusIcon,
  MinusIcon,
} from "./icons";

interface ProductCardProps {
  product: Product;
  currency: "INR" | "GBP";
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

  const casePrice =
    currency === "INR"
      ? product.wholesaleInr * product.unitsPerCase
      : Math.round(product.wholesaleGbp * product.unitsPerCase * 100) / 100;

  const unitMrp = currency === "INR" ? `₹${product.mrpInr}` : `£${product.mrpGbp.toFixed(2)}`;
  const unitWholesale =
    currency === "INR" ? `₹${product.wholesaleInr}` : `£${product.wholesaleGbp.toFixed(2)}`;
  const displayCasePrice =
    currency === "INR" ? `₹${casePrice.toLocaleString()}` : `£${casePrice.toFixed(2)}`;

  const marginPercent = Math.round(
    ((product.mrpInr - product.wholesaleInr) / product.mrpInr) * 100
  );

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group relative bg-white rounded-xl border border-zinc-200/80 overflow-hidden hover:border-zinc-300 hover:shadow-xs transition duration-200 flex flex-col cursor-pointer"
    >
      {/* Top Meta Bar */}
      <div className="p-3 pb-2 flex items-center justify-between text-[11px] text-zinc-500">
        <span className="font-mono uppercase tracking-wider text-[10px] text-zinc-400">
          {product.brand}
        </span>
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className="text-zinc-600 font-medium">
            {product.inStockCases} cases
          </span>
          <span className="text-zinc-300">•</span>
          <span className="text-zinc-400">{product.sku}</span>
        </div>
      </div>

      {/* Product Image Frame */}
      <div className="relative aspect-square w-full bg-zinc-50/50 border-y border-zinc-100 flex items-center justify-center p-6 overflow-hidden">
        <div className="relative w-full h-full group-hover:scale-102 transition duration-300">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        {/* Specs quick button on hover */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectProduct(product);
          }}
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 bg-white/95 text-zinc-800 text-[11px] font-medium px-2.5 py-1 rounded-md shadow-2xs border border-zinc-200"
        >
          <EyeIcon className="w-3.5 h-3.5 text-zinc-500" />
          <span>Technical Specs</span>
        </button>
      </div>

      {/* Info Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span className="font-mono text-[11px] text-zinc-700 font-medium bg-zinc-100 px-1.5 py-0.2 rounded">
              {product.packing}
            </span>
            <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded">
              +{marginPercent}% Margin
            </span>
          </div>

          <h3 className="text-sm font-medium text-zinc-950 group-hover:text-zinc-700 transition line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Barcode line */}
          <div className="flex items-center justify-between pt-1">
            <span className="font-mono text-[11px] text-zinc-400">
              EAN {product.barcode}
            </span>
            <button
              type="button"
              onClick={copyBarcode}
              title="Copy Barcode"
              className="text-zinc-400 hover:text-zinc-800 p-0.5 rounded transition"
            >
              {copied ? (
                <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <CopyIcon className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Pricing & Case Adder */}
        <div className="pt-3 border-t border-zinc-100 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                Case ({product.unitsPerCase} units)
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-semibold text-zinc-950 font-mono">
                  {displayCasePrice}
                </span>
                <span className="text-xs text-zinc-500 font-normal">
                  ({unitWholesale}/ea)
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 line-through">
              MRP {unitMrp}
            </p>
          </div>

          {/* Action Row */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 pt-1"
          >
            <div className="flex items-center border border-zinc-200 rounded-md bg-zinc-50">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:bg-zinc-200/60 rounded-l-md transition"
              >
                <MinusIcon className="w-3 h-3" />
              </button>
              <span className="w-7 text-center font-mono text-xs font-medium text-zinc-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:bg-zinc-200/60 rounded-r-md transition"
              >
                <PlusIcon className="w-3 h-3" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => onAddCases(product, quantity)}
              className="flex-1 py-1.5 px-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-md text-xs font-medium transition"
            >
              Add {quantity} {quantity === 1 ? "Case" : "Cases"}
            </button>
          </div>

          {orderQuantity > 0 && (
            <p className="text-[11px] font-mono text-zinc-500 text-center">
              ✓ {orderQuantity} cases added to PO
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
