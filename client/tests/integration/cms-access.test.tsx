/** @jest-environment node */
// Use the real shared evaluator/guards and actual entry points. Replace only
// provider IO and Payload runtime boundaries; disabled requests must stop there.
import type { ServerFunctionClient } from "payload";
import { NextRequest, NextResponse } from "next/server";

import { middleware } from "@/middleware";
import PayloadLayout from "@/app/(payload)/layout";
import CmsPage, { generateMetadata } from "@/app/(payload)/cms/[[...segments]]/page";
import CmsNotFound from "@/app/(payload)/cms/[[...segments]]/not-found";
import * as rest from "@/app/(payload)/cms-api/[...slug]/route";
import * as graphql from "@/app/(payload)/cms-api/cms-graphql/route";
import * as playground from "@/app/(payload)/cms-graphql-playground/route";
import CmsUnavailablePage from "@/app/(frontend)/cms-unavailable/page";

const mockEvaluate = jest.fn();
const mockUpdateSession = jest.fn();
const mockRest = {
  GET: jest.fn(), POST: jest.fn(), DELETE: jest.fn(),
  PATCH: jest.fn(), PUT: jest.fn(), OPTIONS: jest.fn(),
};
const mockGraphql = jest.fn();
const mockPlayground = jest.fn();
const mockRootPage = jest.fn();
const mockMetadata = jest.fn();
const mockNotFoundPage = jest.fn();
const mockServerFunctions = jest.fn();

jest.mock("@vercel/flags-core", () => ({
  createClient: () => ({ evaluate: (...args: unknown[]) => mockEvaluate(...args) }),
}));
jest.mock("next/navigation", () => ({
  notFound: () => { throw new Error("NEXT_HTTP_ERROR_FALLBACK;404"); },
}));
jest.mock("@/shared/lib/server", () => ({
  ...jest.requireActual("@/shared/lib/flags/cms"),
  ...jest.requireActual("@/shared/lib/flags/server"),
  updateSession: (...args: unknown[]) => mockUpdateSession(...args),
}));
jest.mock("../../payload.config", () => ({
  __esModule: true,
  default: Promise.resolve({}),
}));
jest.mock("@/app/(payload)/cms/importMap.js", () => ({ importMap: {} }));
jest.mock("@payloadcms/next/css", () => ({}));
jest.mock("@payloadcms/next/layouts", () => ({
  RootLayout: jest.fn(),
  handleServerFunctions: (...args: unknown[]) => mockServerFunctions(...args),
}));
jest.mock("@payloadcms/next/views", () => ({
  RootPage: (...args: unknown[]) => mockRootPage(...args),
  generatePageMetadata: (...args: unknown[]) => mockMetadata(...args),
  NotFoundPage: (...args: unknown[]) => mockNotFoundPage(...args),
}));
jest.mock("@payloadcms/next/routes", () => ({
  REST_GET: () => (...args: unknown[]) => mockRest.GET(...args),
  REST_POST: () => (...args: unknown[]) => mockRest.POST(...args),
  REST_DELETE: () => (...args: unknown[]) => mockRest.DELETE(...args),
  REST_PATCH: () => (...args: unknown[]) => mockRest.PATCH(...args),
  REST_PUT: () => (...args: unknown[]) => mockRest.PUT(...args),
  REST_OPTIONS: () => (...args: unknown[]) => mockRest.OPTIONS(...args),
  GRAPHQL_POST: () => (...args: unknown[]) => mockGraphql(...args),
  GRAPHQL_PLAYGROUND_GET: () => (...args: unknown[]) => mockPlayground(...args),
}));

const originalEnv = process.env;
const payloadMocks = [...Object.values(mockRest), mockGraphql, mockPlayground, mockRootPage,
  mockMetadata, mockNotFoundPage, mockServerFunctions];

function flagResult(value: unknown, cacheStatus = "HIT", reason = "fallthrough") {
  mockEvaluate.mockResolvedValue({ value, reason, metrics: { cacheStatus } });
}

