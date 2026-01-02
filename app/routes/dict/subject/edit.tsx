import type { Route } from "./+types/edit";
import { LoadingOutlined } from "@ant-design/icons";
import { Alert, Spin } from "antd";
import Edit from "~/dict/subject/edit";
import type { Textbook, UpdateTextbookReq } from "~/type/textbook";
import { httpClient } from "~/util/http";
import { StringValidator } from "~/util/string";
import { redirect } from "react-router";

// 编辑科目时获取详情
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  let reqId = params.id;
  let id = Number(reqId);
  let item: Textbook = {
    id: 0,
    pathDepth: 0,
    label: "",
    key: "",
    parentId: 0,
    sortOrder: 0,
    children: [],
  };

  if (id > 0) {
    item = await httpClient.get<Textbook>(`/textbook/info/${id}`);
  }

  return { item };
}

// 更新科目
export async function clientAction({ request }: Route.ClientActionArgs) {
  let formData = await request.formData();
  // 检查 id
  let reqId = formData.get("id")?.toString() ?? 0;
  let id = Number(reqId);
  if (id <= 0) {
    return { error: "科目信息为空" };
  }

  let label = formData.get("label")?.toString() ?? "";
  if (!StringValidator.isNonEmpty(label)) {
    return { error: "科目名称不能为空" };
  }

  let code = formData.get("code")?.toString() ?? "";
  let sortOrder = formData.get("sortOrder")?.toString() ?? 0;

  let req: UpdateTextbookReq = {
    id: id,
    label: label,
    key: code,
    sortOrder: Number(sortOrder),
  };
  let item = await httpClient.post<Textbook>("/textbook/edit", req);
  // 成功后直接跳转到列表页面
  if (item) {
    return redirect("/dict/subject");
  }

  // 发生错误返回对象
  return { error: "编辑失败" };
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
  return <Spin indicator={<LoadingOutlined spin />} />;
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return loaderData.item.id > 0 ? (
    <Edit item={loaderData.item} />
  ) : (
    <Alert title="科目信息为空, 无法编辑" type="error" />
  );
}
