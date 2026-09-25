import { render, screen, within } from "@testing-library/react";

// The selector is a server component. Mock the server barrel so no Supabase /
// Vercel Flags code loads, and stub the existing page (heavy: styles, images,
// and a Google Maps env check). The redesign renders for
// real — that also covers its scoped `.eigenai-redesign` wrapper.
const mockEvaluateFlag = jest.fn();
const mockGetCurrentUser = jest.fn();

jest.mock("@/shared/lib/server", () => ({
  evaluateFlag: (...args: unknown[]) => mockEvaluateFlag(...args),
  getCurrentUser: () => mockGetCurrentUser(),
}));

jest.mock("@/features/public-site/pages/eigenai", () => ({
  __esModule: true,
  default: () => <div data-testid="eigenai-existing">existing</div>,
}));

import EigenAIFlagged from "@/features/public-site/pages/eigenaiFlagged";
// `dynamic` is declared on the route segment itself (that's the only place
// Next.js reads it), so assert it there rather than on the selector module.
import { dynamic } from "@/app/(frontend)/eigenai/page";

describe("EigenAI flag selector", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCurrentUser.mockResolvedValue(null);
  });

  it("renders /eigenai dynamically so the flag is read per request", () => {
    expect(dynamic).toBe("force-dynamic");
  });

  it("selects the existing page when the flag is off", async () => {
    mockEvaluateFlag.mockResolvedValue(false);

    render(await EigenAIFlagged());

    expect(screen.getByTestId("eigenai-existing")).toBeInTheDocument();
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
    expect(redesign).toHaveClass("eigenai-redesign");
    const navigation = screen.getByRole("navigation", { name: "EigenAI" });
    expect(navigation).toBeInTheDocument();
    expect(
      within(navigation).getByRole("link", { name: "About" }),
    ).toHaveAttribute("href", "/#about-us");
    expect(
      within(navigation).getByRole("link", { name: "Projects" }),
    ).toHaveAttribute("href", "/projects");
    expect(
      within(navigation).getByRole("link", { name: "Event" }),
    ).toHaveAttribute("href", "/events");
    expect(
      within(navigation).getByRole("link", { name: "Sponsors" }),
    ).toHaveAttribute("href", "/sponsors");
    const loginLink = within(navigation).getByRole("link", { name: "Login" });
    expect(loginLink).toHaveAttribute("href", "/auth");
    expect(loginLink).toHaveClass(
      "eigenai-login-button",
      "eigenai-body",
      "font-normal",
      "tracking-[-0.01em]",
    );
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    const aboutHeading = screen.getByRole("heading", {
      name: /What is eigenai\s*\?/,
    });
    expect(aboutHeading).toBeInTheDocument();
    expect(
      within(aboutHeading).getByTestId("eigenai-wordmark"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Speakers" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Jensen Huang" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Workshops" }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText("Building Applications with the Claude API"),
    ).toHaveLength(3);
    const contentContainers = screen.getAllByTestId("eigenai-content");
    expect(contentContainers.length).toBeGreaterThanOrEqual(5);
    expect(
      contentContainers.every((container) =>
        container.classList.contains("max-w-6xl"),
      ),
    ).toBe(true);
    expect(screen.getByTestId("eigenai-metrics")).toHaveClass(
      "mx-auto",
      "max-w-3xl",
      "gap-y-4",
      "sm:gap-x-0",
      "sm:gap-y-0",
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
    expect(within(lockups[0]).getByTestId("eigenai-wordmark")).toHaveClass(
      "eigenai-wordmark--cursor-cutout",
    );
    expect(within(lockups[1]).getByTestId("eigenai-wordmark")).not.toHaveClass(
      "eigenai-wordmark--cursor-cutout",
    );
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
          .classList.contains("eigenai-instrument-gradient"),
      ),
    ).toBe(true);
    expect(lockups[0]).toHaveStyle({
      fontSize: "clamp(6rem, 15vw, 10.5rem)",
    });
    expect(lockups[1]).toHaveStyle({ fontSize: "clamp(3rem, 8vw, 5rem)" });
    const backdrop = screen.getByTestId("eigenai-continuous-backdrop");
    expect(backdrop.querySelectorAll(".eigenai-background-bloom")).toHaveLength(
      13,
    );
    const orbitClusters = screen.getAllByTestId("eigenai-orbit-cluster");
    expect(orbitClusters).toHaveLength(4);
    expect(screen.getAllByTestId("eigenai-orbit-cloud")).toHaveLength(4);
    expect(orbitClusters[0]).toHaveStyle({ maxWidth: "951.318px" });
    expect(orbitClusters[3]).toHaveStyle({ maxWidth: "1113.84px" });
    const lambdaClusters = screen.getAllByTestId("eigenai-lambda-cluster");
    expect(lambdaClusters).toHaveLength(2);
    for (const cluster of lambdaClusters) {
      expect(cluster.querySelectorAll("img")).toHaveLength(2);
      expect(cluster).toHaveClass("eigenai-lambda-cluster");
    }
    const ringGroups = screen.getAllByTestId("eigenai-ring-group");
    expect(ringGroups).toHaveLength(1);
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
    expect(screen.getByTestId("eigenai-hero")).not.toHaveClass(
      "overflow-hidden",
    );
    expect(screen.getByTestId("eigenai-closing")).not.toHaveClass(
      "overflow-hidden",
    );
    expect(
      screen.getByRole("heading", { name: "Workshops" }).closest("section"),
    ).not.toHaveClass("overflow-hidden");
    expect(
      screen.getByRole("link", { name: "UTMIST on Instagram" }),
    ).toHaveClass("size-11");
    expect(screen.queryByTestId("eigenai-existing")).not.toBeInTheDocument();
  });

  it("keeps the existing page on default-off (missing config / error)", async () => {
    // evaluateFlag collapses missing config and evaluation failures to false
    // upstream, so the selector only ever sees a boolean.
    mockEvaluateFlag.mockResolvedValue(false);

    render(await EigenAIFlagged());

    expect(screen.getByTestId("eigenai-existing")).toBeInTheDocument();
  });
});
