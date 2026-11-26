"use client";
import { Copy } from "lucide-react";
import { Button, toast } from "@/components/primitives";
import { HOME_COPY } from "./copy";

const T = HOME_COPY.offers;

export function CopyCodeButton({ code }: { code: string }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast(T.copied);
    } catch {
      toast(`${T.copyFailed} ${code}`);
    }
  };
  return (
    <Button size="sm" onClick={copy}>
      <Copy aria-hidden />
      {T.copy}
    </Button>
  );
}
