import type { Metadata } from "next";
import { Outfit, Dancing_Script } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-dancing",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Global Food Basket | Wholesale Biscuits, Cookies & Confectionery",
  description:
    "Global Food Basket supplies biscuits, butter cookies, festive tins and confectionery to retailers and distributors, by the case, pallet or container. Good food has no borders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${dancing.variable} h-full scroll-smooth`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen flex flex-col bg-cream text-ink antialiased selection:bg-leaf-200 selection:text-leaf-900"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
