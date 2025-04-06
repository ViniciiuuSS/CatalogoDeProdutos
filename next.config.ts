import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // basePath não deve ser definido a menos que necessário, como em subpastas
};

export default withFlowbiteReact(nextConfig);
