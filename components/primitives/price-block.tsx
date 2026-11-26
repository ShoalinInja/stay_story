import { cn } from "@/lib/utils";

export type PriceMode = "per-night" | "monthly" | "sale";

export type PriceBlockProps = {
  /** INR amount. null / undefined / non-finite / ≤ 0 → "Price on request" with no suffix. */
  amount?: number | null;
  mode?: PriceMode;
  /** Optional lead-in, e.g. "Price from". */
  prefix?: string;
  /** Overrides the default suffix for the mode. */
  suffix?: string;
  onRequestLabel?: string;
  className?: string;
};

const SUFFIX: Record<PriceMode, string> = {
  "per-night": "Per night + taxes",
  monthly: "Per month",
  sale: "Sale price",
};

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatINR(amount: number): string {
  return inr.format(amount);
}

export function PriceBlock({
  amount,
  mode = "per-night",
  prefix,
  suffix,
  onRequestLabel = "Price on request",
  className,
}: PriceBlockProps) {
  if (amount == null || !Number.isFinite(amount) || amount <= 0) {
    return <p className={cn("type-h3 text-ink", className)}>{onRequestLabel}</p>;
  }
  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-1.5", className)}>
      {prefix && <span className="type-meta">{prefix}</span>}
      <span className="type-price text-ink">{formatINR(amount)}</span>
      <span className="type-meta">{suffix ?? SUFFIX[mode]}</span>
    </p>
  );
}
