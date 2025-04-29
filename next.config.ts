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
};

export default nextConfig;
