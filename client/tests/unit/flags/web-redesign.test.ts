const mockEvaluateFlag = jest.fn();
jest.mock("server-only", () => ({}));
jest.mock("react", () => ({ ...jest.requireActual("react"), cache: (fn: unknown) => fn }));
jest.mock("next/server", () => ({ connection: jest.fn().mockResolvedValue(undefined) }));
jest.mock("@/shared/lib/flags/server", () => ({ evaluateFlag: (...args: unknown[]) => mockEvaluateFlag(...args) }));

import { isWebRedesignEnabled } from "@/shared/lib/flags/web-redesign";

it("uses the shared evaluator for the page and navigation decision", async () => {
  mockEvaluateFlag.mockResolvedValue(true);
  await expect(isWebRedesignEnabled()).resolves.toBe(true);
  expect(mockEvaluateFlag).toHaveBeenCalledWith("Web-Redesign");
  mockEvaluateFlag.mockResolvedValue(false);
  await expect(isWebRedesignEnabled()).resolves.toBe(false);
});

it("restores the legacy experience if the evaluator rejects", async () => {
  mockEvaluateFlag.mockRejectedValue(new Error("Synthetic provider outage"));
  await expect(isWebRedesignEnabled()).resolves.toBe(false);
});
