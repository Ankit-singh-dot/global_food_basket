"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "./data/products";
import { CopyIcon, CheckIcon, PlusIcon } from "./icons";
import { money, marginPercent, type Currency } from "./format";

interface ProductTableViewProps {
  products: Product[];
  currency: Currency;
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
    <div className="bg-white rounded-3xl border border-line overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-cream text-stone-500 text-xs font-medium">
              <th className="py-3 px-4 pl-5 font-medium">Product</th>
              <th className="py-3 px-4 font-medium">Pack</th>
              <th className="py-3 px-4 font-medium">Barcode</th>
              <th className="py-3 px-4 font-medium text-right">In stock</th>
              <th className="py-3 px-4 font-medium text-right">Case price</th>
              <th className="py-3 px-4 font-medium text-right">MRP</th>
              <th className="py-3 px-4 font-medium text-right">Margin</th>
              <th className="py-3 px-4 pr-5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.map((product) => {
              const casePrice =
                currency === "INR"
                  ? product.wholesaleInr * product.unitsPerCase
                  : Math.round(product.wholesaleGbp * product.unitsPerCase * 100) / 100;
              const unitPrice = currency === "INR" ? product.wholesaleInr : product.wholesaleGbp;
              const unitMrp = currency === "INR" ? product.mrpInr : product.mrpGbp;
              const inOrder = orderItems[product.id] || 0;

              return (
                <tr
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="hover:bg-cream/60 transition cursor-pointer group"
                >
                  <td className="py-3 px-4 pl-5">
                    <div className="flex items-center gap-3 min-w-64">
                      <div className="relative w-12 h-12 rounded-xl bg-cream shrink-0 overflow-hidden">
                        <Image
                          src={product.image}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-contain p-1 mix-blend-multiply"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-ink group-hover:text-leaf-700 transition line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-xs text-stone-500">
                          {product.brand} · {product.sku}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-stone-600 whitespace-nowrap">{product.packing}</td>

                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={(e) => handleCopyBarcode(product.barcode, product.id, e)}
                      title="Copy barcode"
                      className="tabular inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-ink transition"
                    >
                      {product.barcode}
                      {copiedId === product.id ? (
                        <CheckIcon className="w-3.5 h-3.5 text-leaf-600" />
                      ) : (
                        <CopyIcon className="w-3.5 h-3.5 text-stone-400" />
                      )}
                    </button>
                  </td>

                  <td className="tabular py-3 px-4 text-right text-stone-700 whitespace-nowrap">
                    {product.inStockCases} cases
                  </td>

                  <td className="tabular py-3 px-4 text-right whitespace-nowrap">
                    <span className="font-semibold text-ink block">{money(casePrice, currency)}</span>
                    <span className="text-xs text-stone-400">{money(unitPrice, currency)} each</span>
                  </td>

                  <td className="tabular py-3 px-4 text-right text-stone-500">
                    {money(unitMrp, currency)}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <span className="tabular inline-block rounded-full bg-leaf-50 text-leaf-700 text-xs font-semibold px-2.5 py-1">
                      {marginPercent(product.mrpInr, product.wholesaleInr)}%
                    </span>
                  </td>

                  <td className="py-3 px-4 pr-5 text-right">
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 justify-end"
                    >
                      {inOrder > 0 && (
                        <span className="tabular text-xs font-medium text-leaf-700 whitespace-nowrap">
                          {inOrder} in order
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => onAddCases(product, 1)}
                        className="inline-flex items-center gap-1 px-3.5 py-2 bg-ink hover:bg-leaf-700 text-white rounded-full text-xs font-semibold transition whitespace-nowrap"
                      >
                        <PlusIcon className="w-3 h-3" />
                        Add case
                      </button>
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
