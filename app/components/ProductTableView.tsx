"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "./data/products";
import {
  CopyIcon,
  CheckIcon,
  EyeIcon,
  BoxIcon,
} from "./icons";

interface ProductTableViewProps {
  products: Product[];
  currency: "INR" | "GBP";
  onSelectProduct: (p: Product) => void;
  onAddCases: (product: Product, cases: number) => void;
  orderItems: Record<string, number>;
}

export const ProductTableView: React.FC<ProductTableViewProps> = ({
  products,
  currency,
  onSelectProduct,
  onAddCases,
  orderItems,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyBarcode = (barcode: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(barcode);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200/80 overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-50/70 border-b border-zinc-200/80 text-zinc-400 font-mono uppercase text-[10px] tracking-wider">
              <th className="py-2.5 px-3 pl-4">Item &amp; Description</th>
              <th className="py-2.5 px-3">SKU</th>
              <th className="py-2.5 px-3">Packing</th>
              <th className="py-2.5 px-3">EAN Barcode</th>
              <th className="py-2.5 px-3">Stock</th>
              <th className="py-2.5 px-3">Case Rate</th>
              <th className="py-2.5 px-3">Unit MRP</th>
              <th className="py-2.5 px-3">Margin</th>
              <th className="py-2.5 px-3 pr-4 text-right">Order Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {products.map((product) => {
              const casePrice =
                currency === "INR"
                  ? product.wholesaleInr * product.unitsPerCase
                  : Math.round(product.wholesaleGbp * product.unitsPerCase * 100) / 100;
              const displayCasePrice =
                currency === "INR"
                  ? `₹${casePrice.toLocaleString()}`
                  : `£${casePrice.toFixed(2)}`;
              const displayUnitWholesale =
                currency === "INR"
                  ? `₹${product.wholesaleInr}`
                  : `£${product.wholesaleGbp.toFixed(2)}`;
              const displayUnitMrp =
                currency === "INR"
                  ? `₹${product.mrpInr}`
                  : `£${product.mrpGbp.toFixed(2)}`;
              const margin = Math.round(
                ((product.mrpInr - product.wholesaleInr) / product.mrpInr) * 100
              );
              const inOrder = orderItems[product.id] || 0;

              return (
                <tr
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="hover:bg-zinc-50/60 transition cursor-pointer group"
                >
                  {/* Image & Title */}
                  <td className="py-2.5 px-3 pl-4">
                    <div className="flex items-center gap-3 max-w-sm">
                      <div className="relative w-10 h-10 rounded-md bg-zinc-50 border border-zinc-200/70 p-1 shrink-0 overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain p-0.5"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900 group-hover:text-zinc-600 transition line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-[11px] text-zinc-400 font-mono">
                          {product.brand} • {product.category}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-600">
                    {product.sku}
                  </td>

                  {/* Packing */}
                  <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-700">
                    {product.packing}
                  </td>

                  {/* Barcode */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1 font-mono text-[11px] text-zinc-500">
                      <span>{product.barcode}</span>
                      <button
                        type="button"
                        onClick={(e) =>
                          handleCopyBarcode(product.barcode, product.id, e)
                        }
                        className="text-zinc-400 hover:text-zinc-800 p-0.5 rounded"
                        title="Copy Barcode"
                      >
                        {copiedId === product.id ? (
                          <CheckIcon className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <CopyIcon className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Stock */}
                  <td className="py-2.5 px-3 font-mono text-zinc-800">
                    {product.inStockCases} cs
                  </td>

                  {/* Case Price */}
                  <td className="py-2.5 px-3 font-mono">
                    <span className="font-semibold text-zinc-950 block">
                      {displayCasePrice}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {displayUnitWholesale}/ea
                    </span>
                  </td>

                  {/* Unit MRP */}
                  <td className="py-2.5 px-3 font-mono text-zinc-500">
                    {displayUnitMrp}
                  </td>

                  {/* Margin */}
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      +{margin}%
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 px-3 pr-4 text-right">
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 justify-end"
                    >
                      <button
                        type="button"
                        onClick={() => onSelectProduct(product)}
                        className="p-1 text-zinc-400 hover:text-zinc-800 transition"
                        title="View Technical Specs"
                      >
                        <EyeIcon className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onAddCases(product, 1)}
                        className="px-2.5 py-1 bg-zinc-950 hover:bg-zinc-800 text-white rounded-md text-xs font-medium transition"
                      >
                        +1 Case
                      </button>

                      {inOrder > 0 && (
                        <span className="font-mono text-[10px] text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                          {inOrder} in PO
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
