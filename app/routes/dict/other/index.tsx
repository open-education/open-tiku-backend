import type {Route} from "./+types/index";
import {LoadingOutlined} from "@ant-design/icons";
import {Spin} from "antd";
import Index from "~/dict/other/index";
import type {Textbook} from "~/type/textbook";
import {httpClient} from "~/util/http";
import {ArrayUtil} from "~/util/object";
import {DictSourceUtil} from "~/util/dict";

// 路由加载时获取所有层级信息
export async function clientLoader({params}: Route.ClientLoaderArgs) {
  // 只获取前5层, 否则嵌套太深不便于展示也不便于操作
  const textbooks = await httpClient.get<Textbook[]>("/textbook/list/3/all");

  // 转化数据结构供添加和编辑下拉列表使用
  const textbookOptions = ArrayUtil.mapTextbookToOption(textbooks);

  return {textbooks, textbookOptions};
}

// 客户端提交时处理表单操作
export async function clientAction({request}: Route.ClientActionArgs) {
  const formData = await request.formData();

  let source: string = DictSourceUtil.get_fetcher_source(formData);
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
  return <Spin indicator={<LoadingOutlined spin/>}/>;
}

export default function Home({loaderData}: Route.ComponentProps) {
  return <Index
    textbooks={loaderData.textbooks}
    textbookOptions={loaderData.textbookOptions}
  />;
}
