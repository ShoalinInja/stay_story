import { getSite } from "@/lib/content";
import { handleEnquiry } from "@/lib/leads/handle";
import { createLimiter } from "@/lib/leads/rate-limit";

// One limiter per server instance so the in-memory fallback keeps its counts between requests.
const limiter = createLimiter(process.env, (...a) => fetch(...a));

export async function POST(request: Request) {
  const site = await getSite();
  return handleEnquiry(request, {
    env: process.env,
    fetch: (...a) => fetch(...a),
    limiter,
    fallback: { phone: site.phone, whatsapp: site.whatsapp },
  });
}
