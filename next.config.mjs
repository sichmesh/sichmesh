/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  // The web flasher lives in its own repository and subdomain.
  async redirects() {
    return [
      {
        source: "/flash",
        destination: "https://flasher.sichmesh.org",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
