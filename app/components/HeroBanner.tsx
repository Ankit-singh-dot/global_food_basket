"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { PRODUCTS, type Product } from "./data/products";
import { ArrowRightIcon, ChevronRightIcon } from "./icons";

interface HeroBannerProps {
  onScrollToCatalog: () => void;
  onOpenFlyersModal: () => void;
  onSelectProduct: (product: Product) => void;
}

const byId = (id: string) => PRODUCTS.find((p) => p.id === id);

/* ───────────────────────── decorative motifs ───────────────────────── */

/** Line-drawn globe: our brand watermark ("good food has no borders"). */
const LineGlobe: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 400 400" fill="none" stroke="currentColor" className={className} aria-hidden>
    <g className="globe-spin">
      <circle cx="200" cy="200" r="190" strokeWidth="2.5" />
      {[40, 85, 130, 170].map((rx) => (
        <ellipse key={rx} cx="200" cy="200" rx={rx} ry="190" strokeWidth="1.6" />
      ))}
      <line x1="200" y1="10" x2="200" y2="390" strokeWidth="1.6" />
      {[-140, -95, -48, 0, 48, 95, 140].map((y) => {
        const half = Math.sqrt(190 * 190 - y * y);
        return <ellipse key={y} cx="200" cy={200 + y} rx={half} ry={half * 0.12} strokeWidth="1.4" />;
      })}
    </g>
  </svg>
);

/** Circular import stamp, text running round the rim. */
const Stamp: React.FC<{ id: string; text: string; lines: [string, string]; className?: string }> = ({
  id,
  text,
  lines,
  className,
}) => (
  <div className={className} aria-hidden>
    <svg viewBox="0 0 200 200" className="h-full w-full stamp-spin">
      <defs>
        <path id={id} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
      </defs>
      <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 5" />
      <text fill="currentColor" fontSize="14.5" fontWeight="800" letterSpacing="3">
        <textPath href={`#${id}`}>{text}</textPath>
      </text>
    </svg>
    <span className="absolute inset-0 flex flex-col items-center justify-center text-center text-[10px] sm:text-[11px] font-black uppercase leading-tight tracking-wider">
      <span>{lines[0]}</span>
      <span>{lines[1]}</span>
    </span>
  </div>
);

const Cta: React.FC<{ onClick: () => void; children: React.ReactNode; className: string; knob: string }> = ({
  onClick,
  children,
  className,
  knob,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`group inline-flex w-fit items-center gap-3 rounded-full py-2 pl-6 pr-2 text-sm font-bold transition ${className}`}
  >
    {children}
    <span className={`flex h-8 w-8 items-center justify-center rounded-full transition group-hover:translate-x-0.5 ${knob}`}>
      <ArrowRightIcon className="h-4 w-4" />
    </span>
  </button>
);

/* ───────────────────────── slide 1 · Cheetos (hero product) ───────────────────────── */

const PHOTO_EDGE_FADE = "radial-gradient(closest-side, #000 74%, transparent 100%)";

const CheetosSlide: React.FC<Pick<HeroBannerProps, "onScrollToCatalog" | "onOpenFlyersModal">> = ({
  onScrollToCatalog,
  onOpenFlyersModal,
}) => (
    <div
      className="relative h-full w-full overflow-hidden text-ink"
      style={{ background: "radial-gradient(120% 90% at 70% 45%, #ffd3a1 0%, #fea953 38%, #f7861d 72%, #e8650c 100%)" }}
    >
      <LineGlobe className="absolute -left-40 -bottom-56 w-[640px] text-[#b4480a] opacity-25" />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-4 -top-6 hidden select-none text-[14rem] font-black uppercase leading-none tracking-[-0.06em] text-white/15 xl:block"
      >
        Crunch
      </span>

      <Stamp
        id="stamp-cheetos"
        text="IMPORTED · USA → LUTON · BY THE CASE · "
        lines={["Good food", "no borders"]}
        className="absolute right-10 top-8 z-10 hidden h-28 w-28 text-ink sm:block lg:right-12 lg:top-10 lg:h-32 lg:w-32"
      />

      <div className="relative grid h-full grid-cols-1 content-start lg:content-stretch lg:grid-cols-12">
        {/* copy */}
        <div className="z-10 flex flex-col justify-center gap-7 px-6 pt-8 sm:px-12 lg:col-span-5 lg:pt-8 lg:pb-24 lg:pl-14 lg:pr-0">
          <p className="inline-flex w-fit items-center gap-2 rounded-full bg-ink px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#fea953]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#fea953]" /> Our No.1 seller
          </p>

          <h2 className="text-[3.3rem] font-black uppercase leading-[0.86] tracking-[-0.045em] sm:text-7xl lg:text-[4.25rem] xl:text-[5rem]">
            The crunch
            <br />
            everyone
            <br />
            <span className="text-white hero-type-shadow">asks for.</span>
          </h2>

          <p className="max-w-sm text-base font-medium leading-relaxed text-ink/75">
            Genuine US-import Cheetos, landed at our Luton depot and shipped by the case to shops across the UK &amp;
            India.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Cta onClick={onScrollToCatalog} className="bg-ink text-white hover:bg-[#2a1608]" knob="bg-[#fea953] text-ink">
              Shop the range
            </Cta>
            <button
              type="button"
              onClick={onOpenFlyersModal}
              className="rounded-full border-2 border-ink px-5 py-2.5 text-sm font-bold transition hover:bg-ink hover:text-white"
            >
              Trade price lists
            </button>
          </div>
        </div>

        {/* product photo */}
        <div className="relative flex items-center lg:col-span-7">
          <div
            className="relative aspect-[1079/600] w-[115%] -mx-[7%] lg:mx-0 lg:w-[118%]"
            style={{ maskImage: PHOTO_EDGE_FADE, WebkitMaskImage: PHOTO_EDGE_FADE }}
          >
            <Image
              src="/brand/hero-banner.jpg"
              alt="Cheetos Flamin’ Hot Puffs, Puffs, Crunchy, Flamin’ Hot Crunchy and Cheddar Jalapeño bags"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 62vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
);

