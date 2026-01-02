import type {Route} from "./+types/index";
import {LoadingOutlined} from "@ant-design/icons";
import {Spin} from "antd";
import Index from "~/dict/subject/index";
import type {Textbook} from "~/type/textbook";
import {httpClient} from "~/util/http";

export async function clientLoader({params}: Route.ClientLoaderArgs) {
  // 获取教材目录
  let items = await httpClient.get<Textbook[]>("textbook/list/1");
  return {items};
}

export async function clientAction({request}: Route.ClientActionArgs) {

}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
  return <Spin indicator={<LoadingOutlined spin/>}/>;
}

export default function Home({loaderData}: Route.ComponentProps) {
  return <Index items={loaderData.items}/>;
}
