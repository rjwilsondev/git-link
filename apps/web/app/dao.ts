import type { RepositoryTree, TreeEntry } from "~/types";

export const GIT_SERVER_URL = process.env.GIT_SERVER_URL || "http://localhost:8080";

export async function getRepositories() {
    const reposEndpoint = `${GIT_SERVER_URL}/api/repos`;
    const response = await fetch(reposEndpoint);
    return response.json();
}

export async function getRepositoryTree(repoName: string, branch: string = "main", path: string = "") {
    const reposEndpoint = `${GIT_SERVER_URL}/api/repos/${repoName}/tree/${branch}/${path}`;
    const response = await fetch(reposEndpoint);
    return response.json() as Promise<RepositoryTree>;
}

export async function getRepositoryBlob(repoName: string, hash: string) {
    const reposEndpoint = `${GIT_SERVER_URL}/api/repos/${repoName}/blob/${hash}`;
    const response = await fetch(reposEndpoint);
    return response.json() as Promise<string>;
}