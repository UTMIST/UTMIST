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

export const validateRequiredHttpUrl = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return "This field is required";
  }

  return validateHttpUrl(value);
};

export const validateSiteUrl = (value: unknown) => {
  if (value === null || value === undefined || value === "") return true;
  if (typeof value === "string" && value.startsWith("/")) return true;

  return validateHttpUrl(value);
};

export const validateRequiredSiteUrl = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return "This field is required";
  }

  return validateSiteUrl(value);
};

export const validatePublicAsset = (value: unknown) => {
  if (typeof value !== "string" || value === "") {
    return "This field is required";
  }
  if (value.startsWith("/") || value.startsWith("src/assets/")) return true;
  return validateHttpUrl(value);
};
