import { useLoaderData } from "react-router";
import type { Route } from "./+types/repository-blob";
import { Button } from "~/components/ui/button";
import { LocalGitService } from "~/features/git.server";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Blob" },
    { name: "description", content: "View file content." },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const repoName = params.repoName!;
  const hash = params.hash!;
  const gitService = new LocalGitService(repoName);
  const blobContent = await gitService.getBlobContent(hash);
  return { blobContent };
}

export const RepositoryBlob = () => {
  const { blobContent } = useLoaderData<typeof loader>();
  return (
    <div className="bg-background overflow-hidden rounded-lg border">
      <div className="bg-muted/30 flex items-center justify-between border-b px-4 py-2">
        <div className="text-muted-foreground font-mono text-sm">
          Raw content
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Raw
          </Button>
          <Button variant="outline" size="sm">
            Blame
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto p-4">
        <pre className="font-mono text-sm leading-relaxed break-all whitespace-pre-wrap">
          {blobContent}
        </pre>
      </div>
    </div>
  );
};

export default RepositoryBlob;
