import type { Route } from "./+types/index";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import Index from "~/dict/other/index";
import type { Textbook } from "~/type/textbook";
import { httpClient } from "~/util/http";
import { ArrayUtil } from "~/util/object";
import { DictSourceUtil, OtherDictUtil } from "~/util/dict";
import { StringConst, StringConstUtil } from "~/util/string";

// 路由加载时获取所有层级信息
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  // 只获取前2层, 否则嵌套太深不便于展示也不便于操作
  const textbooks = await httpClient.get<Textbook[]>("/textbook/list/2/all");

  // 转化数据结构供添加和编辑下拉列表使用
  const textbookOptions = ArrayUtil.mapTextbookToOption(textbooks);

  return { textbooks, textbookOptions };
}

// 客户端提交时处理表单操作
export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();

  let source: string = DictSourceUtil.get_fetcher_source(formData);

  if (StringConstUtil.dictOtherSet.has(source)) {
    const req = OtherDictUtil.get_fetcher_form_data(formData);

    if (StringConst.dictTextbookOtherAdd === source) {
      try {
        const res = await OtherDictUtil.add(req);
        if (res && res.id > 0) {
          return { error: "", result: true };
        }
        return { error: "其它类型字典添加失败", result: false };
      } catch (err) {
        return { error: httpClient.getErrorMessage(err), result: false };
      }
    } else {
      try {
        const res = await OtherDictUtil.remove(req);
        if (res) {
          return { error: "", result: true };
        }
        return { error: "其它类型字典删除失败", result: false };
      } catch (err) {
        return { error: httpClient.getErrorMessage(err), result: false };
      }
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
