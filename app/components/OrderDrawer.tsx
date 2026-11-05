"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PRODUCTS, Product } from "./data/products";
import {
  XIcon,
  PlusIcon,
  MinusIcon,
  DownloadIcon,
  CopyIcon,
  CheckIcon,
  BoxIcon,
} from "./icons";
import { money, type Currency } from "./format";
import { useDismiss } from "./useDismiss";

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: Record<string, number>;
  onUpdateQuantity: (productId: string, cases: number) => void;
  onClearOrder: () => void;
  currency: Currency;
}

export const OrderDrawer: React.FC<OrderDrawerProps> = ({
  isOpen,
  onClose,
  orderItems,
  onUpdateQuantity,
  onClearOrder,
  currency,
}) => {
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useDismiss(isOpen, onClose);

  if (!isOpen) return null;

  const activeEntries = Object.entries(orderItems).filter(([, qty]) => qty > 0);
  const itemsWithProduct = activeEntries
    .map(([id, qty]) => {
      const prod = PRODUCTS.find((p) => p.id === id);
      return prod ? { product: prod, qty } : null;
    })
    .filter((item): item is { product: Product; qty: number } => item !== null);

  const totalCases = itemsWithProduct.reduce((acc, item) => acc + item.qty, 0);
  const totalUnits = itemsWithProduct.reduce(
    (acc, item) => acc + item.qty * item.product.unitsPerCase,
    0
  );

  const rawSubtotal = itemsWithProduct.reduce((acc, item) => {
    const casePrice =
      currency === "INR"
        ? item.product.wholesaleInr * item.product.unitsPerCase
        : item.product.wholesaleGbp * item.product.unitsPerCase;
    return acc + casePrice * item.qty;
  }, 0);

  let discountRate = 0;
  if (totalCases >= 48) {
    discountRate = 0.12;
  } else if (totalCases >= 11) {
    discountRate = 0.05;
  }
  const discountAmount = rawSubtotal * discountRate;
  const finalTotal = rawSubtotal - discountAmount;

  const palletCapacity = 48;
  const palletProgress = Math.min(100, Math.round((totalCases / palletCapacity) * 100));

  const handleExportCSV = () => {
    const headers = [
      "SKU",
      "Product Name",
      "Brand",
      "Barcode",
      "Packing",
      "Units Per Case",
      "Ordered Cases",
      "Total Units",
      "Unit Price",
      "Case Rate",
      "Line Total",
    ];

    const rows = itemsWithProduct.map(({ product, qty }) => {
      const unitPrice =
        currency === "INR" ? product.wholesaleInr : product.wholesaleGbp;
      const casePrice = unitPrice * product.unitsPerCase;
      const lineTotal = casePrice * qty;
      return [
        `"${product.sku}"`,
        `"${product.name}"`,
        `"${product.brand}"`,
        `"${product.barcode}"`,
        `"${product.packing}"`,
        product.unitsPerCase,
        qty,
        qty * product.unitsPerCase,
        unitPrice,
        casePrice,
        lineTotal,
      ].join(",");
    });

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `GlobalFoodBasket_PO_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopySummary = () => {
    const text = [
      "=== GLOBAL FOOD BASKET • PURCHASE ORDER ===",
      `Date: ${new Date().toLocaleDateString()}`,
      `Cases: ${totalCases} | Units: ${totalUnits}`,
      "-------------------------------------------",
      ...itemsWithProduct.map(
        ({ product, qty }) =>
          `[${product.sku}] ${product.name} (${product.packing}) × ${qty} Cases (EAN: ${product.barcode})`
      ),
      "-------------------------------------------",
      `Estimated Subtotal: ${money(finalTotal, currency)}`,
    ].join("\n");

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-hidden bg-ink/40 backdrop-blur-sm flex justify-end"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Your order"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white h-full shadow-lift flex flex-col sm:rounded-l-[2rem] overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-ink">Your order</h3>
            <p className="tabular text-sm text-stone-500 mt-0.5">
              {totalCases} {totalCases === 1 ? "case" : "cases"} · {totalUnits.toLocaleString("en-IN")} units
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-line text-stone-500 hover:text-ink transition"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Pallet progress */}
        <div className="mx-6 mb-2 rounded-2xl bg-cream px-4 py-3.5">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-ink">Pallet filled</span>
            <span className="tabular text-stone-500">
              {totalCases} / {palletCapacity} cases
            </span>
          </div>
          <div className="w-full h-2 bg-white rounded-full overflow-hidden">
            <div
              className="h-full bg-leaf-500 rounded-full transition-all duration-300"
              style={{ width: `${palletProgress}%` }}
            />
          </div>
          <p className="text-sm mt-2">
            {totalCases >= palletCapacity ? (
              <span className="text-leaf-700 font-medium">✓ Full pallet: 12% off applied</span>
            ) : totalCases >= 11 ? (
              <span className="text-stone-600">
                <span className="text-leaf-700 font-medium">5% off applied.</span> Add{" "}
                <span className="tabular">{palletCapacity - totalCases}</span> more for 12% off.
              </span>
            ) : (
              <span className="text-stone-600">
                Add <span className="tabular">{Math.max(0, 11 - totalCases)}</span> more{" "}
                {11 - totalCases === 1 ? "case" : "cases"} to save 5%.
              </span>
            )}
          </p>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 divide-y divide-line">
          {itemsWithProduct.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-2">
              <span className="flex items-center justify-center w-14 h-14 rounded-full bg-cream text-stone-400">
                <BoxIcon className="w-6 h-6" />
              </span>
              <p className="font-semibold text-ink pt-2">Your order is empty</p>
              <p className="text-sm text-stone-500 max-w-xs">
                Add cases from the range to start building your order.
              </p>
            </div>
          ) : (
            itemsWithProduct.map(({ product, qty }) => {
              const casePrice =
                currency === "INR"
                  ? product.wholesaleInr * product.unitsPerCase
                  : product.wholesaleGbp * product.unitsPerCase;
              const lineTotal = casePrice * qty;

              return (
                <div key={product.id} className="py-4 flex gap-3 items-center">
                  <div className="relative w-16 h-16 rounded-2xl bg-cream shrink-0 overflow-hidden">
                    <Image
                      src={product.image}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-contain p-1.5 mix-blend-multiply"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink line-clamp-2 leading-snug">
                      {product.name}
                    </p>
                    <p className="tabular text-xs text-stone-500 mt-0.5">
                      {product.packing} · {money(casePrice, currency)} / case
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center rounded-full bg-cream border border-line">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, qty - 1)}
                          aria-label="Fewer cases"
                          className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-ink transition"
                        >
                          <MinusIcon className="w-3 h-3" />
                        </button>
                        <span className="tabular w-6 text-center text-sm font-semibold text-ink">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, qty + 1)}
                          aria-label="More cases"
                          className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-ink transition"
                        >
                          <PlusIcon className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="tabular text-sm font-semibold text-ink">
                        {money(lineTotal, currency)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Summary */}
        {itemsWithProduct.length > 0 && (
          <div className="p-6 bg-cream border-t border-line space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="tabular">{money(rawSubtotal, currency)}</span>
              </div>
              {discountRate > 0 && (
                <div className="flex items-center justify-between text-leaf-700 font-medium">
                  <span>Volume discount ({(discountRate * 100).toFixed(0)}%)</span>
                  <span className="tabular">−{money(discountAmount, currency)}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 text-ink">
                <span className="font-semibold">Estimated total</span>
                <span className="tabular text-2xl font-semibold">
                  {money(finalTotal, currency)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSubmitted(true);
                setTimeout(() => setSubmitted(false), 2600);
              }}
              className="w-full h-12 px-4 bg-leaf-600 hover:bg-leaf-700 text-white rounded-full font-semibold transition shadow-soft"
            >
              {submitted ? "✓ Order sent to our team" : "Place order"}
            </button>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 text-stone-600 hover:text-ink transition"
                >
                  <DownloadIcon className="w-4 h-4" />
                  Download CSV
                </button>
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1.5 text-stone-600 hover:text-ink transition"
                >
                  {copied ? (
                    <CheckIcon className="w-4 h-4 text-leaf-600" />
                  ) : (
                    <CopyIcon className="w-4 h-4" />
                  )}
                  {copied ? "Copied" : "Copy summary"}
                </button>
              </div>
              <button
                type="button"
                onClick={onClearOrder}
                className="text-stone-400 hover:text-red-600 transition"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
