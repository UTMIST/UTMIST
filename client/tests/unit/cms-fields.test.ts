import {
  validateHttpUrl,
  validatePublicAsset,
  validateRequiredHttpUrl,
  validateRequiredSiteUrl,
  validateSiteUrl,
} from "@/cms/fields";

describe("CMS field validation", () => {
  it("rejects empty values for required URL fields", () => {
    for (const value of [undefined, null, ""]) {
      expect(validateRequiredHttpUrl(value)).not.toBe(true);
      expect(validateRequiredSiteUrl(value)).not.toBe(true);
      expect(validatePublicAsset(value)).not.toBe(true);
    }
  });

  it("allows empty optional URLs and valid supported destinations", () => {
    expect(validateHttpUrl("")).toBe(true);
    expect(validateSiteUrl("")).toBe(true);
    expect(validateHttpUrl("https://utmist.ca/events")).toBe(true);
    expect(validateSiteUrl("/events")).toBe(true);
    expect(validateRequiredHttpUrl("https://utmist.ca/apply")).toBe(true);
    expect(validateRequiredSiteUrl("/careers")).toBe(true);
    expect(validatePublicAsset("src/assets/logos/utmist-logo-large.svg")).toBe(
      true,
    );
  });

  it("rejects unsupported URL schemes", () => {
    expect(validateHttpUrl("javascript:alert(1)")).not.toBe(true);
    expect(validateRequiredHttpUrl("mailto:test@example.com")).not.toBe(true);
    expect(validateRequiredSiteUrl("relative/path")).not.toBe(true);
  });
});
