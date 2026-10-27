import type { NextConfig } from "next";

const apiOrigin = (process.env.API_URL || process.env.API_ORIGIN || "http://127.0.0.1:4000").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  experimental: {
    agentUpgrade: "security",
  },
  images: {
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
    // Dev only: on Netlify, /api and /admin are routed by netlify.toml.
    // CMS is the static build in public/admin (same as production) — no separate Vite port.
    if (process.env.NETLIFY || process.env.NODE_ENV !== "development") return [];
    return {
      beforeFiles: [
        { source: "/api/:path*", destination: `${apiOrigin}/api/:path*` },
        // SPA entry (assets under /admin/assets are served from public/ as-is).
        { source: "/admin", destination: "/admin/index.html" },
        { source: "/demo", destination: "/admin/index.html" },
        { source: "/demo/:path*", destination: "/admin/index.html" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
