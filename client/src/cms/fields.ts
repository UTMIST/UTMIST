export const validateSlug = (value: unknown) =>
  (typeof value === "string" &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) ||
  "Use a lowercase kebab-case slug";

export const validateHttpUrl = (value: unknown) => {
  if (value === null || value === undefined || value === "") return true;
  if (typeof value !== "string") return "Enter a valid URL";

  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) || "Use an HTTP(S) URL";
  } catch {
    return "Enter a valid URL";
  }
};

export const validatePublicAsset = (value: unknown) => {
  if (typeof value !== "string") return "Enter a public asset path or URL";
  if (value.startsWith("/") || value.startsWith("src/assets/")) return true;
  return validateHttpUrl(value);
};
