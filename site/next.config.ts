import type { NextConfig } from "next";

const apiOrigin = (process.env.API_URL || process.env.API_ORIGIN || "http://127.0.0.1:4000").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  // Used by deploy/vps Docker image (smaller runtime).
  output: "standalone",
  experimental: {
    agentUpgrade: "security",
  },
  images: {
    // Allow local paths with cache-bust query (e.g. /Herosection/Cross_vision.png?v=3).
    // Default Next pattern is `{ pathname: '**', search: '' }`, which rejects any `?…`.
    localPatterns: [{ pathname: "/**" }],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
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
    // CMS SPA entry (assets under /admin/assets are static files).
    const adminSpa = [
      { source: "/admin", destination: "/admin/index.html" },
      { source: "/demo", destination: "/admin/index.html" },
      { source: "/demo/:path*", destination: "/admin/index.html" },
    ]
    // Netlify uses netlify.toml for /api and /admin.
    if (process.env.NETLIFY) return []
    // Local next dev: proxy API to Express.
    if (process.env.NODE_ENV === "development") {
      return {
        beforeFiles: [
          { source: "/api/:path*", destination: `${apiOrigin}/api/:path*` },
          ...adminSpa,
        ],
        afterFiles: [],
        fallback: [],
      }
    }
    // VPS / Node production: nginx proxies /api; Next still must map /admin → index.html.
    return { beforeFiles: adminSpa, afterFiles: [], fallback: [] }
  },
};

export default nextConfig;
