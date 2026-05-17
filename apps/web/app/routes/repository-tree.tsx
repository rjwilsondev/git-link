import { Link, useLoaderData, useNavigate } from "react-router";
import type { Route } from "./+types/repository-tree";
import type { RepositoryTree, TreeEntry } from "~/types";
import { HugeiconsIcon } from "@hugeicons/react";
import { Folder01Icon, File01Icon } from "@hugeicons/core-free-icons";
import { Button } from "~/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "~/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import React from "react";
import { LocalGitService } from "~/features/git.server";

export function meta({ }: Route.MetaArgs) {
  return [{ title: "Repository Tree" }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const { repoName, branch = "main" } = params;
  const path = params["*"] || "";
  const gitService = new LocalGitService(repoName!);
  const treeEntries = await gitService.getTreeEntries(branch, path);
  return { treeEntries, repoName, branch, path };
}

export const RepositoryTreeViewer = () => {
  const { treeEntries, repoName, branch, path } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const pathSegments = path.split("/").filter(Boolean);

  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-muted/50">
            <span className="text-muted-foreground font-normal">Branch:</span>
            <span>{branch}</span>
          </Button>

          <Breadcrumb className="ml-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>
                  <Link
                    to={`/repos/${repoName}`}
                    className="font-medium text-blue-500"
                  >
                    {repoName}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {pathSegments.map((segment, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink>
                      <Link
                        to={`/repos/${repoName}/treeEntries/${branch}/${pathSegments.slice(0, index + 1).join("/")}`}
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
          {treeEntries.map((entry) => {
            const to =
              entry.type === "blob"
                ? `/repos/${repoName}/blob/${entry.hash}`
                : `/repos/${repoName}/tree/${branch}/${path ? path + "/" : ""}${entry.name}`;

            return (
              <TableRow
                key={entry.name}
                className="group border-border/50 cursor-pointer border-b last:border-0"
                onClick={() => navigate(to)}
              >
                <TableCell className="w-10 pr-0 pl-4">
                  <HugeiconsIcon
                    icon={Folder01Icon}
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
  );
};

export default RepositoryTreeViewer;
