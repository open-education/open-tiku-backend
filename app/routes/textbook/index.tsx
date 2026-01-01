import type {Route} from "./+types/index";
import {LoadingOutlined} from "@ant-design/icons";
import {Spin} from "antd";
import type {MenuItem} from "~/type/menu";

export async function clientLoader({params}: Route.ClientLoaderArgs) {
  // 教材相关信息维护
  let leftMenuItems: MenuItem[] = [
    {
      key: "textbook",
      label: "教材"
    },
    {
      key: "knowledge",
      label: "知识点"
    },
    {
      key: "tag",
      label: "标签"
    },
    {
      key: "question_type",
      label: "题型"
    },
  ];
  return {
    leftMenuItems
  };
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
  return <Spin indicator={<LoadingOutlined spin/>}/>;
}

export default function Home({loaderData}: Route.ComponentProps) {
  return <div>hello</div>
}
