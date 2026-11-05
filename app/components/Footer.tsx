"use client";

import React from "react";
import Image from "next/image";

interface FooterProps {
  onOpenFlyersModal: () => void;
  onOpenOrderDrawer: () => void;
}

const linkClass = "text-white/60 hover:text-white transition text-left";

export const Footer: React.FC<FooterProps> = ({ onOpenFlyersModal, onOpenOrderDrawer }) => {
  return (
    <footer className="bg-ink text-white/70 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          <div className="lg:col-span-4 space-y-5">
            <div className="inline-block rounded-2xl bg-white px-5 py-3">
              <Image
                src="/brand/logo.png"
                alt="Global Food Basket"
                width={1104}
                height={590}
                className="h-14 w-auto"
              />
            </div>
            <p className="text-white/60 leading-relaxed max-w-sm">
              Wholesale biscuits, butter cookies, filled pastries and snacks for retailers
              and distributors across the UK and India.
            </p>
            <p className="font-script text-2xl text-leaf-400">Good food has no borders</p>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-semibold">Visit &amp; contact</h4>
            <address className="not-italic space-y-1 text-white/60">
              <p>Unit 7A, Butterfield Business Park</p>
              <p>Great Marlings, Luton LU2 8EU</p>
              <p>United Kingdom</p>
            </address>
            <div className="space-y-1">
              <a href="mailto:sales@globalfoodbasket.com" className="block text-white hover:text-leaf-400 transition">
                sales@globalfoodbasket.com
              </a>
              <a href="tel:+441923606206" className="block text-white hover:text-leaf-400 transition">
                +44 1923 606 206
              </a>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-semibold">For retailers</h4>
            <ul className="space-y-2.5">
              <li>
                <button type="button" onClick={onOpenOrderDrawer} className={linkClass}>
                  Your order &amp; pallet planner
                </button>
              </li>
              <li>
                <button type="button" onClick={onOpenFlyersModal} className={linkClass}>
                  Price lists
                </button>
              </li>
              <li className="text-white/60">Shelf &amp; display advice</li>
              <li className="text-white/60">Container &amp; truckload shipping</li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white font-semibold">Company</h4>
            <ul className="space-y-2.5 text-white/60">
              <li>Privacy policy</li>
              <li>Terms of supply</li>
              <li>Batch traceability</li>
              <li>Certificates of analysis</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© 2026 Global Food Basket Ltd · Registered in England &amp; Wales No. 08110681</p>
          <p>VAT GB 140 0397 50</p>
        </div>
      </div>
    </footer>
  );
};
