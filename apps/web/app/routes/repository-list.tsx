import { ReposList } from "../features/repos/repos";
import { useLoaderData } from "react-router";
import type { Route } from "./+types/repository-list";
import { RepositoryService } from "~/features/git.server";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Repositories" },
    { name: "description", content: "Explore available repositories." },
  ];
}

const repoService = new RepositoryService()

export async function loader() {
  const repositories = await repoService.getRepositories();
  return { repositories };
}

export const RepositoryList = () => {
  const { repositories } = useLoaderData<typeof loader>();
  return <ReposList repos={repositories} />;
};

export default RepositoryList;
