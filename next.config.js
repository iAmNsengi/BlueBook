/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    configAsync: true,
  },
};

// Now you can export an async function
module.exports = async () => {
  // Perform async operations here
  return nextConfig;
};
