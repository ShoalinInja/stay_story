import { serializeLd } from "./schema";

type Node = Parameters<typeof serializeLd>[0][number];

/** Renders schema.org nodes as one JSON-LD @graph. Renders nothing when every node is null. */
export function JsonLd({ data }: { data: Node | Node[] }) {
  const json = serializeLd(Array.isArray(data) ? data : [data]);
  return json ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} /> : null;
}
