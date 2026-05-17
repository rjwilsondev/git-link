import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router";
import {
  Search01Icon,
  StarIcon,
  Add01Icon,
  Book02Icon,
} from "@hugeicons/core-free-icons";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import type { Repository } from "~/db/schema";

export function ReposList({ repos }: { repos: Repository[] }) {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-8">
      {/* Header Section */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Repositories</h1>
        <Link to="/repos/new">
          <Button size="sm">
            <HugeiconsIcon
              icon={Add01Icon}
              className="mr-2 h-4 w-4"
              size={16}
            />{" "}
            New
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <HugeiconsIcon
            icon={Search01Icon}
            className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
            size={16}
          />
          <Input placeholder="Find a repository..." className="pl-10" />
        </div>
        <Button variant="secondary">Type</Button>
        <Button variant="secondary">Language</Button>
        <Button variant="secondary">Sort</Button>
      </div>

      <Separator />

      {/* Repo List */}
      <ul className="divide-border divide-y">
        {repos.map((repo) => (
          <li key={repo.name} className="flex items-start justify-between py-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={Book02Icon}
                  className="text-muted-foreground h-4 w-4"
                  size={16}
                />
                <Link
                  to={`/repos/${repo.name}`}
                  className="text-xl font-semibold text-blue-500 hover:underline"
                >
                  {repo.name}
                </Link>
              </div>
            </div>

            <Button variant="outline" size="sm" className="h-8">
              <HugeiconsIcon
                icon={StarIcon}
                className="mr-2 h-4 w-4"
                size={16}
              />{" "}
              Star
            </Button>
          </li>
        ))}
      </ul>

      {repos.length === 0 && (
        <div className="text-muted-foreground mt-4 rounded-lg border border-dashed py-12 text-center">
          No repositories found.
        </div>
      )}
    </div>
  );
}
