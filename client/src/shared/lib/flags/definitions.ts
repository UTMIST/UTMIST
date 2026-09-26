// Internal server-only SDK declarations. Feature code uses evaluateFlag through
// the server barrel so the production guard always runs before overrides.
import {
  createFlagsDiscoveryEndpoint,
  flag,
  getProviderData,
  type Flag,
} from "flags/next";

import { evaluateProviderFlag } from "./provider";
import type { EvaluationContext } from "./types";

const eigenAIRedesign = flag<boolean, EvaluationContext>({
  key: "Eigen-AI-Redesign",
  description: "Toggle the new 2026 EigenAI Website",
  origin: "https://vercel.com/utmist-infrastructure/client/flag/Eigen-AI-Redesign",
  defaultValue: false,
  options: [
    { value: false, label: "Off" },
    { value: true, label: "On" },
  ],
  decide: ({ entities }) => evaluateProviderFlag("Eigen-AI-Redesign", entities),
});

export const flagDefinitions: Readonly<
  Record<string, Flag<boolean, EvaluationContext>>
> = {
  [eigenAIRedesign.key]: eigenAIRedesign,
};

export const discoveryHandler = createFlagsDiscoveryEndpoint(() =>
  getProviderData(flagDefinitions),
);
