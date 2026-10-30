import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Админы зураг, PDF upload (server action) — анхдагч 1MB хязгаарыг нэмэгдүүлнэ.
  experimental: {
    serverActions: { bodySizeLimit: "30mb" },
  },
  // Схемийн PDF-үүд private/ дотор (public биш) — татах route-ийн serverless bundle-д оруулна.
  outputFileTracingIncludes: {
    "/api/patterns/[id]/download": ["./private/patterns/**/*"],
  },
  // Хуучин дэлгүүрийн хаягууд шинэ /products, /materials хуудас руу шилжинэ (id нь хуучин slug-тай ижил).
  async redirects() {
    return [
      { source: "/shop", destination: "/products", permanent: false },
      { source: "/shop/finished", destination: "/products", permanent: false },
      { source: "/shop/supplies", destination: "/materials", permanent: false },
      { source: "/shop/finished/:id", destination: "/products/:id", permanent: false },
      { source: "/shop/supplies/:id", destination: "/materials/:id", permanent: false },
    ];
  },
  images: {
    // Админаас оруулсан барааны зургууд Supabase Storage-д хадгалагдана.
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
};

export default nextConfig;
