import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'storagesignalogos.blob.core.windows.net',
				pathname: '/**',
			},
		],
	},
};

export default nextConfig;
