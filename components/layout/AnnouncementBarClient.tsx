"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Copy, X } from "lucide-react";
import { toast } from "@/components/primitives";
import { UI } from "./copy";

type Props = { text: string; code?: string; href?: string };

export function AnnouncementBarClient({ text, code, href }: Props) {
  const key = `ss-announcement:${text}`;
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(key)) setHidden(true); // eslint-disable-line react-hooks/set-state-in-effect -- storage is client-only
    } catch {
      /* storage blocked: keep showing */
    }
  }, [key]);

  if (hidden) return null;

  const dismiss = () => {
    setHidden(true);
    try {
      localStorage.setItem(key, "1");
    } catch {
      /* storage blocked: dismissal lasts this page view */
    }
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code ?? "");
      toast(UI.codeCopied);
    } catch {
      toast(code ?? "");
    }
  };

  return (
    <div className="bg-linear-to-r from-brand-tint to-brand text-ink">
      <div className="container-site flex min-h-9 items-center justify-center gap-3 py-1 text-sm font-medium">
        {href ? <Link href={href} className="underline-offset-2 hover:underline">{text}</Link> : <span>{text}</span>}
        {code && (
          <button type="button" onClick={copy} className="inline-flex min-h-9 items-center gap-1 rounded-input border border-dashed border-ink px-2 font-semibold">
            {code}
            <Copy aria-hidden className="size-3.5" />
            <span className="sr-only">{UI.copyCode}</span>
          </button>
        )}
        <button type="button" onClick={dismiss} aria-label={UI.dismiss} className="ml-auto flex size-9 items-center justify-center rounded-input hover:bg-surface/40">
          <X aria-hidden className="size-4" />
        </button>
      </div>
    </div>
  );
}
