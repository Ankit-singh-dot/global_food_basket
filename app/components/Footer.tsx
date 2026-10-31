"use client";

import React from "react";
import Image from "next/image";

interface FooterProps {
  onOpenFlyersModal: () => void;
  onOpenOrderDrawer: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenFlyersModal,
  onOpenOrderDrawer,
}) => {
  return (
    <footer className="bg-zinc-950 text-zinc-400 pt-16 pb-12 border-t border-zinc-900 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-zinc-800">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div
              className="relative bg-white rounded-md p-1 overflow-hidden shrink-0 flex items-center"
              style={{ width: "176px", height: "42px" }}
            >
              <Image
                src="/brand/logo.png"
                alt="Global Food Basket"
                width={170}
                height={38}
                className="object-contain object-left p-1 w-auto h-9"
                style={{ maxHeight: "38px", maxWidth: "170px", objectFit: "contain" }}
              />
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Primary wholesale distributor and stockist of British and European ambient foods, gourmet butter cookies, filled pastries, and wellness snacks.
            </p>

            <div className="text-[11px] font-mono text-zinc-500 space-y-0.5">
              <p>Registered in England &amp; Wales • Company No. 08110681</p>
              <p>VAT Registration Number: GB 140 0397 50</p>
            </div>
          </div>

          {/* Warehouse & Depots */}
          <div className="lg:col-span-3 space-y-3">
            <p className="font-mono text-xs uppercase tracking-wider text-zinc-300">
              Distribution Depots
            </p>
            <div className="space-y-2 text-zinc-400">
              <div>
                <p className="font-medium text-zinc-200">UK Primary Depot:</p>
                <p>Unit 7A, Butterfield Business Park</p>
                <p>Great Marlings, Luton, LU2 8EU</p>
                <p className="text-zinc-500">United Kingdom</p>
              </div>
              <div className="pt-1 font-mono text-[11px]">
                <p className="text-zinc-300">Trade Enquiries:</p>
                <p>sales@globalfoodbasket.com</p>
                <p>+44 1923 606 206</p>
              </div>
            </div>
          </div>

          {/* Trade Services */}
          <div className="lg:col-span-3 space-y-3">
            <p className="font-mono text-xs uppercase tracking-wider text-zinc-300">
              Trade Services
            </p>
            <ul className="space-y-1.5 text-zinc-400">
              <li>
                <span className="hover:text-zinc-200 cursor-pointer transition">
                  Planogram &amp; Shelf Space Guidance
                </span>
              </li>
              <li>
                <span className="hover:text-zinc-200 cursor-pointer transition">
                  Category Velocity &amp; Demand Data
                </span>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenFlyersModal}
                  className="hover:text-zinc-200 transition text-left"
                >
                  Master Trade Releases (4 Sheets)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenOrderDrawer}
                  className="hover:text-zinc-200 transition text-left"
                >
                  Purchase Order Pad &amp; Pallet Estimator
                </button>
              </li>
              <li>
                <span className="hover:text-zinc-200 cursor-pointer transition">
                  Full Container &amp; Truckload Freight
                </span>
              </li>
            </ul>
          </div>

          {/* Compliance */}
          <div className="lg:col-span-2 space-y-3">
            <p className="font-mono text-xs uppercase tracking-wider text-zinc-300">
              Compliance
            </p>
            <ul className="space-y-1.5 text-zinc-400">
              <li>
                <span className="hover:text-zinc-200 cursor-pointer transition">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-zinc-200 cursor-pointer transition">
                  Terms of Wholesale Supply
                </span>
              </li>
              <li>
                <span className="hover:text-zinc-200 cursor-pointer transition">
                  Batch Traceability Records
                </span>
              </li>
              <li>
                <span className="hover:text-zinc-200 cursor-pointer transition">
                  Certificate of Analysis (COA)
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500 font-mono">
          <p>© 2026 Global Food Basket Ltd. All rights reserved.</p>
          <p>Ex-Warehouse Luton &amp; Pan-India Distribution</p>
        </div>
      </div>
    </footer>
  );
};
