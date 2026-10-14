// Server-only availability guards. Payload still owns editor authentication.
import { notFound } from "next/navigation";

import { evaluateFlag } from "./server";

/** Check on every render/action, including actions from an already open editor. */
export async function requireCmsAccess(): Promise<void> {
  if (!(await evaluateFlag("CMS-Access"))) notFound();
}

/** Gate before Payload runs and keep both enabled and disabled responses uncached. */
export function withCmsAccess<Args extends unknown[]>(
  handler: (request: Request, ...args: Args) => Promise<Response>,
): (request: Request, ...args: Args) => Promise<Response> {
  return async (request, ...args) => {
    const response = (await evaluateFlag("CMS-Access"))
      ? await handler(request, ...args)
      : Response.json({ error: "Not Found" }, { status: 404 });
    const headers = new Headers(response.headers);
    headers.set("Cache-Control", "no-store");

    return new Response(request.method === "HEAD" ? null : response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  };
}
