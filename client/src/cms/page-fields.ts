import type { Field } from "payload";

export function validateContentLink(value: unknown): true | string {
  if (typeof value !== "string" || /[\s\\]/.test(value)) return "Enter a site path, HTTPS URL, or email link";
  if (/^\/(?!\/)/.test(value) || /^mailto:[^@]+@[^@]+$/.test(value)) return true;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" && url.hostname && !url.username && !url.password) return true;
  } catch { /* Return the same editor-facing error for malformed URLs. */ }
  return "Enter a site path, HTTPS URL, or email link";
}

export function textField(name: string, textarea = false): Field {
  const field = {
    name,
    required: true,
    validate: (value: unknown) => (typeof value === "string" && value.trim().length > 0) || "Enter some text",
  };
  return textarea ? { ...field, type: "textarea" } : { ...field, type: "text" };
}

export const linkFields: Field[] = [
  textField("label"),
  { name: "href", type: "text", required: true, validate: validateContentLink },
];

export const introFields: Field[] = [textField("eyebrow"), textField("heading"), textField("description", true)];
export const ctaField: Field = { name: "cta", type: "group", fields: linkFields };
