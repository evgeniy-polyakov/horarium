/** @type {import('next').NextConfig} */
const nextConfig = process.env.DEV ? {} :
    {
        output: 'export',
        distDir: 'docs',
        basePath: '/tabula-csv-editor',
    };

module.exports = nextConfig
