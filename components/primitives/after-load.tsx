"use client";

import * as React from "react";

const subscribe = (cb: () => void) => {
  window.addEventListener("load", cb);
  return () => window.removeEventListener("load", cb);
};
const isLoaded = () => document.readyState === "complete";
const onServer = () => false;

/**
 * Renders children only after the window `load` event, so off-screen carousel slides don't
 * compete with the LCP image for mobile bandwidth (native lazy-loading still fetches them:
 * they sit inside the lazy-load distance). Renders `fallback` until then and without JS.
 */
export function AfterLoad({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return React.useSyncExternalStore(subscribe, isLoaded, onServer) ? children : fallback;
}
