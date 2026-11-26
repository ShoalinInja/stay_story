import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export type RatingPillProps = {
  /** Rating out of 5. Missing, non-finite or ≤ 0 renders nothing (never "0.0"). */
  value?: number | null;
  count?: number | null;
  /** Accessible label; defaults to "Rated {value} out of 5". */
  label?: string;
  className?: string;
};

export function RatingPill({ value, count, label, className }: RatingPillProps) {
  if (value == null || !Number.isFinite(value) || value <= 0) return null;
  const shown = Math.min(value, 5).toFixed(1);
  const hasCount = count != null && Number.isFinite(count) && count > 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 text-xs font-semibold text-ink shadow-card",
        className,
      )}
    >
      <Star aria-hidden className="size-3.5 fill-star text-star" />
      <span className="sr-only">{label ?? `Rated ${shown} out of 5`}</span>
      <span aria-hidden>{shown}</span>
      {hasCount && <span className="font-normal text-muted-text">({count})</span>}
    </span>
  );
}
