import { render, screen } from "@testing-library/react";

const mockRedesignEnabled = jest.fn();
const mockReadAcademics = jest.fn();
jest.mock("@/features/public-site/lib/academics", () => ({ readAcademics: () => mockReadAcademics() }));
jest.mock("@/shared/lib/server", () => ({ isWebRedesignEnabled: () => mockRedesignEnabled() }));
jest.mock("@/features/public-site/pages/ml-fundamentals", () => ({ __esModule: true, default: () => <div data-testid="legacy-academics" /> }));
jest.mock("@/features/public-site/pages/academics-redesign", () => ({ __esModule: true, default: () => <div data-testid="academics-redesign" /> }));

import Academics from "@/app/(frontend)/ml-fundamentals/page";
import Archive from "@/app/(frontend)/ml-fundamentals/2025/page";

it.each([false, true, false])("selects academics for the current shared flag decision (%s)", async (enabled) => {
  mockReadAcademics.mockClear();
  mockRedesignEnabled.mockResolvedValue(enabled);
  render(await Academics());
  expect(screen.getByTestId(enabled ? "academics-redesign" : "legacy-academics")).toBeInTheDocument();
  expect(screen.queryByTestId(enabled ? "legacy-academics" : "academics-redesign")).not.toBeInTheDocument();
  expect(mockReadAcademics).toHaveBeenCalledTimes(enabled ? 1 : 0);
});

it("keeps the archive available independently of the redesign flag", () => {
  mockRedesignEnabled.mockClear();
  render(<Archive />);
  expect(screen.getByTestId("legacy-academics")).toBeInTheDocument();
  expect(mockRedesignEnabled).not.toHaveBeenCalled();
});
