"use client";

import React from "react";
import { TruckIcon, ShieldCheckIcon, LayersIcon, GlobeIcon } from "./icons";

const features = [
  {
    icon: TruckIcon,
    title: "Pallets & containers",
    text: "Mix products on a single pallet, or ship full 20ft and 40ft containers with export paperwork handled.",
  },
  {
    icon: LayersIcon,
    title: "Shelf & display advice",
    text: "We help you choose the right mix and lay out your shelves so stock keeps moving.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Fresh, traceable stock",
    text: "Every carton is barcoded and batch-tracked, with at least 12–18 months of shelf life.",
  },
  {
    icon: GlobeIcon,
    title: "Sourcing on request",
    text: "Looking for something we don't list? Our team can source European lines, seasonal tins and more.",
  },
];

export const WholesaleInfo: React.FC = () => {
  return (
    <section className="bg-cream py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-36">
            <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-stone-500">
              <span className="h-px w-8 bg-stone-300" />
              About us
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink leading-tight">
              Good food,{" "}
              <span className="font-script font-bold text-leaf-600 text-4xl sm:text-5xl">
                no borders
              </span>
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              We&rsquo;re a wholesaler and direct importer based in Luton, supplying
              British and European biscuits, cookies and treats for over 15 years.
            </p>
            <p className="text-stone-500 leading-relaxed">
              Close relationships with our bakeries mean dependable stock at factory prices,
              whether you need a single pallet or a full container.
            </p>

            <div className="flex gap-8 pt-2">
              <div>
                <p className="tabular text-3xl font-semibold text-ink">15+</p>
                <p className="text-sm text-stone-500">years in trade</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-ink">UK &amp; India</p>
                <p className="text-sm text-stone-500">delivery coverage</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-3xl bg-white border border-line p-6 sm:p-7 space-y-4 transition hover:shadow-soft"
              >
                <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-leaf-50 text-leaf-600">
                  <Icon className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-semibold text-ink">{title}</h3>
                <p className="text-stone-600 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
