import type { NextConfig } from "next";
import path from "path";

const emptyModule = path.resolve(__dirname, "src/empty-module.ts");

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@opentelemetry/winston-transport": emptyModule,
      "drizzle-orm": emptyModule,
      "require-in-the-middle": emptyModule,
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      "@opentelemetry/winston-transport": "./src/empty-module.ts",
      "drizzle-orm": "./src/empty-module.ts",
      "require-in-the-middle": "./src/empty-module.ts",
    },
  },
};

export default nextConfig;