import type { RepositoryTree, TreeEntry } from "~/types";

export const GIT_SERVER_URL = process.env.GIT_SERVER_URL || "http://localhost:8080";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);
    if (!response.ok) {
        const message = await response.text().catch(() => "Unknown API Error");
        throw new Error(`[${response.status}] ${message}`);
    }
    return response.json();
}

export async function getRepositories() {
    return request<string[]>(`${GIT_SERVER_URL}/api/repos`);
}

export async function getBranches(repoName: string) {
    return request<string[]>(`${GIT_SERVER_URL}/api/repos/${repoName}/branches`);
}

export async function getRepositoryTree(repoName: string, branch?: string, path?: string) {
    let url: string

    if (branch && path) {
        url = `${GIT_SERVER_URL}/api/repos/${repoName}/tree/${branch}/${path}`;
    } else if (branch) {
        url = `${GIT_SERVER_URL}/api/repos/${repoName}/tree/${branch}`;
    } else {
        // Match the Go route: /api/repos/{repoName}
        url = `${GIT_SERVER_URL}/api/repos/${repoName}`;
    }

    return request<RepositoryTree>(url);
}

export async function getRepositoryBlob(repoName: string, hash: string) {
    return request<string>(`${GIT_SERVER_URL}/api/repos/${repoName}/blob/${hash}`);
}

export async function createRepository(name: string) {
    return request<any>(`${GIT_SERVER_URL}/api/repos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
    });
}