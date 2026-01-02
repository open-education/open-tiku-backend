import type {Route} from "./+types/add";
import {LoadingOutlined} from "@ant-design/icons";
import {Spin} from "antd";
import Add from "~/dict/subject/add";
import type {CreateTextbookReq, Textbook} from "~/type/textbook";
import {httpClient} from "~/util/http";
import {StringValidator} from "~/util/string";
import {redirect} from "react-router";

export async function clientLoader({params}: Route.ClientLoaderArgs) {
  return {};
}

export async function clientAction({request}: Route.ClientActionArgs) {
  let formData = await request.formData();
  let label = formData.get("label")?.toString() ?? "";
  if (!StringValidator.isNonEmpty(label)) {
    return {error: "科目名称不能为空"};
  }

  let code = formData.get("code")?.toString() ?? "";
  let sortOrder = formData.get("sortOrder")?.toString() ?? 0;

  let req: CreateTextbookReq = {
    label: label,
    key: code,
    pathDepth: 1,
    sortOrder: Number(sortOrder),
  };
  let item = await httpClient.post<Textbook>("/textbook/add", req);
  // 成功后直接跳转到列表页面
  if (item) {
    return redirect("/dict/subject");
  }

  // 发生错误返回对象
  return {error: "提交失败"};
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
  return <Spin indicator={<LoadingOutlined spin/>}/>;
}

export default function Home({loaderData}: Route.ComponentProps) {
  return <Add/>;
}
