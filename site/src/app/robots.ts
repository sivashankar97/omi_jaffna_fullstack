import type { MetadataRoute } from "next"

import { site } from "@/config/site"

const privatePaths = [
  "/admin",
  "/api/",
  "/dashboard",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/cms-blocks",
]

export default function robots(): MetadataRoute.Robots {
  const rule = { allow: ["/", "/api/files/"], disallow: privatePaths }
  return {
    rules: [
      { userAgent: ["OAI-SearchBot", "ChatGPT-User"], ...rule },
      { userAgent: "*", ...rule },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  }
}
