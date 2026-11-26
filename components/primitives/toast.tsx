"use client";

import { Toaster as SonnerToaster, toast } from "sonner";

/** Mount once (A3: in the root layout body). Call `toast("Code copied")` from client code. */
export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-center"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-full items-center gap-3 rounded-card bg-cta px-4 py-3 text-sm font-medium text-white shadow-card-hover [&_svg]:size-4",
          description: "text-white/80",
          actionButton: "ml-auto min-h-9 rounded-input bg-surface px-3 font-semibold text-ink",
        },
      }}
    />
  );
}

export { toast };
