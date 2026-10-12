import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://silkverse.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/account",
          "/account/*",
          "/checkout",
          "/order-success",
          "/verify-otp",
          "/verify-registration",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
