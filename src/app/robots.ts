import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://loyapara-services.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/Dashboard/", // আপনার ড্যাশবোর্ড পেজটি Google-এ শো করবে না
        "/api/",       // ব্যাকএন্ড এপিআই রাউটগুলো হাইড থাকবে
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}