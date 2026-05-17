import { type SimpleGit, simpleGit } from "simple-git";
import type { EntryType, TreeEntry } from "~/types";
import fs from "node:fs/promises"
import path from "node:path";
import { db } from "~/db";
import { repositories, type Repository } from "~/db/schema";
import { eq } from "drizzle-orm";


type RepositoryUpsert = Omit<Repository, "createdAt" | "updatedAt">

export class RepositoryService {
    private db: typeof db
    private reposPath: string
    constructor() {
        this.db = db
        this.reposPath = process.env.REPOS_PATH || import.meta.env?.REPOS_PATH || "../../data/repositories";
    }
    async getRepositories(): Promise<Repository[]> {
        return this.db.select().from(repositories)
    }

    async createRepository(newRepo: RepositoryUpsert): Promise<void> {
        // 1. Check if it already exists in the database
        const existing = await this.db
            .select()
            .from(repositories)
            .where(eq(repositories.name, newRepo.name))
            .then(rows => rows.find(r => r.ownerUser === newRepo.ownerUser));

        if (existing) {
            throw new Error("A repository with this name already exists.");
        }

        // 2. Check disk existence
        const fullPath = path.join(this.reposPath, newRepo.name);
        let existsOnDisk = false;
        try {
            await fs.stat(fullPath);
            existsOnDisk = true;
        } catch {
            // Directory doesn't exist, which is what we want!
        }
        if (existsOnDisk) {
            throw new Error("A repository with this name already exists on disk.");
        }

        // 3. Initialize bare repo on disk
        await simpleGit().init(["--bare", fullPath]);

        // 4. Save to Database
        await this.db.insert(repositories).values(newRepo);
    }
}



interface GitService {
    getBranches(repoName: string): Promise<string[]>
    getDefaultBranch(repoName: string): Promise<string>
    getTreeEntries(treeish: string, path: string): Promise<TreeEntry[]>
    getBlobContent(repoName: string, hash: string): Promise<string>
}

const REPOS_PATH = import.meta.env.REPOS_PATH || "../../data/repositories"

export class LocalGitService implements GitService {
    private git: SimpleGit;

    constructor(repoName: string) {
        console.log("LocalGitService", REPOS_PATH, repoName)
        const repoPath = path.join(REPOS_PATH, repoName)
        console.log({ repoPath })
        this.git = simpleGit(repoPath);
    }

    private async raw(args: string[]): Promise<string> {
        return await this.git.raw(args);
    }

    // TODO: read directly from volume.
    getRepositories(): Promise<string[]> {
        try {
            return fs.readdir(REPOS_PATH)

        } catch (error) {
            // what to do here?
            throw new Error(error instanceof Error ? error.message : String(error));
        }
    }

    async getTreeEntries(treeish: string, path: string) {
        try {
            const treePath = path ? `${treeish}:${path}` : treeish;
            const result = await this.raw(["ls-tree", "-z", "--full-tree", treePath]);
            const entries = result.split("\0").filter((entry) => entry !== "");
            return entries.map((entry) => {
                const [mode, type, hashAndName] = entry.split(" ");
                const [hash, name] = hashAndName.split("\t");
                return {
                    mode,
                    type: type as EntryType,
                    hash,
                    name,
                };
            });
        } catch {
            return []; // Safe fallback for empty/new repositories
        }
    }

    async getBlobContent(hash: string) {
        return await this.git.catFile(["-p", hash]);
    }

    async createRepository(newRepoName: string) {
        const repoPath = path.join(REPOS_PATH, newRepoName)
        const result = await this.git.init(["--bare", repoPath]);
        console.log("createRepository", result)
        return "Ok"
    }

    async getDefaultBranch() {
        try {
            const result = await this.raw(["symbolic-ref", "--short", "HEAD"]);
            return result.trim();
        } catch {
            return "main"; // Safe default for new repositories
        }
    }

    async getBranches() {
        try {
            const result = await this.git.raw(["for-each-ref", "--format=%(refname:short)", "refs/heads"]);
            return result.split("\n").filter((branch) => branch.trim() !== "");
        } catch {
            return []; // Safe fallback for new repositories
        }
    }
}