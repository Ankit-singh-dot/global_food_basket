"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MASTER_TRADE_SHEETS, PRODUCTS, Product } from "./data/products";
import { XIcon, FileTextIcon, EyeIcon } from "./icons";

interface FlyerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (p: Product) => void;
}

export const FlyerModal: React.FC<FlyerModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);

  if (!isOpen) return null;

  const currentSheet = MASTER_TRADE_SHEETS[activeSheetIndex];
  const associatedProducts = PRODUCTS.filter((p) =>
    p.sheetSource.toLowerCase().includes(currentSheet.category.toLowerCase().split(" ")[0])
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl max-w-5xl w-full max-h-[94vh] overflow-hidden shadow-2xl border border-zinc-200/90 flex flex-col"
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-white border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileTextIcon className="w-4 h-4 text-zinc-500" />
            <h3 className="font-semibold text-sm text-zinc-950">
              Primary Manufacturer Trade Releases
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-950 p-1 rounded-md transition"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-zinc-50 border-b border-zinc-200 px-4 py-2 flex items-center gap-1.5 overflow-x-auto">
          {MASTER_TRADE_SHEETS.map((sheet, idx) => (
            <button
              key={sheet.id}
              type="button"
              onClick={() => setActiveSheetIndex(idx)}
              className={`px-3 py-1 rounded-md text-xs font-medium shrink-0 transition flex items-center gap-1.5 ${
                activeSheetIndex === idx
                  ? "bg-white text-zinc-950 shadow-2xs border border-zinc-200 font-semibold"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              <span>Release {idx + 1}</span>
              <span className="font-mono text-[10px] text-zinc-400">
                ({sheet.productCount})
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sheet Preview */}
          <div className="lg:col-span-8 bg-zinc-50 rounded-xl p-2 border border-zinc-200/80 flex flex-col items-center">
            <div className="relative w-full max-h-[68vh] aspect-3/4 overflow-hidden rounded-lg bg-white flex items-center justify-center">
              <Image
                src={currentSheet.sheetImage}
                alt={currentSheet.title}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
            </div>
            <p className="font-mono text-[11px] text-zinc-400 mt-2 text-center truncate max-w-full">
              {currentSheet.sheetImage}
            </p>
          </div>

          {/* Right Product List */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                {currentSheet.category}
              </span>
              <h4 className="text-base font-semibold text-zinc-950 mt-1.5">
                {currentSheet.title}
              </h4>
              <p className="text-xs text-zinc-500 mt-0.5">
                {currentSheet.subtitle}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-zinc-100">
              <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                Included Products:
              </p>
              <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
                {(associatedProducts.length ? associatedProducts : PRODUCTS.slice(0, 5)).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onClose();
                      onSelectProduct(p);
                    }}
                    className="p-2 rounded-lg border border-zinc-200/80 hover:border-zinc-300 hover:bg-zinc-50 transition cursor-pointer flex items-center gap-2.5"
                  >
                    <div className="relative w-9 h-9 rounded bg-white border border-zinc-200/60 overflow-hidden shrink-0">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-contain p-0.5"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-zinc-900 truncate">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-zinc-400 font-mono">
                        {p.packing} • {p.sku}
                      </p>
                    </div>
                    <EyeIcon className="w-3.5 h-3.5 text-zinc-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
