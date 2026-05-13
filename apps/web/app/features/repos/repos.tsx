import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router";
import { Search01Icon, StarIcon, Add01Icon, Book02Icon } from "@hugeicons/core-free-icons";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

export function ReposList({ repos }: { repos: string[] }) {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-8">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Repositories</h1>
        <Link to="/repos/new">
          <Button size="sm" >
            <HugeiconsIcon icon={Add01Icon} className="w-4 h-4 mr-2" size={16} /> New
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" size={16} />
          <Input placeholder="Find a repository..." className="pl-10" />
        </div>
        <Button variant="secondary">Type</Button>
        <Button variant="secondary">Language</Button>
        <Button variant="secondary">Sort</Button>
      </div>

      <Separator />

      {/* Repo List */}
      <ul className="divide-y divide-border">
        {repos.map((repo) => (
          <li key={repo} className="py-6 flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Book02Icon} className="w-4 h-4 text-muted-foreground" size={16} />
                <Link to={`/repos/${repo}`} className="text-blue-500 hover:underline text-xl font-semibold">
                  {repo}
                </Link>
              </div>
            </div>

            <Button variant="outline" size="sm" className="h-8">
              <HugeiconsIcon icon={StarIcon} className="w-4 h-4 mr-2" size={16} /> Star
            </Button>
          </li>
        ))}
      </ul>

      {repos.length === 0 && (
        <div className="py-12 text-center text-muted-foreground border border-dashed rounded-lg mt-4">
          No repositories found.
        </div>
      )}
    </div>
  );
}
