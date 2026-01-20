import type { Route } from "./+types/index";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import Index from "~/question/index";
import { httpClient } from "~/util/http";
import type { Textbook } from "~/type/textbook";
import { ArrayUtil } from "~/util/object";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const textbooks = await httpClient.get<Textbook[]>("/textbook/list/5/all");

  // 转化数据结构供添加和编辑下拉列表使用
  const textbookOptions = ArrayUtil.mapTextbookToOption(textbooks);

  return { textbookOptions };
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
  return <Spin indicator={<LoadingOutlined spin />} />;
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <Index textbookOptions={loaderData.textbookOptions} />;
}
