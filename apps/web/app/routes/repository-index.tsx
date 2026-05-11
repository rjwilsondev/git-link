import { Link, useLoaderData, useNavigate } from "react-router";
import type { Route } from "./+types/repository-index";
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
import { Separator } from "~/components/ui/separator";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Repository" },
        { name: "description", content: "Explore the repository files." },
    ];
}

export async function loader({ params }: Route.LoaderArgs) {
    // TODO: Handle branch selection in UI
    const { repoName, branch = "main" } = params;
    const tree = await getRepositoryTree(repoName!, branch, "");
    return { tree, repoName, branch };
}

const Display = ({ tree, repoName, branch, navigate }: { tree: RepositoryTree, repoName: string, branch: string, navigate: (path: string) => void }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-3 space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="bg-muted/50">
                            <span className="text-muted-foreground font-normal">Branch:</span>
                            <span>{branch}</span>
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" >
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
                            tree.map((entry) => {
                                const to = entry.type === "blob"
                                    ? `/repos/${repoName}/blob/${entry.hash}`
                                    : `/repos/${repoName}/tree/${branch}/${entry.name}`;

                                return (
                                    <TableRow
                                        key={entry.name}
                                        className="group cursor-pointer border-b border-border/50 last:border-0"
                                        onClick={() => navigate(to)}
                                    >
                                        <TableCell className="w-10 pr-0 pl-4">
                                            <HugeiconsIcon
                                                icon={entry.type === "tree" ? Folder01Icon : File01Icon}
                                                className={`w-4 h-4 ${entry.type === "tree" ? "text-blue-500" : "text-muted-foreground"}`}
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

            <div className="md:col-span-1 space-y-6">
                <section className="space-y-4">
                    <section>
                        <h3 className="font-semibold text-sm mb-2">About</h3>
                        <p className="text-sm text-muted-foreground">
                            {/* TODO: Fetch real description */}
                            A high-performance git service and web interface clone built with React Router v7 and Go.
                        </p>
                    </section>

                    <Separator />

                    <section>
                        <h3 className="font-semibold text-sm mb-3 text-letterpress">Languages</h3>
                        <div className="space-y-3">
                            <div className="flex h-3 rounded-full overflow-hidden bg-muted border border-black/5 shadow-inner">
                                <div className="bg-blue-500 w-[64.2%] bg-glossy" title="TypeScript"></div>
                                <div className="bg-orange-500 w-[31.8%] bg-glossy" title="Go"></div>
                                <div className="bg-gray-400 w-[4.0%] bg-glossy" title="Other"></div>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm border border-black/10"></span>
                                    <span className="font-medium text-foreground">TypeScript</span>
                                    <span className="text-muted-foreground">64.2%</span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm border border-black/10"></span>
                                    <span className="font-medium text-foreground">Go</span>
                                    <span className="text-muted-foreground">31.8%</span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-gray-400 shadow-sm border border-black/10"></span>
                                    <span className="font-medium text-foreground">Other</span>
                                    <span className="text-muted-foreground">4.0%</span>
                                </span>
                            </div>
                        </div>
                    </section>

                    <Separator />

                    <section className="text-sm space-y-2">
                        <div className="flex items-center justify-between text-muted-foreground">
                            <span>Commits</span>
                            <span className="font-medium text-foreground">12</span>
                        </div>
                        <div className="flex items-center justify-between mt-2 text-muted-foreground">
                            <span>Branches</span>
                            <span className="font-medium text-foreground">1</span>
                        </div>
                        <div className="flex items-center justify-between mt-2 text-muted-foreground">
                            <span>Tags</span>
                            <span className="font-medium text-foreground">0</span>
                        </div>
                    </section>
                </section>
            </div>
        </div>
    )
}

export const RepositoryIndex = () => {
    const { tree, repoName, branch } = useLoaderData<typeof loader>();
    const navigate = useNavigate();

    return <Display tree={tree} repoName={repoName!} branch={branch} navigate={navigate} />;
}

export default RepositoryIndex