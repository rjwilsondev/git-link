/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly REPOS_PATH: string;
    readonly DB_PATH: string;
    // add more variables here...
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}