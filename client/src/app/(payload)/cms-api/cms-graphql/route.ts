import config from "@payload-config";
import { GRAPHQL_POST, REST_OPTIONS } from "@payloadcms/next/routes";

import { withCmsAccess } from "@/shared/lib/server";

export const dynamic = "force-dynamic";

export const POST = withCmsAccess(GRAPHQL_POST(config));
export const OPTIONS = withCmsAccess(REST_OPTIONS(config));
