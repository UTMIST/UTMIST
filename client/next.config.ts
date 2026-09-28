import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";
import createWithVercelToolbar from "@vercel/toolbar/plugins/next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gqqgsvhzonratwkmjiji.supabase.co",
        port: "",
        pathname: "/storage/v1/object/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/**",
      },
    ],
  },
};

const withVercelToolbar = createWithVercelToolbar();

export default withVercelToolbar(withPayload(nextConfig));
