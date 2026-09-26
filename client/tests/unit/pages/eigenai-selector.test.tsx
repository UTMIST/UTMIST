import { fireEvent, render, screen, within } from "@testing-library/react";

// The selector is a server component. Mock the server barrel so no Supabase /
// Vercel Flags code loads, and stub the existing page (heavy: styles, images,
// and a Google Maps env check). The redesign renders for
// real — that also covers its Tailwind-styled redesign wrapper.
const mockEvaluateFlag = jest.fn();
const mockGetCurrentUser = jest.fn();

jest.mock("@/shared/lib/server", () => ({
  evaluateFlag: (...args: unknown[]) => mockEvaluateFlag(...args),
  getCurrentUser: () => mockGetCurrentUser(),
}));

jest.mock("@/shared/ui/client", () => ({
  Navbar: () => <nav aria-label="Site">Standard navigation</nav>,
  FloatingThemeToggle: () => <button>Change theme</button>,
}));

jest.mock("@/features/public-site/pages/eigenai", () => ({
  __esModule: true,
  default: () => <div data-testid="eigenai-existing">existing</div>,
}));

jest.mock("react-intersection-observer", () => ({
  useInView: () => ({ ref: jest.fn(), inView: false }),
}));

import EigenAIFlagged from "@/features/public-site/pages/eigenaiFlagged";
// `dynamic` is declared on the route segment itself (that's the only place
// Next.js reads it), so assert it there rather than on the selector module.
import { dynamic } from "@/app/(frontend)/eigenai/page";

