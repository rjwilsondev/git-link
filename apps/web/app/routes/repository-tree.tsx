import { Link, useLoaderData, useNavigate } from "react-router";
import type { Route } from "./+types/repository-tree";
import type { RepositoryTree, TreeEntry } from "~/types";
import { HugeiconsIcon } from "@hugeicons/react";
import { Folder01Icon, File01Icon } from "@hugeicons/core-free-icons";
import { getRepositoryTree } from "~/dao";
import { Button } from "~/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableRow
} from "~/components/ui/table";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import React from "react";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Repository Tree" },
    ];
}

export async function loader({ params }: Route.LoaderArgs) {
    const { repoName, branch = "main" } = params;
    const path = params["*"] || "";
    const tree = await getRepositoryTree(repoName!, branch, path);
    return { tree, repoName, branch, path };
}

export const RepositoryTreeViewer = () => {
    const { tree, repoName, branch, path } = useLoaderData<typeof loader>();
    const navigate = useNavigate();
    const pathSegments = path.split("/").filter(Boolean);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="bg-muted/50">
                        <span className="text-muted-foreground font-normal">Branch:</span>
                        <span>{branch}</span>
                    </Button>

                    <Breadcrumb className="ml-4">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink>
                                    <Link to={`/repos/${repoName}`} className="text-blue-500 font-medium">{repoName}</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {pathSegments.map((segment, index) => (
                                <React.Fragment key={index}>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink>
                                            <Link
                                                to={`/repos/${repoName}/tree/${branch}/${pathSegments.slice(0, index + 1).join("/")}`}
                                                className="text-blue-500"
                                            >
                                                {segment}
                                            </Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                </React.Fragment>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        Go to file
                    </Button>
                </div>
            </div>

            <Table className="border-none shadow-[var(--machined-shadow)] rounded-lg overflow-hidden bg-card">
                <TableBody>
                    <TableRow className="bg-[image:var(--header-gradient)] hover:bg-[image:var(--header-gradient)] border-b border-border">
                        <TableCell colSpan={2} className="text-sm text-muted-foreground py-2 px-4 font-medium text-letterpress">
                            Latest commit info would go here...
                        </TableCell>
                    </TableRow>
                    {
                        tree.entries.map((entry) => {
                            const to = entry.type === "blob"
                                ? `/repos/${repoName}/blob/${entry.hash}`
                                : `/repos/${repoName}/tree/${branch}/${path ? path + "/" : ""}${entry.name}`;

                            return (
                                <TableRow
                                    key={entry.name}
                                    className="group cursor-pointer border-b border-border/50 last:border-0"
                                    onClick={() => navigate(to)}
                                >
                                    <TableCell className="w-10 pr-0 pl-4">
                                        <HugeiconsIcon
                                            icon={Folder01Icon}
                                            className={`w-4 h-4 text-muted-foreground`}
                                            size={16}
                                        />
                                    </TableCell>
                                    <TableCell className="px-3">
                                        <Link
                                            to={to}
                                            className="text-sm font-medium hover:text-blue-600 transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {entry.name}
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    }
                </TableBody>
            </Table>
        </div>
    );
}

export default RepositoryTreeViewer;
