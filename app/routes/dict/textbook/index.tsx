import type { Route } from "./+types/index";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import Index from "~/dict/textbook/index";
import type { Textbook, TextbookFetcherReq } from "~/type/textbook";
import { httpClient } from "~/util/http";
import { ArrayUtil } from "~/util/object";
import { StringConst, StringValidator } from "~/util/string";
import { DictSourceUtil, TextbookReqUtil } from "~/util/dict";

// 路由加载时获取所有层级信息
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  // 只获取前5层, 否则嵌套太深不便于展示也不便于操作
  const textbooks = await httpClient.get<Textbook[]>("/textbook/list/5/all");

  // 转化数据结构供添加和编辑下拉列表使用
  const textbookOptions = ArrayUtil.mapTextbookToOption(textbooks);

  return { textbooks, textbookOptions };
}

// 客户端提交时处理表单操作
export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();

  let source: string = DictSourceUtil.get_fetcher_source(formData);

  let req: TextbookFetcherReq = TextbookReqUtil.get_fetcher_form_data(formData);
  if (!StringValidator.isNonEmpty(req.label)) {
    return { error: "菜单名称不能为空", result: false };
  }

  // 这里添加和编辑深度不能超过 5 层
  if (StringConst.dictTextbookMaxDepth < req.pathDepth) {
    return { error: "菜单深度不能超过第5级", result: false };
  }

  // 如果存在 reqId 则认为是更新操作
  if (StringConst.dictTextbookEdit === source) {
    try {
      let res = await TextbookReqUtil.edit(req);
      if (res && res.id > 0) {
        return { result: true };
      }
      return { error: "菜单编辑失败", result: false };
    } catch (err) {
      return { error: httpClient.getErrorMessage(err), result: false };
    }
  } else if (StringConst.dictTextbookAdd === source) {
    try {
      let res = await TextbookReqUtil.add(req);
      if (res && res.id > 0) {
        return { result: true };
      }
      return { error: "菜单提交失败", result: false };
    } catch (err) {
      return { error: httpClient.getErrorMessage(err), result: false };
    }
  } else {
    return { error: "未知行为", result: false };
  }
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
  return <Spin indicator={<LoadingOutlined spin />} />;
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <Index textbooks={loaderData.textbooks} textbookOptions={loaderData.textbookOptions} />;
}
