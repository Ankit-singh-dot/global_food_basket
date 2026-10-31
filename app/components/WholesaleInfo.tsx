"use client";

import React from "react";
import { TruckIcon, ShieldCheckIcon, LayersIcon, BoxIcon } from "./icons";

export const WholesaleInfo: React.FC = () => {
  return (
    <section className="bg-white border-y border-zinc-200/80 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Narrative */}
        <div className="max-w-2xl space-y-3">
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-400">
            About Global Food Basket
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-950 tracking-tight">
            Wholesaler of British Foods, Biscuits &amp; Confectionery.
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            We are primary wholesalers and direct importers of fast-moving British and European ambient foods, based in Luton, Bedfordshire. With over 15 years of continuous presence in the UK and international wholesale markets, our close supplier ties ensure dependable stock access at direct ex-factory rates.
          </p>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Consignments are fulfilled from single pallet allocations up to full container loads (dry ambient and temperature-controlled). Non-catalog lines can be requested directly via our sourcing desk.
          </p>
        </div>

        {/* 4 Feature Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-zinc-100">
          <div className="space-y-2">
            <p className="font-mono text-xs text-zinc-400">01</p>
            <h3 className="font-medium text-sm text-zinc-950">
              Pallet &amp; Container Despatch
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Consolidated mixed SKU pallets or full 20ft/40ft container consignments with export certification.
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-mono text-xs text-zinc-400">02</p>
            <h3 className="font-medium text-sm text-zinc-950">
              Planogram &amp; Shelf Layout
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Retail merchandising guidance, category velocity insights, and optimal assortment pairing for grocery stores.
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-mono text-xs text-zinc-400">03</p>
            <h3 className="font-medium text-sm text-zinc-950">
              Factory Batch Traceability
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Each master shipper carton is serialized and barcoded with verified minimum 12 to 18 months remaining shelf life.
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-mono text-xs text-zinc-400">04</p>
            <h3 className="font-medium text-sm text-zinc-950">
              Trade Procurement Desk
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Sourcing assistance for unlisted European FMCG items, seasonal tins, and bespoke confectionery lots.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
