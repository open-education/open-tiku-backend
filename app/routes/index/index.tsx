import type { Route } from "./+types/index";
import Index from "~/index/index";
import Login from "~/index/login";

export function meta({}: Route.MetaArgs) {
  return [{ title: "开放题库管理" }, { name: "description", content: "开放题库管理教材, 用户等信息管理" }];
}

// 检查是否登录
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return {
    login: true,
  };
}

// 后台入口
export default function Home({ loaderData }: Route.ComponentProps) {
  return loaderData.login ? <Index /> : <Login />;
}
