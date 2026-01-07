import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Fix: Explicitly set workspace root to prevent Next.js from inferring wrong parent directory
  // This resolves the "multiple package-lock.json" warning when lockfiles exist in parent folders
  
  // Windows EPERM Fix: Disable Turbopack, use webpack compiler instead
  // Turbopack has known issues with Windows Desktop folders + OneDrive sync
  // Remove this once project is moved to C:\dev or exclusions are added
  experimental: {
    turbo: undefined, // Disable turbopack
  },
  
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
