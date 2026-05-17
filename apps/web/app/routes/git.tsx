// app/routes/git.$.ts
import { type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { spawn } from "node:child_process";

export async function loader({ request }: LoaderFunctionArgs) {
    return handleGitRequest(request);
}

export async function action({ request }: ActionFunctionArgs) {
    return handleGitRequest(request);
}
    
async function handleGitRequest(request: Request) {
    const url = new URL(request.url);
    const repoRoot = process.env.REPOS_ROOT || "/data/repos";

    // Note: You'll need to calculate PATH_INFO based on your route
    // e.g., if route is /git/my-repo.git, PATH_INFO should be /my-repo.git
    const pathInfo = url.pathname.replace(/^\/git/, "");

    const gitProcess = spawn("/usr/lib/git-core/git-http-backend", [], {
        env: {
            GIT_PROJECT_ROOT: repoRoot,
            GIT_HTTP_EXPORT_ALL: "1",
            PATH_INFO: pathInfo,
            QUERY_STRING: url.search.slice(1),
            REQUEST_METHOD: request.method,
            CONTENT_TYPE: request.headers.get("content-type") || "",
            REMOTE_USER: "anonymous", // Set this to enable pushing without complex auth for now
        },
    });

    // Pipe request body to Git
    if (request.body) {
        const reader = request.body.getReader();
        (async () => {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                gitProcess.stdin.write(value);
            }
            gitProcess.stdin.end();
        })();
    }

    // Stream Git's output back to the client
    return new Response(gitProcess.stdout as any, {
        status: 200, // git-http-backend sends its own headers in stdout
    });
}