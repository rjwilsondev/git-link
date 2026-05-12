import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/repository-list.tsx"),
    route("repos/new", "routes/repository-new.tsx"),
    route("repos/:repoName", "routes/repository-layout.tsx", [
        index("routes/repository-index.tsx", { id: "repo-index" }),
        route("tree/:branch/*", "routes/repository-tree.tsx", { id: "repo-tree" }),
        route("blob/:hash", "routes/repository-blob.tsx")
    ])
] satisfies RouteConfig;
