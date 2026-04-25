import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['react-force-graph-2d', 'd3-force', 'three'],
};

export default nextConfig;