beforeEach(() => {
  process.env = { ...originalEnv, VERCEL_ENV: "preview", FLAGS: "synthetic-key" };
  delete process.env.FLAGS_SECRET;
  mockEvaluate.mockReset();
  mockUpdateSession.mockReset().mockImplementation(async () => NextResponse.next());
  for (const mock of payloadMocks) mock.mockReset();
  flagResult(false);
});

afterEach(() => { process.env = originalEnv; });

describe("CMS page routing", () => {
  const cmsPaths = ["/cms", "/cms/login", "/cms/create-first-user", "/cms/collections/proofs", "/cms/unknown", "/cms/unknown.png", "/cms-graphql-playground"];

  it.each(cmsPaths.flatMap((path) => ["GET", "HEAD"].map((method) => ({ path, method }))))(
    "rewrites disabled $method $path to the frontend 404", async ({ path, method }) => {
      const request = new NextRequest(`http://localhost${path}?test=synthetic`, { method });
      const response = await middleware(request);
      expect(response.headers.get("x-middleware-rewrite")).toBe("http://localhost/cms-unavailable?test=synthetic");
      expect(response.headers.get("Cache-Control")).toBe("no-store");
      expect(mockEvaluate).toHaveBeenCalledWith("CMS-Access", false);
      expect(request.nextUrl.pathname).toBe(path);
      for (const mock of payloadMocks) expect(mock).not.toHaveBeenCalled();
    },
  );

  it("keeps refreshed Supabase cookies and RSC request headers in the rewrite", async () => {
    const sessionResponse = NextResponse.next();
    sessionResponse.cookies.set("synthetic-session", "refreshed", { httpOnly: true, path: "/" });
    mockUpdateSession.mockResolvedValue(sessionResponse);
    const request = new NextRequest("http://localhost/cms", { headers: { RSC: "1", cookie: "synthetic-session=old" } });
    const response = await middleware(request);
    expect(mockUpdateSession).toHaveBeenCalledWith(request);
    expect(response.cookies.get("synthetic-session")).toMatchObject({ value: "refreshed", httpOnly: true, path: "/" });
    expect(response.headers.get("x-middleware-request-rsc")).toBe("1");
    expect(response.headers.get("x-middleware-request-cookie")).toBe("synthetic-session=old");
  });

  it("passes enabled pages through and follows off → on → off", async () => {
    for (const enabled of [false, true, false]) {
      flagResult(enabled);
      const response = await middleware(new NextRequest("http://localhost/cms"));
      expect(response.headers.has("x-middleware-rewrite")).toBe(!enabled);
    }
  });

  it.each([
    ["missing definition", false, "HIT", "error"],
    ["stale enabled fallback", true, "STALE", "fallthrough"],
    ["enabled error fallback", true, "HIT", "error"],
    ["non-boolean value", "true", "HIT", "fallthrough"],
  ])("rewrites pages to the frontend 404 for %s", async (_label, value, cacheStatus, reason) => {
    flagResult(value, String(cacheStatus), String(reason));
    expect((await middleware(new NextRequest("http://localhost/cms"))).headers.get("x-middleware-rewrite"))
      .toBe("http://localhost/cms-unavailable");
  });

  it("rewrites pages to the frontend 404 when the provider rejects", async () => {
    mockEvaluate.mockRejectedValue(new Error("provider disconnected"));
    expect((await middleware(new NextRequest("http://localhost/cms"))).headers.get("x-middleware-rewrite"))
      .toBe("http://localhost/cms-unavailable");
  });

  it.each([
    { path: "/cms", method: "POST" },
    { path: "/cms-api/proofs", method: "GET" },
    { path: "/cms-api/playground", method: "GET" },
    { path: "/dashboard", method: "GET" },
    { path: "/cms-other", method: "GET" },
    { path: "/", method: "GET" },
  ])("leaves $method $path to the existing session/route gates", async ({ path, method }) => {
    const sessionResponse = NextResponse.next();
    mockUpdateSession.mockResolvedValue(sessionResponse);
    const response = await middleware(new NextRequest(`http://localhost${path}`, { method }));
    expect(response).toBe(sessionResponse);
    expect(mockEvaluate).not.toHaveBeenCalled();
  });

  it("always renders the frontend not-found boundary at the rewrite destination", () => {
    expect(() => CmsUnavailablePage()).toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    for (const mock of payloadMocks) expect(mock).not.toHaveBeenCalled();
  });
});

