import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    // 监听本机所有网络接口
    host: "0.0.0.0",
    // 指定开发服务器端口, 不可用时直接报错
    port: 5174,
    // 允许通过这些域名访问开发服务器
    allowedHosts: ["admin-tiku.test"],
  },
});
