import type { Route } from "./+types/index";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return {};
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <div>hello user</div>;
}
