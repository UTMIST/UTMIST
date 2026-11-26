function isContentLink(value: unknown, allowHttp: boolean) {
  if (typeof value !== "string" || /[\s\\]/.test(value)) return false;
  if (/^\/(?!\/)/.test(value) || /^mailto:[^@]+@[^@]+$/.test(value)) return true;
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || (allowHttp && url.protocol === "http:"))
      && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function validateContentLink(value: unknown): true | string {
  return isContentLink(value, false) || "Enter a site path, HTTPS URL, or email link";
}

/** Shared records already support HTTP and HTTPS destinations. */
export function isPublishedRecordLink(value: string): boolean {
  return isContentLink(value, true);
}
