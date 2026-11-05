export type Currency = "INR" | "GBP";

export function money(amount: number, currency: Currency): string {
  if (currency === "INR") {
    return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  }
  return `£${amount.toFixed(2)}`;
}

export function marginPercent(mrp: number, wholesale: number): number {
  return Math.round(((mrp - wholesale) / mrp) * 100);
}
