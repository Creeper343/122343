
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Warnung: Dies erlaubt den Build, auch wenn TypeScript-Fehler vorhanden sind.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;