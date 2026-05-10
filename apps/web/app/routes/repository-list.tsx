import { Welcome } from "../features/repos/repos";
import { useLoaderData } from "react-router";
import type { Route } from "./+types/repository-list";
import { getRepositories } from "~/dao";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Repositories" },
    { name: "description", content: "Explore available repositories." },
  ];
}

export async function loader() {
  const repositories = await getRepositories();
  return { repositories };
}

export const RepositoryList = () => {
  const { repositories } = useLoaderData<typeof loader>();
  return <Welcome repos={repositories} />;
}

export default RepositoryList