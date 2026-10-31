import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Global Food Basket | Wholesale B2B FMCG & Confectionery Inventory",
  description:
    "Premier B2B wholesale distributor of gourmet biscuits, cookies, festive bakery tins, and confectionery. Real-time inventory, tiered volume pricing, pallet & container shipping.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <body
        className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900 antialiased selection:bg-amber-100 selection:text-amber-900"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
