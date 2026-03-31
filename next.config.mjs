/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    // images: {
    //     domains: ["", ""],
    // },

    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'res.cloudinary.com' },
            { protocol: 'https', hostname: 'media4.giphy.com' },
            { protocol: 'https', hostname: 'picsum.photos' },
            { protocol: 'https', hostname: 'randomuser.me' },
        ]
    }
};

export default nextConfig;
