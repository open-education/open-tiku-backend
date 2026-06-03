import type { Route } from "./+types/index";
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

export default function Home({ loaderData }: Route.ComponentProps) {
  return <Index textbookOptions={loaderData.textbookOptions} />;
}
