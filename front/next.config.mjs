/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ucarecdn.com",
            },
            {
                protocol: "https",
                hostname: "advanced-practice.vercel.app",
            },
            {
                protocol: "https",
                hostname: "img.freepik.com",
            },
            {
                protocol: "http",
                hostname: "18.144.26.113"
            },
            {
                protocol: "https",
                hostname: "ec2-18-144-26-113.us-west-1.compute.amazonaws.com"
            }
        ],
    },
};

export default nextConfig;
