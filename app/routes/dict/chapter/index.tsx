import type {Route} from "./+types/index";
import {httpClient} from "~/util/http";
import type {Textbook, TextbookFetcherReq} from "~/type/textbook";
import {ArrayUtil} from "~/util/object";
import {Spin} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import Index from "~/dict/chapter/index";
import {StringConstUtil, StringValidator} from "~/util/string";
import {TextbookReqUtil} from "~/util/dict";

// 路由加载时获取所有层级信息
export async function clientLoader({params}: Route.ClientLoaderArgs) {
  // 只获取前6层, 否则嵌套太深不便于展示也不便于操作
  const textbooks = await httpClient.get<Textbook[]>("/textbook/list/6/all");

  // 转化数据结构供添加和编辑下拉列表使用
  const textbookOptions = ArrayUtil.mapTextbookToOption(textbooks);

  return {textbooks, textbookOptions};
}

// 客户端提交时处理表单操作
export async function clientAction({request}: Route.ClientActionArgs) {
  const formData = await request.formData();
  let req: TextbookFetcherReq = TextbookReqUtil.get_fetcher_form_data(formData);
  if (!StringValidator.isNonEmpty(req.label)) {
    return {error: "节点名称不能为空", result: false};
  }

  // 如果存在 reqId 则认为是更新操作
  if (StringConstUtil.dictChapterNameEditSet.has(req.source)) {
    let res = await TextbookReqUtil.edit(req);
    if (res && res.id > 0) {
      return {result: true};
    }

    // 发生错误返回对象
    return {error: "节点追加编辑失败", result: false};
  } else if (StringConstUtil.dictChapterNameAddSet.has(req.source)) {
    let res = await TextbookReqUtil.add(req);
    if (res && res.id > 0) {
      return {result: true};
    }

    // 发生错误返回对象
    return {error: "节点追加提交失败", result: false};
  } else {
    return {error: "未知行为", result: false};
  }
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
  return <Spin indicator={<LoadingOutlined spin/>}/>;
}

export default function Home({loaderData}: Route.ComponentProps) {
  return <Index
    textbooks={loaderData.textbooks}
    textbookOptions={loaderData.textbookOptions}
  />
}
