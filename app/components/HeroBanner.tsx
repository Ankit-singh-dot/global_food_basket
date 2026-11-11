"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PRODUCTS, CATEGORIES } from "./data/products";
import {
  ArrowRightIcon,
  BoxIcon,
  DownloadIcon,
  GlobeIcon,
  LeafIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TruckIcon,
} from "./icons";

interface HeroBannerProps {
  onScrollToCatalog: () => void;
  onOpenOrderDrawer: () => void;
  onOpenFlyersModal: () => void;
}

const casesInStock = PRODUCTS.reduce((sum, p) => sum + p.inStockCases, 0);
const featured = PRODUCTS.filter((p) => p.featured).slice(0, 6);
const orbit = PRODUCTS.filter((p) => !p.featured).slice(0, 4);
const marqueeItems = [
  ...CATEGORIES.filter((c) => c !== "All Lines"),
  "Halal certified",
  "Festive tins",
  "Master shippers 24×",
  "Display SRP boxes",
  "Zero trans fat",
];

/** Counts up from 0 to `target` once the element scrolls into view. */
function useCountUp(target: number, duration = 1400) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ms = reduce ? 0 : duration;
    let raf = 0;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = ms === 0 ? 1 : Math.min(1, (now - start) / ms);
        setValue(Math.round(target * (1 - Math.pow(1 - t, 3))));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, duration]);

  return { ref, value };
}

