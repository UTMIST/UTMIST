import config from "@payload-config";
import { GRAPHQL_PLAYGROUND_GET } from "@payloadcms/next/routes";

import { withCmsAccess } from "@/shared/lib/server";

export const dynamic = "force-dynamic";

export const GET = withCmsAccess(GRAPHQL_PLAYGROUND_GET(config));
export const HEAD = GET;
