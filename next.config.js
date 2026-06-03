/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cardapio-foodpronto-images.s3.amazonaws.com" },
      { protocol: "https", hostname: "cardapio-foodpronto-images.s3.sa-east-1.amazonaws.com" },
    ],
  },
};

module.exports = nextConfig;
