import { test } from "node:test";
import assert from "node:assert/strict";
import { content } from "../content";
import { iconExists } from "./icons";

test("every icon name used in content resolves to a lucide icon", () => {
  const names = [...JSON.stringify(content).matchAll(/"icon":"([a-z0-9-]+)"/g)].map((m) => m[1]);
  assert.ok(names.length > 0);
  assert.deepEqual(names.filter((n) => !iconExists(n)), []);
});
