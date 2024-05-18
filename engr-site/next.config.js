/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    serverActionsOutputDirectory: './actions/auth',
    serverActionsOutputPackageJson: true,
  },
}

module.exports = nextConfig