/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@restaurant-system/trpc"],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.tsx?$/,
      use: [
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      ],
    });
    return config;
  },
};

module.exports = nextConfig; 