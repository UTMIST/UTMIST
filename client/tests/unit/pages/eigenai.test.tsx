import { fireEvent, render, screen } from "@testing-library/react";

jest.mock("@/shared/lib/server", () => ({
  evaluateFlag: () => { throw new Error("Flag provider unavailable"); },
  getCurrentUser: () => { throw new Error("Public page must not load a profile"); },
}));

jest.mock("react-intersection-observer", () => ({
  useInView: () => ({ ref: jest.fn(), inView: false }),
}));

import EigenAIPage from "@/app/(frontend)/eigenai/page";

it("keeps the launched page interactive without a flag provider or Maps key", () => {
  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  try {
    const { container } = render(<EigenAIPage />);
    expect(screen.getByTestId("eigenai-redesign")).toBeInTheDocument();
    expect(container.querySelector('iframe[src*="google.com/maps"]')).toBeNull();
    expect(container.querySelector('a[href*="google.com/maps/search/"]')).toBeInTheDocument();

    const toggle = container.querySelector<HTMLButtonElement>(
      'button[aria-controls="eigenai-mobile-menu"]',
    )!;
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById("eigenai-mobile-menu")).toBeNull();
    expect(document.body.style.overflow).not.toBe("hidden");
  } finally {
    if (mapsKey === undefined) delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    else process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = mapsKey;
  }
});
