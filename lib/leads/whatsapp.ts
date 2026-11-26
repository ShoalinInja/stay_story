// WhatsApp click-to-chat helpers. Client-safe.

export type WhatsAppLead = {
  type: string;
  staySlug?: string;
  serviceSlug?: string;
  checkIn?: string;
  checkOut?: string;
  moveIn?: string;
};

export function whatsAppUrl(number: string, text: string): string {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

const humanise = (slug: string) => slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

export function leadWhatsAppMessage(l: WhatsAppLead): string {
  const subject = l.staySlug
    ? ` about ${humanise(l.staySlug)}`
    : l.serviceSlug
      ? ` about ${humanise(l.serviceSlug)}`
      : "";
  const when =
    l.checkIn && l.checkOut
      ? ` for ${l.checkIn} to ${l.checkOut}`
      : l.checkIn
        ? ` for ${l.checkIn}`
        : l.moveIn
          ? ` moving in ${l.moveIn}`
          : "";
  return `Hi, I just sent an enquiry${subject}${when}. Could you help me with the next steps?`;
}
