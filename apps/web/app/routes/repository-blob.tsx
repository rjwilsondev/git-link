import { useLoaderData } from "react-router";
import type { Route } from "./+types/repository-blob";
import { getRepositoryBlob } from "~/dao";
import { Button } from "~/components/ui/button";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Blob" },
    { name: "description", content: "View file content." },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const repoName = params.repoName!;
  const hash = params.hash!;
  const blobContent = await getRepositoryBlob(repoName, hash);
  return { blobContent };
}

export const RepositoryBlob = () => {
  const { blobContent } = useLoaderData<typeof loader>();
  return (
    <div className="border rounded-lg overflow-hidden bg-background">
        <div className="bg-muted/30 px-4 py-2 border-b flex items-center justify-between">
            <div className="text-sm font-mono text-muted-foreground">
                Raw content
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Raw</Button>
                <Button variant="outline" size="sm">Blame</Button>
            </div>
        </div>
        <div className="p-4 overflow-x-auto">
            <pre className="text-sm font-mono leading-relaxed whitespace-pre-wrap break-all">{blobContent}</pre>
        </div>
    </div>
  );
}

export default RepositoryBlob