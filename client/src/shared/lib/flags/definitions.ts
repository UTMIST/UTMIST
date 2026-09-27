// Internal server-only SDK declarations. Feature code uses evaluateFlag through
// the server barrel so the production guard always runs before overrides.
import {
  createFlagsDiscoveryEndpoint,
  flag,
  getProviderData,
  type Flag,
} from "flags/next";

import { evaluateProviderFlag } from "./provider";
import { flagCatalog } from "./catalog";
import type { EvaluationContext } from "./types";

export const flagDefinitions: Readonly<
  Record<string, Flag<boolean, EvaluationContext>>
> = Object.fromEntries(
  Object.entries(flagCatalog).map(([key, metadata]) => [
    key,
    flag<boolean, EvaluationContext>({
      ...metadata,
      key,
      decide: ({ entities }) => evaluateProviderFlag(key, entities),
    }),
  ]),
);

export const discoveryHandler = createFlagsDiscoveryEndpoint(() =>
  getProviderData(flagDefinitions),
);
