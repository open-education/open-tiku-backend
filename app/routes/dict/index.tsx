import type { Route } from "./+types/index";
import Index from "~/dict/index";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return {};
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <Index />;
}