const Stat: React.FC<{ target: number; suffix?: string; prefix?: string; label: string }> = ({
  target,
  suffix = "",
  prefix = "",
  label,
}) => {
  const { ref, value } = useCountUp(target);
  return (
    <div className="px-5 py-4 first:pl-0">
      <dd className="tabular text-3xl font-semibold text-ink tracking-tight">
        {prefix}
        <span ref={ref}>{value.toLocaleString("en-IN")}</span>
        {suffix}
      </dd>
      <dt className="text-xs text-stone-500 mt-1">{label}</dt>
    </div>
  );
};

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onScrollToCatalog,
  onOpenOrderDrawer,
  onOpenFlyersModal,
}) => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || featured.length < 2) return;
    const id = setInterval(() => setActive((i) => (i + 1) % featured.length), 3200);
    return () => clearInterval(id);
  }, [paused]);

  const current = featured[active];

  return (
    <section className="relative overflow-hidden">
      {/* background: soft glows + dotted grid */}
      <div className="pointer-events-none absolute inset-0 hero-dots opacity-60" />
      <div className="pointer-events-none absolute -top-48 right-[-10%] w-[640px] h-[640px] rounded-full bg-leaf-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-56 -left-40 w-[520px] h-[520px] rounded-full bg-amber-100/70 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-14 sm:pt-14 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* ───────────── Copy ───────────── */}
          <div className="lg:col-span-7 space-y-8 hero-rise">
            <button
              type="button"
              onClick={onOpenFlyersModal}
              className="group inline-flex items-center gap-2 rounded-full border border-leaf-200 bg-white/80 backdrop-blur pl-1.5 pr-4 py-1.5 text-sm text-stone-700 shadow-soft hover:border-leaf-400 transition"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf-600 text-white px-2.5 py-0.5 text-xs font-semibold">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
                  <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-white" />
                </span>
                New
              </span>
              Festive tin season is here — 2026 price lists
              <ArrowRightIcon className="w-3.5 h-3.5 text-leaf-600 transition group-hover:translate-x-0.5" />
            </button>

            <div className="space-y-6">
              <h1 className="text-[2.5rem] sm:text-6xl lg:text-[3.75rem] xl:text-[4.1rem] font-semibold tracking-[-0.03em] text-ink leading-[1.02]">
                Biscuits &amp; treats from
                <br className="hidden sm:block" /> around the{" "}
                <span className="relative inline-block whitespace-nowrap">
                  <span className="font-script font-bold text-leaf-600 text-[1.2em] leading-none">globe</span>
                  <svg
                    aria-hidden
                    viewBox="0 0 200 20"
                    preserveAspectRatio="none"
                    className="absolute left-0 -bottom-2 w-full h-3 text-leaf-400"
                  >
                    <path
                      d="M3 14 C 50 4, 120 2, 197 9"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="5"
                      strokeLinecap="round"
                      className="hero-draw"
                    />
                  </svg>
                </span>
                ,
                <br />
                <span className="text-stone-400">by the case.</span>
              </h1>
              <p className="text-lg text-stone-600 max-w-xl leading-relaxed">
                Butter cookies, festive tins, cream biscuits and oat crackers for grocers,
                cash &amp; carries and distributors — from a single case to a full container.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onScrollToCatalog}
                className="group relative inline-flex items-center gap-2 overflow-hidden px-7 py-4 bg-ink hover:bg-leaf-700 text-white text-sm font-semibold rounded-full transition shadow-lift"
              >
                <span className="hero-shine absolute inset-0" aria-hidden />
                <span className="relative">Shop the range</span>
                <span className="relative flex items-center justify-center w-6 h-6 rounded-full bg-white/15 transition group-hover:translate-x-0.5">
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </span>
              </button>
              <button
                type="button"
                onClick={onOpenOrderDrawer}
                className="inline-flex items-center gap-2 px-6 py-4 bg-white hover:bg-sand text-ink text-sm font-semibold rounded-full border border-line transition"
              >
                View your order
              </button>
              <button
                type="button"
                onClick={onOpenFlyersModal}
                className="inline-flex items-center gap-1.5 px-2 py-3 text-sm font-medium text-leaf-700 hover:text-leaf-900 underline-offset-4 hover:underline transition"
              >
                <DownloadIcon className="w-4 h-4" />
                Price lists
              </button>
            </div>

            <dl className="flex flex-wrap divide-x divide-line border-y border-line max-w-xl">
              <Stat target={casesInStock} label="cases ready to ship" />
              <Stat target={PRODUCTS.length} label="product lines" />
              <Stat target={44} prefix="up to " suffix="%" label="retail margin" />
            </dl>

            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-600">
              <li className="flex items-center gap-2">
                <ShieldCheckIcon className="w-4 h-4 text-leaf-600" /> Halal certified lines
              </li>
              <li className="flex items-center gap-2">
                <GlobeIcon className="w-4 h-4 text-leaf-600" /> UK &amp; India delivery
              </li>
              <li className="flex items-center gap-2">
                <BoxIcon className="w-4 h-4 text-leaf-600" /> Low MOQ
              </li>
            </ul>
          </div>

          {/* ───────────── Showcase ───────────── */}
          <div
            className="lg:col-span-5 hero-rise [animation-delay:150ms]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="relative mx-auto max-w-[560px] aspect-square">
              {/* dark stage */}
              <div className="absolute inset-[6%] rounded-[2.5rem] bg-gradient-to-br from-leaf-800 via-leaf-900 to-ink shadow-lift overflow-hidden">
                <div className="absolute inset-0 hero-dots-light opacity-40" />
                <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-leaf-500/30 blur-3xl" />
                <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-amber-400/20 blur-3xl" />
              </div>

              {/* rotating dashed orbit */}
              <div className="absolute inset-[14%] rounded-full border-2 border-dashed border-white/15 hero-spin" />

              {/* featured product spotlight */}
              <div className="absolute inset-[22%] rounded-full bg-cream shadow-lift ring-8 ring-white/10 overflow-hidden">
                {featured.map((p, i) => (
                  <Image
                    key={p.id}
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="320px"
                    priority={i === 0}
                    className={`object-contain p-[12%] mix-blend-multiply transition-all duration-700 ${
                      i === active ? "opacity-100 scale-100" : "opacity-0 scale-90"
                    }`}
                  />
                ))}
              </div>

              {/* orbiting thumbnails */}
              {orbit.map((p, i) => {
                const pos = [
                  "top-[1%] left-[4%]",
                  "top-[12%] -right-[2%]",
                  "bottom-[22%] -right-[3%]",
                  "bottom-[24%] -left-[3%]",
                ][i];
                return (
                  <div
                    key={p.id}
                    className={`absolute ${pos} w-[21%] aspect-square rounded-2xl bg-white shadow-lift p-1 hero-float`}
                    style={{ animationDelay: `${i * -1.4}s` }}
                  >
                    <div className="relative w-full h-full">
                      <Image src={p.image} alt="" fill sizes="96px" className="object-contain mix-blend-multiply" />
                    </div>
                  </div>
                );
              })}

              {/* halal sticker */}
              <div className="absolute top-[30%] -left-2 sm:-left-4 flex items-center gap-1.5 rounded-full bg-amber-300 text-ink px-3.5 py-1.5 text-xs font-semibold shadow-soft -rotate-6">
                <LeafIcon className="w-3.5 h-3.5 text-leaf-700" />
                Halal &amp; veg options
              </div>

              {/* live product card */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-[1%] w-[78%] sm:w-[68%] rounded-2xl bg-white/95 backdrop-blur px-4 py-3 shadow-lift border border-white">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-leaf-600">
                      <SparklesIcon className="w-3 h-3" /> {current.category}
                    </p>
                    <p key={current.id} className="text-sm font-semibold text-ink truncate hero-fade">
                      {current.name}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="tabular text-sm font-semibold text-ink">{current.inStockCases}</p>
                    <p className="text-[11px] text-stone-500">cases in stock</p>
                  </div>
                </div>
                <div className="mt-2.5 flex gap-1.5" role="tablist" aria-label="Featured products">
                  {featured.map((p, i) => (
                    <button
                      key={p.id}
                      type="button"
                      role="tab"
                      aria-selected={i === active}
                      aria-label={p.name}
                      onClick={() => setActive(i)}
                      className="h-1 flex-1 rounded-full bg-stone-200 overflow-hidden"
                    >
                      <span
                        key={i === active ? `on-${active}` : "off"}
                        className={`block h-full rounded-full bg-leaf-500 ${
                          i < active ? "w-full" : i === active ? (paused ? "w-full" : "hero-progress") : "w-0"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* shipping chip */}
              <div className="absolute top-[0%] right-[26%] hidden sm:flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-soft text-xs font-medium text-ink">
                <TruckIcon className="w-3.5 h-3.5 text-leaf-600" />
                Pallets from Luton
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* category marquee */}
      <div className="relative border-y border-line bg-white/70 backdrop-blur overflow-hidden">
        <div className="flex w-max hero-marquee py-3.5">
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
              {marqueeItems.map((item) => (
                <li key={item} className="flex items-center gap-6 pr-6 text-sm font-medium text-stone-600 whitespace-nowrap">
                  {item}
                  <LeafIcon className="w-3.5 h-3.5 text-leaf-400" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
};
