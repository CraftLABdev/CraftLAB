/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["assets.coingecko.com"],
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { ...config.resolve.fallback, fs: false, net: false, tls: false }

    // Suppress WalletConnect / pino-pretty noise
    config.resolve.alias = {
      ...config.resolve.alias,
      "pino-pretty": false,
    }
    config.ignoreWarnings = [
      { module: /virtualMasterPool/ },
      { module: /pino/ },
    ]

    return config
  },
}
export default nextConfig
