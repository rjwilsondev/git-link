import { Link, useLoaderData, useNavigate } from "react-router";
import type { Route } from "./+types/repository-index";
import type { RepositoryTree, TreeEntry } from "~/types";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Folder01Icon,
  File01Icon,
  GitBranchIcon,
} from "@hugeicons/core-free-icons";
import { getBranches, getRepositoryTree } from "~/dao";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Table, TableBody, TableCell, TableRow } from "~/components/ui/table";
import { Separator } from "~/components/ui/separator";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Repository" },
    { name: "description", content: "Explore the repository files." },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const { repoName } = params;
  const [tree, branches] = await Promise.all([
    getRepositoryTree(repoName!),
    getBranches(repoName!),
  ]);
  return { tree, repoName, branches };
}

const Display = ({
  tree,
  repoName,
  branches,
  navigate,
}: {
  tree: RepositoryTree;
  repoName: string;
  branches: string[];
  navigate: (path: string) => void;
}) => {
  const currentBranch = tree.branch;
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
      <div className="space-y-4 md:col-span-3">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Select
              value={currentBranch}
              onValueChange={(value) =>
                navigate(`/repos/${repoName}/tree/${value}`)
              }
            >
              <SelectTrigger className="bg-muted/50 w-[160px]">
                <div className="flex items-center gap-1.5">
                  <b>Branch: </b> {currentBranch}
                </div>
              </SelectTrigger>
              <SelectContent>
                {branches.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline">Go to file</Button>
          </div>
        </div>

        <Table className="bg-card overflow-hidden rounded-lg border-none shadow-[var(--machined-shadow)]">
          <TableBody>
            <TableRow className="border-border border-b bg-[image:var(--header-gradient)] hover:bg-[image:var(--header-gradient)]">
              <TableCell
                colSpan={2}
                className="text-muted-foreground text-letterpress px-4 py-2 text-sm font-medium"
              >
                Latest commit info would go here...
              </TableCell>
            </TableRow>
            {tree.entries.map((entry) => {
              const to =
                entry.type === "blob"
                  ? `/repos/${repoName}/blob/${entry.hash}`
                  : `/repos/${repoName}/tree/${currentBranch}/${entry.name}`;

              return (
                <TableRow
                  key={entry.name}
                  className="group border-border/50 cursor-pointer border-b last:border-0"
                  onClick={() => navigate(to)}
                >
                  <TableCell className="w-10 pr-0 pl-4">
                    <HugeiconsIcon
                      icon={entry.type === "tree" ? Folder01Icon : File01Icon}
                      className={`text-muted-foreground h-4 w-4`}
                      size={16}
                    />
                  </TableCell>
                  <TableCell className="px-3">
                    <Link
                      to={to}
                      className="text-sm font-medium transition-colors hover:text-blue-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {entry.name}
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-6 md:col-span-1">
        <section className="space-y-4">
          <section>
            <h3 className="mb-2 text-sm font-semibold">About</h3>
            <p className="text-muted-foreground text-sm">
              {/* TODO: Fetch real description */}A high-performance git service
              and web interface clone built with React Router v7 and Go.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="text-letterpress mb-3 text-sm font-semibold">
              Languages
            </h3>
            <div className="space-y-3">
              <div className="bg-muted flex h-3 overflow-hidden rounded-full border border-black/5 shadow-inner">
                <div
                  className="bg-glossy w-[64.2%] bg-blue-500"
                  title="TypeScript"
                ></div>
                <div
                  className="bg-glossy w-[31.8%] bg-orange-500"
                  title="Go"
                ></div>
                <div
                  className="bg-glossy w-[4.0%] bg-gray-400"
                  title="Other"
                ></div>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full border border-black/10 bg-blue-500 shadow-sm"></span>
                  <span className="text-foreground font-medium">
                    TypeScript
                  </span>
                  <span className="text-muted-foreground">64.2%</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full border border-black/10 bg-orange-500 shadow-sm"></span>
                  <span className="text-foreground font-medium">Go</span>
                  <span className="text-muted-foreground">31.8%</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full border border-black/10 bg-gray-400 shadow-sm"></span>
                  <span className="text-foreground font-medium">Other</span>
                  <span className="text-muted-foreground">4.0%</span>
                </span>
              </div>
            </div>
          </section>

          <Separator />

          <section className="space-y-2 text-sm">
            <div className="text-muted-foreground flex items-center justify-between">
              <span>Commits</span>
              <span className="text-foreground font-medium">12</span>
            </div>
            <div className="text-muted-foreground mt-2 flex items-center justify-between">
              <span>Branches</span>
              <span className="text-foreground font-medium">1</span>
            </div>
            <div className="text-muted-foreground mt-2 flex items-center justify-between">
              <span>Tags</span>
              <span className="text-foreground font-medium">0</span>
            </div>
          </section>
        </section>
      </div>
    </div>
  );
};

export const RepositoryIndex = () => {
  const { tree, repoName, branches } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Display
      tree={tree}
      repoName={repoName!}
      branches={branches}
      navigate={navigate}
    />
  );
};

export default RepositoryIndex;
