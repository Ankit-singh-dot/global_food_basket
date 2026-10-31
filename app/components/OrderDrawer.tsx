"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PRODUCTS, Product } from "./data/products";
import {
  XIcon,
  ShoppingBagIcon,
  PlusIcon,
  MinusIcon,
  DownloadIcon,
  CopyIcon,
  CheckIcon,
  BoxIcon,
} from "./icons";

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: Record<string, number>;
  onUpdateQuantity: (productId: string, cases: number) => void;
  onClearOrder: () => void;
  currency: "INR" | "GBP";
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

  if (!isOpen) return null;

  const activeEntries = Object.entries(orderItems).filter(([_, qty]) => qty > 0);
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
      `Estimated Subtotal: ${
        currency === "INR" ? `₹${finalTotal.toLocaleString()}` : `£${finalTotal.toFixed(2)}`
      }`,
    ].join("\n");

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-zinc-200"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-zinc-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-950">
              Wholesale Purchase Order
            </h3>
            <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
              {totalCases} Cases • {totalUnits} Units
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-950 p-1 rounded-md transition"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Pallet Gauge */}
        <div className="bg-zinc-50 px-5 py-3 border-b border-zinc-200/80 text-xs">
          <div className="flex items-center justify-between font-mono text-[11px] text-zinc-700 mb-1.5">
            <span>Pallet Utilization</span>
            <span>{totalCases} / {palletCapacity} Cases ({palletProgress}%)</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-950 rounded-full transition-all duration-300"
              style={{ width: `${palletProgress}%` }}
            />
          </div>
          <p className="text-[11px] text-zinc-500 mt-1.5 flex items-center justify-between">
            <span>Standard: 48 cases</span>
            {totalCases < 48 ? (
              <span className="text-zinc-600 font-mono">
                {48 - totalCases} cases to 12% pallet tier
              </span>
            ) : (
              <span className="text-emerald-700 font-medium">
                ✓ 12% Pallet Discount Applied
              </span>
            )}
          </p>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-zinc-100">
          {itemsWithProduct.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-zinc-400 space-y-2">
              <BoxIcon className="w-6 h-6 text-zinc-300" />
              <p className="font-medium text-zinc-700 text-xs">
                Your purchase order is empty
              </p>
              <p className="text-[11px] text-zinc-400 max-w-xs">
                Add cases from the product catalog to assemble a trade consignment.
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
                <div key={product.id} className="py-3.5 first:pt-0 flex gap-3 items-center">
                  <div className="relative w-12 h-12 rounded-md bg-zinc-50 border border-zinc-200 p-1 shrink-0 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-0.5"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-950 truncate">
                      {product.name}
                    </p>
                    <p className="text-[11px] font-mono text-zinc-400">
                      {product.packing} • {product.sku}
                    </p>
                    <p className="text-[11px] font-mono font-medium text-zinc-700 mt-0.5">
                      {currency === "INR"
                        ? `₹${casePrice.toLocaleString()}`
                        : `£${casePrice.toFixed(2)}`}
                      <span className="text-zinc-400 font-normal"> / case</span>
                    </p>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-zinc-200 rounded-md bg-zinc-50">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(product.id, qty - 1)}
                        className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:bg-zinc-200 transition"
                      >
                        <MinusIcon className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-mono text-xs font-medium text-zinc-900">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(product.id, qty + 1)}
                        className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:bg-zinc-200 transition"
                      >
                        <PlusIcon className="w-3 h-3" />
                      </button>
                    </div>

                    <p className="w-16 text-right text-xs font-semibold text-zinc-950 font-mono">
                      {currency === "INR"
                        ? `₹${lineTotal.toLocaleString()}`
                        : `£${lineTotal.toFixed(2)}`}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {itemsWithProduct.length > 0 && (
          <div className="p-4 sm:p-5 bg-zinc-50 border-t border-zinc-200 space-y-3 font-mono text-xs">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-zinc-500 font-sans">
                <span>Subtotal ({totalCases} cases)</span>
                <span className="font-mono text-zinc-900">
                  {currency === "INR"
                    ? `₹${rawSubtotal.toLocaleString()}`
                    : `£${rawSubtotal.toFixed(2)}`}
                </span>
              </div>

              {discountRate > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-sans">
                  <span>Volume Discount ({(discountRate * 100).toFixed(0)}%)</span>
                  <span className="font-mono">
                    -{currency === "INR"
                      ? `₹${Math.round(discountAmount).toLocaleString()}`
                      : `£${discountAmount.toFixed(2)}`}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-zinc-950 font-semibold text-sm pt-2 border-t border-zinc-200 font-sans">
                <span>Estimated Total</span>
                <span className="font-mono text-base">
                  {currency === "INR"
                    ? `₹${Math.round(finalTotal).toLocaleString()}`
                    : `£${finalTotal.toFixed(2)}`}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 font-sans">
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-medium rounded-md border border-zinc-200 transition"
              >
                <DownloadIcon className="w-3.5 h-3.5 text-zinc-500" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-medium rounded-md border border-zinc-200 transition"
              >
                {copied ? (
                  <>
                    <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Copy Summary</span>
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setSubmitted(true);
                setTimeout(() => setSubmitted(false), 2600);
              }}
              className="w-full py-2 px-4 bg-zinc-950 hover:bg-zinc-800 text-white rounded-md font-medium text-xs sm:text-sm transition font-sans"
            >
              {submitted ? "✓ Order Submitted to Despatch Team" : "Submit Wholesale Order"}
            </button>

            <button
              type="button"
              onClick={onClearOrder}
              className="w-full text-center text-[11px] text-zinc-400 hover:text-zinc-600 font-sans"
            >
              Clear Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
