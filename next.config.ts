import type { NextConfig } from "next";
import dotenvSafeConfig from "./src/config/dotenvSafeConfig";
import packageJson from "./package.json";

// 合并 dotenvSafeConfig 和 packageJson.version
const envOptions = {
  ...dotenvSafeConfig,
  VERSION: packageJson.version,
};

console.log("envOptions", envOptions);

const nextConfig: NextConfig = {
  /* config options here */
  env: envOptions,
  reactStrictMode: true,
  sassOptions: {
    implementation: 'sass-embedded',
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ]
  },

};

export default nextConfig;
