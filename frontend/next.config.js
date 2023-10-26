/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("bufferutil", "utf-8-validate");
    return config;
  },
};

module.exports = nextConfig;
