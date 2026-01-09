import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Fix: Explicitly set workspace root to prevent Next.js from inferring wrong parent directory
  // This resolves the "multiple package-lock.json" warning when lockfiles exist in parent folders
  
  // Windows EPERM Fix: Disable Turbopack via CLI flag (--no-turbo)
  // Removed invalid experimental.turbo config
};

export default nextConfig;
