import type { Route } from "./+types/account";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return {};
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <div>hello account</div>;
}
