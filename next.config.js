/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    images: {
        domains: [
            'res.cloudinary.com',
            'avatars.githubusercontent.com',
            'lh3.googleusercontent.com'
        ]
    }
}
module.exports = {
    webpack5: true,
    webpack: config => {
        config.resolve.fallback = {
            fs: false,
        };

        return config;
    },
};

module.exports = nextConfig