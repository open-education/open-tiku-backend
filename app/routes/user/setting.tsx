import type { Route } from "./+types/setting";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return {};
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <div>hello setting</div>;
}
