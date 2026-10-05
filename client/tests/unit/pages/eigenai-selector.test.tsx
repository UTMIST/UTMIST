import { fireEvent, render, screen } from "@testing-library/react";

const mockEvaluateFlag = jest.fn();
const mockGetCurrentUser = jest.fn();

jest.mock("@/shared/lib/server", () => ({
  evaluateFlag: (...args: unknown[]) => mockEvaluateFlag(...args),
  getCurrentUser: () => mockGetCurrentUser(),
}));

jest.mock("@/shared/ui/client", () => ({
  Navbar: () => <nav data-testid="standard-navigation" />,
}));

jest.mock("react-intersection-observer", () => ({
  useInView: () => ({ ref: jest.fn(), inView: false }),
}));

import EigenAIFlagged from "@/features/public-site/pages/eigenaiFlagged";
import { dynamic, generateMetadata } from "@/app/(frontend)/eigenai/page";

describe("EigenAI flag selector", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCurrentUser.mockImplementation(() => {
      throw new Error("This public toggle must not load a user profile");
    });
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = "test-maps-key";
  });

  it("renders /eigenai dynamically so the flag is read per request", () => {
    expect(dynamic).toBe("force-dynamic");
  });

  it("selects metadata according to the redesign flag", async () => {
    mockEvaluateFlag.mockResolvedValueOnce(true).mockResolvedValueOnce(false);

    expect(await generateMetadata()).not.toEqual({});
    expect(await generateMetadata()).toEqual({});
    expect(mockEvaluateFlag).toHaveBeenCalledWith("Eigen-AI-Redesign");
    expect(mockGetCurrentUser).not.toHaveBeenCalled();
  });

  it("selects the existing page when the flag is off", async () => {
    mockEvaluateFlag.mockResolvedValue(false);

    render(await EigenAIFlagged());

    expect(screen.getByTestId("standard-navigation")).toBeInTheDocument();
    expect(screen.queryByTestId("eigenai-redesign")).not.toBeInTheDocument();
    expect(mockEvaluateFlag).toHaveBeenCalledWith("Eigen-AI-Redesign");
    expect(mockGetCurrentUser).not.toHaveBeenCalled();
  });

  it("selects the redesign when the flag is on", async () => {
    mockEvaluateFlag.mockResolvedValue(true);

    render(await EigenAIFlagged());

    expect(screen.getByTestId("eigenai-redesign")).toBeInTheDocument();
    expect(screen.queryByTestId("standard-navigation")).not.toBeInTheDocument();
    expect(mockGetCurrentUser).not.toHaveBeenCalled();
  });

  it("opens and dismisses the redesign mobile navigation", async () => {
    mockEvaluateFlag.mockResolvedValue(true);

    const { container } = render(await EigenAIFlagged());
    const toggle = container.querySelector<HTMLButtonElement>(
      'button[aria-controls="eigenai-mobile-menu"]',
    )!;

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(document.getElementById("eigenai-mobile-menu")).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById("eigenai-mobile-menu")).not.toBeInTheDocument();
    expect(document.body.style.overflow).not.toBe("hidden");
  });
});