const restMethods = ["GET", "HEAD", "POST", "DELETE", "PATCH", "PUT", "OPTIONS"] as const;
const restPaths = ["proofs", "cms-users/login", "cms-users/init", "cms-users/me"];
const graphqlBodies = [
  "query { Proofs { docs { title status } } }",
  'mutation { createProof(data: { title: "Synthetic", message: "Test", status: draft }) { id } }',
];
const apiCases = [
  ...restPaths.flatMap((path) => restMethods.map((method) => ({
    path: `/cms-api/${path}`, method, handler: rest[method], payload: mockRest[method === "HEAD" ? "GET" : method],
    args: { params: Promise.resolve({ slug: path.split("/") }) }, body: undefined as string | undefined,
  }))),
  ...graphqlBodies.map((body) => ({
    path: "/cms-api/cms-graphql", method: "POST", handler: graphql.POST, payload: mockGraphql,
    args: { params: Promise.resolve({ slug: ["cms-graphql"] }) }, body,
  })),
  {
    path: "/cms-api/cms-graphql", method: "OPTIONS", handler: graphql.OPTIONS, payload: mockRest.OPTIONS,
    args: { params: Promise.resolve({ slug: ["cms-graphql"] }) }, body: undefined,
  },
  ...(["GET", "HEAD"] as const).map((method) => ({
    path: "/cms-graphql-playground", method, handler: playground[method], payload: mockPlayground,
    args: { params: Promise.resolve({ slug: [] }) }, body: undefined,
  })),
];

function requestFor(testCase: typeof apiCases[number]) {
  return new Request(`http://localhost${testCase.path}`, {
    method: testCase.method,
    headers: { cookie: "payload-token=existing-editor-session", "Content-Type": "application/json" },
    body: testCase.body ? JSON.stringify({ query: testCase.body }) : undefined,
  });
}

describe("CMS API availability", () => {
  it.each(apiCases)("blocks $method $path before Payload, even with an editor session", async (testCase) => {
    const response = await testCase.handler(requestFor(testCase), testCase.args);
    expect(response.status).toBe(404);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    if (testCase.method === "HEAD") expect(await response.text()).toBe("");
    else expect(await response.json()).toEqual({ error: "Not Found" });
    for (const mock of payloadMocks) expect(mock).not.toHaveBeenCalled();
    expect(mockEvaluate).toHaveBeenCalledWith("CMS-Access", false);
  });

  it.each(apiCases)("passes enabled $method $path to Payload without changing auth results", async (testCase) => {
    flagResult(true);
    testCase.payload.mockImplementation(async () => new Response("authentication required", {
      status: 401, headers: { "Set-Cookie": "payload-token=; Max-Age=0", "Cache-Control": "public, max-age=600" },
    }));
    const request = requestFor(testCase);
    const response = await testCase.handler(request, testCase.args);
    expect(testCase.payload).toHaveBeenCalledWith(request, testCase.args);
    expect(response.status).toBe(401);
    expect(response.headers.get("Set-Cookie")).toBe("payload-token=; Max-Age=0");
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.text()).toBe(testCase.method === "HEAD" ? "" : "authentication required");
  });

  it.each([
    ["missing definition", false, "HIT", "error"],
    ["stale enabled fallback", true, "STALE", "fallthrough"],
    ["enabled error fallback", true, "HIT", "error"],
    ["non-boolean value", "true", "HIT", "fallthrough"],
  ])("denies all APIs for %s", async (_label, value, cacheStatus, reason) => {
    flagResult(value, String(cacheStatus), String(reason));
    for (const testCase of apiCases) {
      expect((await testCase.handler(requestFor(testCase), testCase.args)).status).toBe(404);
    }
    for (const mock of payloadMocks) expect(mock).not.toHaveBeenCalled();
  });

  it("denies all APIs when provider evaluation rejects", async () => {
    mockEvaluate.mockRejectedValue(new Error("provider disconnected"));
    for (const testCase of apiCases) {
      expect((await testCase.handler(requestFor(testCase), testCase.args)).status).toBe(404);
    }
    for (const mock of payloadMocks) expect(mock).not.toHaveBeenCalled();
  });

  it("follows off → on → off on successive requests using the same editor cookie", async () => {
    mockRest.GET.mockImplementation(async () => Response.json({ docs: [{ id: "synthetic-proof" }] }));
    const testCase = apiCases[0];
    for (const enabled of [false, true, false]) {
      flagResult(enabled);
      expect((await testCase.handler(requestFor(testCase), testCase.args)).status).toBe(enabled ? 200 : 404);
    }
    expect(mockRest.GET).toHaveBeenCalledTimes(1);
  });
});

