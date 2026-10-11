import config from "@payload-config";
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from "@payloadcms/next/routes";
import "@payloadcms/next/css";

import { withCmsAccess } from "@/shared/lib/server";

export const dynamic = "force-dynamic";

export const GET = withCmsAccess(REST_GET(config));
export const HEAD = GET;
export const POST = withCmsAccess(REST_POST(config));
export const DELETE = withCmsAccess(REST_DELETE(config));
export const PATCH = withCmsAccess(REST_PATCH(config));
export const PUT = withCmsAccess(REST_PUT(config));
export const OPTIONS = withCmsAccess(REST_OPTIONS(config));
