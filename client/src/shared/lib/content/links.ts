export function validateContentLink(value: unknown): true | string {
  const message = "Enter a site path, HTTPS URL, or email link";
  if (typeof value !== "string" || /[\s\\]/.test(value)) return message;
  if (/^\/(?!\/)/.test(value) || /^mailto:[^@]+@[^@]+$/.test(value)) return true;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" && url.hostname && !url.username && !url.password) return true;
  } catch {
    return message;
  }
  return message;
}

const localOrigin = "https://utmist.invalid";

/** Normalize shared links to the form a browser will navigate to. */
export function normalizePublishedRecordLink(value: unknown, allowSitePath = true): string | null {
  if (typeof value !== "string") return null;
  const input = value.trim();

  try {
    if (allowSitePath && input.startsWith("/")) {
      if (input.startsWith("//") || /[\r\n\t\\]/.test(input)) return null;
      const url = new URL(input, localOrigin);
      if (url.origin !== localOrigin || url.pathname.startsWith("//")) return null;
      return url.href.slice(localOrigin.length);
    }

    const url = new URL(input);
    if ((url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password) {
      return url.href;
    }
  } catch {
    return null;
  }
  return null;
}