/* ───────────────────────── supporting slides ───────────────────────── */

const TinsSlide: React.FC<Pick<HeroBannerProps, "onSelectProduct" | "onScrollToCatalog">> = ({
  onSelectProduct,
  onScrollToCatalog,
}) => {
  const red = byId("gfb-004");
  const blue = byId("gfb-005");
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: "radial-gradient(110% 90% at 72% 50%, #24407e 0%, #142a5c 45%, #0b1838 100%)" }}
    >
      <LineGlobe className="absolute -right-32 -top-40 w-[620px] text-[#e2c27a] opacity-15" />
      <div className="relative grid h-full grid-cols-1 content-start lg:content-stretch lg:grid-cols-12 lg:items-center">
        <div className="z-10 space-y-6 px-6 pt-8 sm:px-12 lg:col-span-5 lg:pl-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#e2c27a]">Festive season · 454g tins</p>
          <h2 className="text-5xl font-semibold leading-[0.95] tracking-[-0.03em] text-white sm:text-6xl xl:text-7xl">
            Butter cookies,
            <br />
            <span className="font-script text-[1.15em] font-bold tracking-normal text-[#e2c27a]">tinned</span> for
            <br />
            the rush.
          </h2>
          <p className="max-w-sm text-base leading-relaxed text-white/70">
            Royal Blue and Festive Red Danish-style tins, 12 to a case. The gifting staple from Diwali to Christmas.
          </p>
          <Cta onClick={onScrollToCatalog} className="bg-[#e2c27a] text-[#0b1838] hover:bg-white" knob="bg-[#0b1838] text-[#e2c27a]">
            See the tins
          </Cta>
        </div>
        <div className="relative h-[340px] sm:h-[420px] lg:col-span-7 lg:h-full">
          {red && (
            <button
              type="button"
              onClick={() => onSelectProduct(red)}
              aria-label={red.name}
              className="absolute left-[10%] top-[16%] w-[44%] max-w-[380px] -rotate-6 transition duration-500 hover:-rotate-2 hover:scale-105"
            >
              <Image src="/hero/danish-butter-red-tin.png" alt="" width={283} height={231} className="h-auto w-full hero-pack-shadow" />
            </button>
          )}
          {blue && (
            <button
              type="button"
              onClick={() => onSelectProduct(blue)}
              aria-label={blue.name}
              className="absolute bottom-[20%] right-[8%] w-[44%] max-w-[380px] rotate-6 transition duration-500 hover:rotate-2 hover:scale-105"
            >
              <Image src="/hero/danish-butter-blue-tin.png" alt="" width={269} height={231} className="h-auto w-full hero-pack-shadow" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const JAM = [
  { id: "gfb-014", src: "/hero/strawberry-filling-box-120g.png", w: 206, h: 340, rot: "-rotate-[8deg]", pos: "left-[4%] top-[20%]" },
  { id: "gfb-015", src: "/hero/blueberry-filling-box-120g.png", w: 203, h: 349, rot: "rotate-[3deg]", pos: "left-[25%] top-[8%]" },
  { id: "gfb-016", src: "/hero/pineapple-filling-box-120g.png", w: 203, h: 349, rot: "-rotate-[3deg]", pos: "left-[46%] top-[22%]" },
  { id: "gfb-001", src: "/hero/choc-cream-150g.png", w: 297, h: 372, rot: "rotate-[9deg]", pos: "left-[66%] top-[10%]" },
];

const JamSlide: React.FC<Pick<HeroBannerProps, "onSelectProduct" | "onScrollToCatalog">> = ({
  onSelectProduct,
  onScrollToCatalog,
}) => (
  <div
    className="relative h-full w-full overflow-hidden text-white"
    style={{ background: "radial-gradient(110% 90% at 70% 50%, #e8394a 0%, #c41d33 50%, #8f0f22 100%)" }}
  >
    <LineGlobe className="absolute -bottom-48 -left-48 w-[620px] text-white opacity-10" />
    <div className="relative grid h-full grid-cols-1 content-start lg:content-stretch lg:grid-cols-12 lg:items-center">
      <div className="z-10 space-y-6 px-6 pt-8 sm:px-12 lg:col-span-5 lg:pl-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/70">Ever Delicious · display boxes</p>
        <h2 className="leading-[0.9]">
          <span className="block whitespace-nowrap font-script text-7xl font-bold text-[#ffd9dd] sm:text-8xl xl:text-[7rem]">Jam-filled</span>
          <span className="mt-2 block text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">soft cookies, real fruit.</span>
        </h2>
        <p className="max-w-sm text-base leading-relaxed text-white/75">
          Strawberry, blueberry, pineapple and chocolate cream, in display-ready boxes that sell themselves at the till.
        </p>
        <Cta onClick={onScrollToCatalog} className="bg-white text-[#8f0f22] hover:bg-[#ffd9dd]" knob="bg-[#c41d33] text-white">
          Shop fillings
        </Cta>
      </div>
      <div className="relative h-[320px] sm:h-[420px] lg:col-span-7 lg:h-full">
        {JAM.map((j) => {
          const p = byId(j.id);
          if (!p) return null;
          return (
            <button
              key={j.id}
              type="button"
              onClick={() => onSelectProduct(p)}
              aria-label={p.name}
              className={`absolute ${j.pos} ${j.rot} w-[22%] max-w-[230px] transition duration-500 hover:-translate-y-3 hover:rotate-0`}
            >
              <Image src={j.src} alt="" width={j.w} height={j.h} className="h-auto w-full hero-pack-shadow" />
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

/* ───────────────────────── slider ───────────────────────── */

const SLIDES = ["Cheetos", "Butter tins", "Jam cookies"];
const AUTOPLAY_MS = 8000;

export const HeroBanner: React.FC<HeroBannerProps> = ({ onScrollToCatalog, onOpenFlyersModal, onSelectProduct }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = useCallback((dir: number) => setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => go(1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [index, paused, go]);

  const slides = [
    <CheetosSlide key="c" onScrollToCatalog={onScrollToCatalog} onOpenFlyersModal={onOpenFlyersModal} />,
    <TinsSlide key="t" onSelectProduct={onSelectProduct} onScrollToCatalog={onScrollToCatalog} />,
    <JamSlide key="j" onSelectProduct={onSelectProduct} onScrollToCatalog={onScrollToCatalog} />,
  ];

  return (
    <section
      className="px-3 pt-3 sm:px-4 sm:pt-4"
      aria-roledescription="carousel"
      aria-label="Featured lines"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      <div className="relative overflow-hidden rounded-[1.75rem] bg-ink hero-frame sm:rounded-[2.25rem]">
        {slides.map((slide, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${SLIDES.length}: ${SLIDES[i]}`}
            aria-hidden={i !== index}
            inert={i !== index}
            className={`absolute inset-0 transition duration-700 ease-out ${
              i === index ? "z-10 scale-100 opacity-100" : "z-0 scale-[1.02] opacity-0"
            }`}
          >
            {slide}
          </div>
        ))}

        {/* controls */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-4 p-4 sm:p-6">
          <div className="pointer-events-auto flex gap-1 rounded-full bg-white/85 p-1.5 shadow-soft backdrop-blur">
            {SLIDES.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setIndex(i)}
                aria-current={i === index}
                className={`relative overflow-hidden rounded-full px-3 py-1.5 text-xs font-bold transition sm:px-3.5 ${
                  i === index ? "bg-ink text-white" : "text-ink/60 hover:text-ink"
                }`}
              >
                {i === index && !paused && (
                  <span
                    key={index}
                    aria-hidden
                    className="absolute inset-y-0 left-0 bg-white/25 slide-progress"
                    style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                  />
                )}
                <span className="relative">
                  <span className="tabular mr-1.5 opacity-50">0{i + 1}</span>
                  {label}
                </span>
              </button>
            ))}
          </div>
          <div className="pointer-events-auto hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous slide"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-soft transition hover:scale-105"
            >
              <ChevronRightIcon className="h-5 w-5 rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next slide"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-soft transition hover:scale-105"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
