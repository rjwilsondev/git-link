import { Link, Outlet, useParams } from "react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import { Book02Icon, StarIcon, GitForkIcon } from "@hugeicons/core-free-icons";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { ButtonGroup } from "~/components/ui/button-group";

export default function RepositoryLayout() {
  const { repoName } = useParams();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-muted/10 border-b">
        <div className="mx-auto max-w-7xl px-4 pt-6">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="text-letterpress flex items-center gap-2 text-xl">
              <HugeiconsIcon
                icon={Book02Icon}
                className="text-muted-foreground h-5 w-5"
                size={20}
              />
              <Link to="/" className="text-blue-600 hover:underline">
                ryan
              </Link>
              <span className="text-muted-foreground">/</span>
              <Link
                to={`/repos/${repoName}`}
                className="font-semibold hover:underline"
              >
                {repoName}
              </Link>
              <Badge
                variant="outline"
                className="text-muted-foreground ml-2 font-medium"
              >
                Public
              </Badge>
            </div>

            <ButtonGroup className="shadow-sm">
              <Button variant="outline" size="sm" className="h-8 gap-1.5">
                <HugeiconsIcon icon={GitForkIcon} size={14} />
                Fork
                <span className="bg-muted ml-0.5 rounded-full border px-1.5 py-0.5 text-[10px] font-normal">
                  0
                </span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 border-amber-200 bg-amber-50 bg-[image:var(--golden-gradient)] text-amber-700 shadow-[var(--shimmer-top)] hover:bg-amber-100 hover:text-amber-800"
              >
                <HugeiconsIcon icon={StarIcon} size={14} />
                Star
                <span className="ml-0.5 rounded-full border border-amber-200 bg-amber-100/50 px-1.5 py-0.5 text-[10px] font-normal text-amber-800">
                  0
                </span>
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-8">
        {/* TODO: Fetch real repository data like stars, forks, and description */}
        <Outlet />
      </main>
    </div>
  );
}
