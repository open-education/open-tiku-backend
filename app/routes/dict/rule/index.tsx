import type { Route } from "./+types/index";
import Index from "~/dict/rule/index";
import type { Textbook } from "~/type/textbook";
import { httpClient } from "~/util/http";
import { ArrayUtil } from "~/util/object";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  // 只获取前2层, 否则嵌套太深不便于展示也不便于操作
  console.log("clientLoader 开始执行");
  const textbooks = await httpClient.get<Textbook[]>("/textbook/list/2/all");
  console.log("请求成功", textbooks);

  // 转化数据结构供添加和编辑下拉列表使用
  const textbookOptions = ArrayUtil.mapTextbookToOption(textbooks);

  return { textbookOptions };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <Index textbookOptions={loaderData.textbookOptions} />;
}
