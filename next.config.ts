import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  redirects() {
    return [
      // The back office has no index page: /app opens the dashboard.
      { source: "/app", destination: "/app/dashboard", permanent: false },
      // "Contrats & Baux" was split into management and rent agreements; old links open the leases.
      { source: "/app/contrats", destination: "/app/contrats-location", permanent: false },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
