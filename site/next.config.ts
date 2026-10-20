import type { NextConfig } from "next";

const apiOrigin = process.env.API_ORIGIN ?? "http://localhost:4000";
const cmsOrigin = process.env.CMS_ORIGIN ?? "http://localhost:5174";

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    // Dev only: in production builds (including `netlify deploy` from a laptop, where NETLIFY
    // is unset) /api, /admin and /demo are routed by netlify.toml instead.
    if (process.env.NETLIFY || process.env.NODE_ENV !== "development") return [];
    return {
      beforeFiles: [
        { source: "/api/:path*", destination: `${apiOrigin}/api/:path*` },
        { source: "/admin", destination: `${cmsOrigin}/admin` },
        { source: "/admin/:path*", destination: `${cmsOrigin}/admin/:path*` },
        { source: "/demo", destination: `${cmsOrigin}/demo` },
        { source: "/demo/:path*", destination: `${cmsOrigin}/demo/:path*` },
      ],
      afterFiles: [],
      // The CMS is a Vite app; its module and asset URLs are served from cmsOrigin.
      fallback: [{ source: "/:path*", destination: `${cmsOrigin}/:path*` }],
    };
  },
};

export default nextConfig;
