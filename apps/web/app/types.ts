export type EntryType = "blob" | "tree" | "commit" | "tag";

export type TreeEntry = {
    mode: string;
    type: EntryType;
    hash: string;
    name: string;
};

export type RepositoryTree = {
    branch: string;
    entries: TreeEntry[];
};
