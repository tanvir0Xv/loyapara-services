import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://loyapara-services.vercel.app";
  
  // ১. আপনার বর্তমান স্ট্যাটিক পেজগুলো
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/lostFound`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/emergency`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // ২. ডায়নামিক সার্ভিস/মিস্ত্রি পেজগুলোর জন্য (অপশনাল কিন্তু দারুণ কাজের)
  let dynamicServices: MetadataRoute.Sitemap = [];
  
  try {
    // উদাহরণ: আপনার ডাটাবেজ বা API থেকে সার্ভিস বা ক্যাটাগরির লিস্ট আনা
    const res = await fetch(`${baseUrl}/api/services`, { next: { revalidate: 3600 } });
    const services = await res.json(); // ধরুন ডেটা আসলো: [{ slug: 'electrician' }, { slug: 'plumber' }]

    dynamicServices = services.map((service: { slug: string; updatedAt?: string }) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: service.updatedAt ? new Date(service.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Sitemap dynamic fetch failed:", error);
    // কোনো কারণে API ফেইল করলে সাইট যেন ক্রাশ না করে, তাই খালি অ্যারে থাকবে
    dynamicServices = [];
  }

  // স্ট্যাটিক এবং ডায়নামিক সব একসাথে মার্চ করে রিটার্ন করা
  return [...staticPages, ...dynamicServices];
}