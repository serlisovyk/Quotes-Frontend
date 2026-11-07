import {
  SECURITY_HEADERS,
  SECURITY_HEADERS_SOURCE,
} from './src/constants/security.constant.js'

const nextConfig = {
  output: 'standalone',
  reactCompiler: true,
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  agentRules: false,
  headers: async () => [
    { source: SECURITY_HEADERS_SOURCE, headers: SECURITY_HEADERS },
  ],
}

export default nextConfig
