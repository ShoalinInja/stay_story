// Display helpers for the phone/WhatsApp fallback links. Client-safe.

/** "+918160182809" → "+91 81601 82809"; anything else is returned unchanged. */
export function formatIndianPhone(e164: string): string {
  const m = e164.match(/^\+91(\d{5})(\d{5})$/);
  return m ? `+91 ${m[1]} ${m[2]}` : e164;
}
