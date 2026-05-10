import { Link, Outlet, useParams } from "react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Book02Icon,
  StarIcon,
  GitForkIcon
} from "@hugeicons/core-free-icons";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

export default function RepositoryLayout() {
  const { repoName } = useParams();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-muted/10 border-b">
        <div className="max-w-7xl mx-auto px-4 pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 text-xl">
              <HugeiconsIcon icon={Book02Icon} className="text-muted-foreground w-5 h-5" size={20} />
              <Link to="/" className="text-blue-500 hover:underline">ryan</Link>
              <span className="text-muted-foreground">/</span>
              <Link to={`/repos/${repoName}`} className="font-semibold hover:underline">{repoName}</Link>
              <Badge variant="outline" className="ml-2 font-medium text-muted-foreground">
                Public
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5 h-8">
                <HugeiconsIcon icon={GitForkIcon} size={14} />
                Fork
                <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-muted text-[10px] font-normal">0</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 h-8 text-yellow-600 border-yellow-200 bg-yellow-50/50 hover:bg-yellow-100 hover:text-yellow-700">
                <HugeiconsIcon icon={StarIcon} size={14} />
                Star
                <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-yellow-100 text-[10px] font-normal text-yellow-700">0</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* TODO: Fetch real repository data like stars, forks, and description */}
        <Outlet />
      </main>
    </div>
  );
}
