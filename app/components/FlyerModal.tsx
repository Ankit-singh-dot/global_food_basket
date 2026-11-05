"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MASTER_TRADE_SHEETS, PRODUCTS, Product } from "./data/products";
import { XIcon, ArrowRightIcon } from "./icons";
import { useDismiss } from "./useDismiss";

interface FlyerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (p: Product) => void;
}

export const FlyerModal: React.FC<FlyerModalProps> = ({ isOpen, onClose, onSelectProduct }) => {
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);

  useDismiss(isOpen, onClose);

  if (!isOpen) return null;

  const currentSheet = MASTER_TRADE_SHEETS[activeSheetIndex];
  const associatedProducts = PRODUCTS.filter((p) =>
    p.sheetSource.toLowerCase().includes(currentSheet.category.toLowerCase().split(" ")[0])
  );
  const listed = associatedProducts.length ? associatedProducts : PRODUCTS.slice(0, 5);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-ink/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Price lists"
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-[2rem] max-w-6xl w-full max-h-[94vh] overflow-hidden shadow-lift flex flex-col"
      >
        <div className="px-6 sm:px-8 pt-6 pb-4 flex items-start justify-between gap-4">
          <div>
            <p className="font-script text-2xl text-leaf-600 leading-none">Price lists</p>
            <h3 className="text-2xl font-semibold text-ink mt-1">Our trade sheets</h3>
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

        <div className="no-scrollbar px-6 sm:px-8 pb-4 flex gap-2 overflow-x-auto border-b border-line">
          {MASTER_TRADE_SHEETS.map((sheet, idx) => (
            <button
              key={sheet.id}
              type="button"
              onClick={() => setActiveSheetIndex(idx)}
              aria-pressed={activeSheetIndex === idx}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition ${
                activeSheetIndex === idx
                  ? "bg-ink border-ink text-white"
                  : "bg-white border-line text-stone-600 hover:text-ink"
              }`}
            >
              {sheet.category}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 rounded-3xl bg-cream p-3">
            <div className="relative w-full max-h-[68vh] aspect-[3/4] overflow-hidden rounded-2xl bg-white">
              <Image
                src={currentSheet.sheetImage}
                alt={currentSheet.title}
                fill
                className="object-contain mix-blend-multiply"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-5">
            <div className="space-y-1.5">
              <h4 className="text-xl font-semibold text-ink leading-snug">{currentSheet.title}</h4>
              <p className="text-stone-600">{currentSheet.subtitle}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-ink">Products on this sheet</p>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {listed.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelectProduct(p);
                    }}
                    className="group w-full text-left p-2 pr-3 rounded-2xl border border-line hover:border-leaf-300 hover:bg-leaf-50/50 transition flex items-center gap-3"
                  >
                    <div className="relative w-12 h-12 rounded-xl bg-cream overflow-hidden shrink-0">
                      <Image src={p.image} alt="" fill sizes="48px" className="object-contain p-1 mix-blend-multiply" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink truncate">{p.name}</p>
                      <p className="text-xs text-stone-500">{p.packing}</p>
                    </div>
                    <ArrowRightIcon className="w-4 h-4 text-stone-300 group-hover:text-leaf-600 transition" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
