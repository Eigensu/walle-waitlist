import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(__dirname, "../.env") })

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/api/:path*",
      },
    ]
  },
}

export default nextConfig