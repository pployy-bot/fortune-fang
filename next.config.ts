const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config, { isServer }) {
    if (!isServer) {
      config.devtool = false; // Disable source maps for the client-side
    }
    return config;
  },
};

export default nextConfig;
