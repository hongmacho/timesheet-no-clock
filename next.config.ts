import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['better-sqlite3'],
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
}

export default nextConfig
