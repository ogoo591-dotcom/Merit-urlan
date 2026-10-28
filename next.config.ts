import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Админаас оруулсан барааны зургууд Supabase Storage-д хадгалагдана.
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
};

export default nextConfig;
