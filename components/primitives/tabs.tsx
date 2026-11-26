"use client";

import * as React from "react";
import {
  Tabs as UiTabs,
  TabsContent as UiTabsContent,
  TabsList as UiTabsList,
  TabsTrigger as UiTabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

/** Underline tabs (TabbedRail, offers). Radix handles roving focus + arrow keys. */
export function Tabs({ className, ...props }: React.ComponentProps<typeof UiTabs>) {
  return <UiTabs className={cn("gap-4", className)} {...props} />;
}

export function TabsList({ className, ...props }: React.ComponentProps<typeof UiTabsList>) {
  return (
    <UiTabsList
      variant="line"
      className={cn(
        "h-auto w-full justify-start gap-6 overflow-x-auto rounded-none border-b border-line-soft p-0 group-data-horizontal/tabs:h-auto",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof UiTabsTrigger>) {
  return (
    <UiTabsTrigger
      className={cn(
        "h-11 flex-none rounded-none px-0 text-sm font-semibold text-muted-text hover:text-ink data-active:text-ink",
        "focus-visible:ring-0 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-solid focus-visible:outline-ring", // inset: the list scrolls horizontally and would clip it
        "after:bg-ink group-data-horizontal/tabs:after:bottom-0",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: React.ComponentProps<typeof UiTabsContent>) {
  return <UiTabsContent className={cn("type-body focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ring", className)} {...props} />;
}