describe("EigenAI flag selector", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCurrentUser.mockResolvedValue(null);
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = "test-maps-key";
  });

  it("renders /eigenai dynamically so the flag is read per request", () => {
    expect(dynamic).toBe("force-dynamic");
  });

  it("selects the existing page with standard chrome when the flag is off", async () => {
    mockEvaluateFlag.mockResolvedValue(false);

    render(await EigenAIFlagged());

    expect(screen.getByTestId("eigenai-existing")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Site" })).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Change theme" })).toBeInTheDocument();
    expect(screen.queryByTestId("eigenai-redesign")).not.toBeInTheDocument();
    expect(mockEvaluateFlag).toHaveBeenCalledWith("Eigen-AI-Redesign", {
      cohort: "public",
    });
  });

  it("selects the redesign when the flag is on", async () => {
    mockEvaluateFlag.mockResolvedValue(true);

    render(await EigenAIFlagged());

    const redesign = screen.getByTestId("eigenai-redesign");
    expect(redesign).toBeInTheDocument();
    expect(redesign).toHaveClass(
      "font-eigen-body",
      "font-medium",
      "bg-[#0c0249]",
    );
    const navigation = screen.getByRole("navigation", { name: "EigenAI" });
    expect(navigation).toBeInTheDocument();
    expect(navigation).toHaveClass("w-full");
    expect(navigation).not.toHaveClass("max-w-6xl");
    expect(screen.queryByRole("navigation", { name: "Site" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Change theme" })).not.toBeInTheDocument();
    expect(
      within(navigation).getByRole("button", { name: "Open navigation menu" }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(within(navigation).getAllByAltText("UTMIST")).toHaveLength(2);
    expect(screen.getByTestId("eigenai-mobile-nav-bar")).toHaveClass(
      "flex",
      "w-full",
      "justify-between",
    );
    expect(screen.getByTestId("eigenai-mobile-nav-surface")).toHaveClass(
      "bg-[#0c0249]/90",
    );
    expect(screen.getByTestId("eigenai-desktop-nav-layout")).toHaveClass(
      "grid-cols-[1fr_auto_1fr]",
      "md:grid",
    );
    expect(
      within(screen.getByTestId("eigenai-desktop-nav-layout")).getByRole(
        "link",
        { name: "UTMIST home" },
      ),
    ).toHaveClass("justify-self-start");
    expect(
      navigation.querySelector('[aria-hidden="true"].pointer-events-none.h-8'),
    ).toHaveClass("h-8", "bg-linear-to-b", "to-transparent");
    expect(navigation.previousElementSibling).toHaveClass(
      "h-36",
      "from-[#06002f]/90",
      "md:block",
    );
    expect(
      within(navigation).getByRole("link", { name: "About" }),
    ).toHaveAttribute("href", "#about");
    expect(
      within(navigation).getByRole("link", { name: "Speakers" }),
    ).toHaveAttribute("href", "#speakers");
    expect(
      within(navigation).getByRole("link", { name: "Workshops" }),
    ).toHaveAttribute("href", "#workshops");
    expect(
      within(navigation).getByRole("link", { name: "Schedule" }),
    ).toHaveAttribute("href", "#schedule");
    expect(
      within(navigation).getByRole("link", { name: "Venue" }),
    ).toHaveAttribute("href", "#venue");
    expect(
      within(navigation).getByRole("link", { name: "UTMIST Home" }),
    ).toHaveAttribute("href", "/");
    expect(within(navigation).queryByRole("link", { name: "Login" })).not.toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    const aboutHeading = screen.getByRole("heading", {
      name: /What is eigenai\s*\?/,
    });
    expect(aboutHeading).toBeInTheDocument();
    expect(aboutHeading).toHaveClass("font-eigen-serif!", "font-medium!");
    expect(
      within(aboutHeading).getByTestId("eigenai-wordmark"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Speakers" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Jensen Huang" }),
    ).toHaveClass("font-normal!");
    expect(
      screen.getByRole("heading", { name: "Workshops" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Schedule" })).toBeInTheDocument();
    expect(screen.getByTestId("eigenai-schedule")).toHaveClass("grid", "md:grid-cols-2");
    expect(screen.getByRole("heading", { name: /October 3/ })).toHaveClass(
      "text-xl",
      "sm:text-3xl",
    );
    expect(
      screen.getByRole("heading", { name: /October 4/ }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Room TBA")).toHaveLength(16);
    expect(screen.getAllByText("Session details will be announced soon.")).toHaveLength(6);
    expect(screen.getByRole("heading", { name: "Venue" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Ontario Institute for Studies in Education (OISE)",
      }),
    ).toHaveClass("text-xl/tight", "sm:text-3xl");
    expect(
      screen.getByTitle("Google Maps preview of the EigenAI venue"),
    ).toHaveAttribute(
      "src",
      expect.stringContaining("maps/embed/v1/place?key=test-maps-key"),
    );
    expect(screen.getByRole("link", { name: "Get directions" })).toHaveAttribute(
      "href",
      expect.stringContaining("google.com/maps/search"),
    );
    expect(screen.getByText("October 3rd & 4th")).toHaveClass(
      "block",
      "sm:inline",
    );
    expect(screen.getByText("@ LOCAT")).toHaveClass("block", "sm:inline");
    expect(
      screen.getAllByText("Building Applications with the Claude API"),
    ).toHaveLength(3);
    expect(
      screen.getAllByText("Building Applications with the Claude API")[0],
    ).toHaveClass("font-medium!");
    expect(screen.getByText("CEO @ NVIDIA")).toHaveClass(
      "text-xs",
      "sm:text-lg",
    );
    expect(screen.getAllByText(/An introduction on how to integrate/)[0]).toHaveClass(
      "text-xs/relaxed",
      "sm:text-lg",
    );
    const contentContainers = screen.getAllByTestId("eigenai-content");
    expect(contentContainers.length).toBeGreaterThanOrEqual(5);
    expect(
      contentContainers.every((container) =>
        container.classList.contains("max-w-6xl"),
      ),
    ).toBe(true);
    for (const sectionId of [
      "about",
      "speakers",
      "workshops",
      "schedule",
      "venue",
    ]) {
      expect(document.getElementById(sectionId)).toHaveClass(
        "relative",
        "px-5",
        "sm:px-10",
      );
    }
    expect(screen.getByTestId("eigenai-metrics")).toHaveClass(
      "mx-auto",
      "max-w-3xl",
      "grid-cols-3",
      "gap-x-2",
      "sm:gap-x-0",
    );
    const attendees = screen.getByText("Attendees");
    expect(attendees).toHaveClass("font-eigen-body", "text-white");
    expect(attendees.previousElementSibling).toHaveClass(
      "font-eigen-serif",
      "text-[clamp(2.25rem,8vw,6rem)]",
      "text-white",
    );
    const lockups = screen.getAllByTestId("eigenai-lockup");
    expect(lockups).toHaveLength(2);
    expect(screen.getAllByTestId("eigenai-lockup-cursor")).toHaveLength(1);
    expect(
      within(lockups[0]).getByTestId("eigenai-lockup-cursor"),
    ).toBeInTheDocument();
    expect(
      within(lockups[1]).queryByTestId("eigenai-lockup-cursor"),
    ).not.toBeInTheDocument();
    expect(
      within(lockups[0]).getByTestId("eigenai-wordmark").firstElementChild,
    ).toHaveStyle({ maskImage: "var(--cursor-mask), linear-gradient(#000 0 0)" });
    expect(
      within(lockups[0]).getByTestId("eigenai-wordmark").firstElementChild,
    ).toHaveClass("[mask-position:calc(100%+0.48em)_1.023em,0_0]");
    expect(
      within(lockups[1]).getByTestId("eigenai-wordmark").firstElementChild,
    ).not.toHaveStyle({
      maskImage: "var(--cursor-mask), linear-gradient(#000 0 0)",
    });
    expect(screen.getAllByTestId("eigenai-wordmark")).toHaveLength(3);
    expect(
      lockups.every((lockup) =>
        within(lockup).getByRole("img", { name: "UTMIST" }),
      ),
    ).toBe(true);
    expect(
      lockups.every((lockup) =>
        within(lockup)
          .getByText("CONFERENCE ’26")
          .classList.contains("bg-clip-text"),
      ),
    ).toBe(true);
    expect(lockups[0]).toHaveStyle({
      fontSize: "clamp(4rem, 15vw, 10.5rem)",
    });
    expect(lockups[1]).toHaveStyle({ fontSize: "clamp(3.5rem, 12vw, 5rem)" });
    const backdrop = screen.getByTestId("eigenai-continuous-backdrop");
    expect(
      within(backdrop).getAllByTestId("eigenai-backdrop-image"),
    ).toHaveLength(13);
    const orbitClusters = screen.getAllByTestId("eigenai-orbit-cluster");
    expect(orbitClusters).toHaveLength(4);
    expect(screen.getAllByTestId("eigenai-orbit-cloud")).toHaveLength(3);
    expect(orbitClusters[0]).toHaveStyle({ maxWidth: "951.318px" });
    expect(orbitClusters[3]).toHaveStyle({ maxWidth: "1113.84px" });
    const lambdaClusters = screen.getAllByTestId("eigenai-lambda-cluster");
    expect(lambdaClusters).toHaveLength(2);
    for (const cluster of lambdaClusters) {
      expect(cluster.querySelectorAll("img")).toHaveLength(2);
      expect(cluster).toHaveClass("[container-type:inline-size]");
    }
    const ringGroups = screen.getAllByTestId("eigenai-ring-group");
    expect(ringGroups).toHaveLength(1);
    expect(ringGroups[0]).toHaveClass("hidden", "md:block");
    expect(ringGroups[0]).toHaveStyle({ maxWidth: "951.318px" });
    for (const group of ringGroups) {
      const rings = group.querySelectorAll("img");
      expect(rings).toHaveLength(3);
      for (const ring of rings) {
        expect(ring).toHaveClass(
          "left-1/2",
          "top-1/2",
          "-translate-x-1/2",
          "-translate-y-1/2",
        );
      }
    }
    const mobileRingGroups = screen.getAllByTestId(
      "eigenai-mobile-ring-group",
    );
    expect(mobileRingGroups).toHaveLength(5);
    expect(mobileRingGroups.map((group) => group.style.top)).toEqual([
      "6%",
      "30%",
      "54%",
      "76%",
      "94%",
    ]);
    for (const group of mobileRingGroups) {
      expect(group).toHaveClass("md:hidden");
      expect(group.querySelectorAll("img")).toHaveLength(3);
    }
    expect(screen.getByTestId("eigenai-hero")).not.toHaveClass(
      "overflow-hidden",
    );
    expect(screen.getByTestId("eigenai-hero")).toHaveClass("min-h-svh");
    expect(screen.getByTestId("eigenai-hero")).toHaveClass("px-5");
    expect(screen.getByTestId("eigenai-metrics").closest("section")).toHaveClass(
      "pt-4",
    );
    expect(
      screen
        .getAllByRole("heading", { name: "Someguy Lastnameem" })[0]
        .closest("article"),
    ).toHaveClass("text-center", "sm:text-left");
    expect(
      screen.getByRole("heading", { name: "Jensen Huang" }).parentElement,
    ).toHaveClass("text-center", "md:text-left");
    expect(screen.getByTestId("eigenai-closing")).not.toHaveClass(
      "overflow-hidden",
      "min-h-96",
    );
    expect(screen.getByTestId("eigenai-closing")).toHaveClass("pt-4");
    expect(
      screen.getByRole("heading", { name: "Workshops" }).closest("section"),
    ).not.toHaveClass("overflow-hidden");
    expect(
      screen.getByRole("link", { name: "UTMIST on Instagram" }),
    ).toHaveClass("size-11");
    const footerLinks = [
      ["Discord", "https://discord.com/invite/88mSPw8"],
      ["LinkedIn", "https://www.linkedin.com/company/utmist/"],
      ["Instagram", "https://www.instagram.com/uoft_utmist/"],
      // ["Facebook", "https://www.facebook.com/UofT.MIST"],
      // ["X", "https://x.com/utmist1"],
      ["GitHub", "https://github.com/UTMIST"],
      // ["Medium", "https://utorontomist.medium.com/"],
    ];
    for (const [label, href] of footerLinks) {
      expect(
        screen.getByRole("link", { name: `UTMIST on ${label}` }),
      ).toHaveAttribute("href", href);
    }
    expect(screen.queryByTestId("eigenai-existing")).not.toBeInTheDocument();
  });

  it("opens and dismisses the redesign mobile navigation", async () => {
    mockEvaluateFlag.mockResolvedValue(true);

    render(await EigenAIFlagged());

    fireEvent.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );

    expect(
      screen.getByRole("button", { name: "Close navigation menu" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(screen.queryByRole("link", { name: "Login" })).not.toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Schedule" })).toHaveLength(2);
    expect(
      document.getElementById("eigenai-mobile-menu")?.querySelector("ul"),
    ).toHaveClass("items-start", "text-left");
    const mobileNavSurface = screen.getByTestId("eigenai-mobile-nav-surface");
    expect(mobileNavSurface).toHaveClass("rounded-b-3xl");
    expect(mobileNavSurface.firstElementChild).toHaveClass(
      "backdrop-blur-[22px]",
      "before:hidden",
    );
    const navigation = screen.getByRole("navigation", { name: "EigenAI" });
    expect(
      navigation.querySelector('[aria-hidden="true"].pointer-events-none.h-8'),
    ).not.toBeInTheDocument();
    expect(document.getElementById("eigenai-mobile-menu")).toHaveClass("px-5");
    expect(document.getElementById("eigenai-mobile-menu")?.parentElement).toBe(
      mobileNavSurface,
    );
    expect(document.body).toHaveStyle({ overflow: "hidden" });

    fireEvent.keyDown(document, { key: "Escape" });

    expect(
      screen.getByRole("button", { name: "Open navigation menu" }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(document.body).not.toHaveStyle({ overflow: "hidden" });
  });

  it("keeps the existing page on default-off (missing config / error)", async () => {
    // evaluateFlag collapses missing config and evaluation failures to false
    // upstream, so the selector only ever sees a boolean.
    mockEvaluateFlag.mockResolvedValue(false);

    render(await EigenAIFlagged());

    expect(screen.getByTestId("eigenai-existing")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Site" })).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Change theme" })).toBeInTheDocument();
  });
});
