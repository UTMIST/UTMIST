export function validateContentLink(value: unknown): true | string {
  if (typeof value !== "string" || /[\s\\]/.test(value)) return "Enter a site path, HTTPS URL, or email link";
  if (/^\/(?!\/)/.test(value) || /^mailto:[^@]+@[^@]+$/.test(value)) return true;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" && url.hostname && !url.username && !url.password) return true;
  } catch { /* Return the same editor-facing error for malformed URLs. */ }
  return "Enter a site path, HTTPS URL, or email link";
}

