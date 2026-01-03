import type {Route} from "./+types/index";
import {LoadingOutlined} from "@ant-design/icons";
import {Spin} from "antd";
import Index from "~/dict/textbook/index";
import type {CreateTextbookReq, Textbook, UpdateTextbookReq} from "~/type/textbook";
import {httpClient} from "~/util/http";
import {ArrayUtil} from "~/util/object";
import {StringConst, StringValidator} from "~/util/string";

// 路由加载时获取所有层级信息
export async function clientLoader({params}: Route.ClientLoaderArgs) {
  // 只获取前5层, 否则嵌套太深不便于展示也不便于操作
  const textbooks = await httpClient.get<Textbook[]>("/textbook/list/5/all");

  // 转化数据结构供添加和编辑下拉列表使用
  const textbookOptions = ArrayUtil.mapTextbookToOption(textbooks);

  return {textbooks, textbookOptions};
}

// 客户端提交时处理表单操作
export async function clientAction({request}: Route.ClientActionArgs) {
  const formData = await request.formData();
  const label = formData.get("label")?.toString() ?? "";
  if (!StringValidator.isNonEmpty(label)) {
    return {error: "菜单名称不能为空", result: false};
  }

  // 来源未指定则不做处理
  const source = formData.get("source")?.toString() ?? "";
  const reqId = Number(formData.get("id")?.toString() ?? 0);
  const code = formData.get("code")?.toString() ?? "";
  const sortOrder = Number(formData.get("sortOrder")?.toString() ?? 0);
  // parentId 为空或0时不传递给后端, 否则会破坏 NULL 值
  const parentId = Number(formData.get("parentId")?.toString() ?? 0);
  const pathDepth = Number(formData.get("pathDepth")?.toString() ?? 1);

  // 如果存在 reqId 则认为是更新操作
  if (StringConst.dictTextbookEdit === source) {
    let editReq: UpdateTextbookReq = {
      id: reqId,
      label: label,
      key: code,
      sortOrder: Number(sortOrder),
      pathDepth: pathDepth,
    };
    if (parentId > 0) {
      editReq.parentId = parentId;
    }
    let res = await httpClient.post<Textbook>("/textbook/edit", editReq);
    if (res && res.id > 0) {
      return {result: true};
    }

    // 发生错误返回对象
    return {error: "编辑失败", result: false};
  } else if (StringConst.dictTextbookAdd === source) {
    const addReq: CreateTextbookReq = {
      label: label,
      key: code,
      pathDepth: pathDepth,
      sortOrder: sortOrder,
    };
    if (parentId > 0) {
      addReq.parentId = parentId;
    }
    let res = await httpClient.post<Textbook>("/textbook/add", addReq);
    if (res && res.id > 0) {
      return {result: true};
    }

    // 发生错误返回对象
    return {error: "菜单提交失败", result: false};
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
  />;
}
