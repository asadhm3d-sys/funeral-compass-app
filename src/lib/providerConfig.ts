// Provider branding configuration.
// Every field falls back to a neutral demo placeholder so the public build
// never exposes a real funeral home's details.  Set VITE_PROVIDER_* in a
// private .env file (never committed) to enable real branding without any
// code changes.

const env = (key: string, fallback: string): string =>
  (import.meta.env[key] as string | undefined)?.trim() || fallback;

export const PROVIDER = {
  name: env("VITE_PROVIDER_NAME", "Funeral Home (Demo)"),
  phoneDisplay: env("VITE_PROVIDER_PHONE_DISPLAY", "+49 000 0000000"),
  phoneTel: env("VITE_PROVIDER_PHONE_TEL", "+490000000000"),
  street: env("VITE_PROVIDER_STREET", "Demo Street 1"),
  city: env("VITE_PROVIDER_CITY", "00000 Demo City"),
  taxId: env("VITE_PROVIDER_TAX_ID", "USt-IdNr. DE000000000 (Demo)"),
  // Comma-separated list of office/location names shown in the submission form.
  offices: env("VITE_PROVIDER_OFFICES", "Main office,Branch office")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
};
