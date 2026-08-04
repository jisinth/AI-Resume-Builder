/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Produces a minimal, self-contained server bundle for the Docker image.
  // On Windows without Developer Mode enabled, this step needs symlink
  // permissions and can fail locally with EPERM — that's a Windows-only
  // dev-machine limitation, not an issue in Linux CI/Docker builds.
  output: 'standalone',
  transpilePackages: ['@ai-resume-builder/types', '@ai-resume-builder/utils', '@ai-resume-builder/ui'],
  eslint: {
    dirs: ['app', 'components', 'lib', 'hooks'],
  },
};

export default nextConfig;