function pageArgs(segments: string[]) {
  return { params: Promise.resolve({ segments }), searchParams: Promise.resolve({}) };
}

describe("CMS pages, metadata and actions", () => {
  it.each([[], ["login"], ["create-first-user"], ["collections", "proofs"], ["unknown"]].map((segments) => ({ segments })))(
    "denies page/metadata and not-found rendering before Payload for $segments", async ({ segments }) => {
      const args = pageArgs(segments);
      await expect(CmsPage(args)).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
      await expect(generateMetadata(args)).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
      await expect(CmsNotFound(args)).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
      for (const mock of payloadMocks) expect(mock).not.toHaveBeenCalled();
    },
  );

  it("denies direct layout rendering before mounting Payload when disabled", async () => {
    await expect(PayloadLayout({ children: "not-found-boundary" })).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    for (const mock of payloadMocks) expect(mock).not.toHaveBeenCalled();
  });

  it("passes enabled page, metadata and missing paths to Payload", async () => {
    flagResult(true);
    const args = pageArgs(["login"]);
    mockRootPage.mockResolvedValue("editor-login");
    mockMetadata.mockResolvedValue({ title: "CMS" });
    mockNotFoundPage.mockResolvedValue("payload-not-found");
    await expect(CmsPage(args)).resolves.toBe("editor-login");
    await expect(generateMetadata(args)).resolves.toEqual({ title: "CMS" });
    await expect(CmsNotFound(args)).resolves.toBe("payload-not-found");
    for (const mock of [mockRootPage, mockMetadata, mockNotFoundPage]) {
      expect(mock).toHaveBeenCalledWith(expect.objectContaining(args));
    }
  });

  it("rechecks a direct action from a previously loaded editor after disablement", async () => {
    flagResult(true);
    const layout = await PayloadLayout({ children: null });
    const action = layout.props.serverFunction as ServerFunctionClient;
    const args = { name: "synthetic-action", args: {} };
    mockServerFunctions.mockResolvedValue({ authenticated: true });
    await expect(action(args)).resolves.toEqual({ authenticated: true });
    expect(mockServerFunctions).toHaveBeenCalledWith(expect.objectContaining(args));
    mockServerFunctions.mockClear();

    flagResult(false);
    await expect(action(args)).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    mockEvaluate.mockRejectedValue(new Error("provider unavailable"));
    await expect(action(args)).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    expect(mockServerFunctions).not.toHaveBeenCalled();
    await expect(CmsPage(pageArgs(["collections", "proofs"]))).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    expect(mockRootPage).not.toHaveBeenCalled();
  });
});
