import path from "node:path";

const nextConfig = {
  transpilePackages: ["@hookforge/shared"],
  outputFileTracingRoot: path.join(process.cwd(), "../..")
};

export default nextConfig;
