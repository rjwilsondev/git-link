package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

// reposRoot is a package-level variable shared across all files in 'package main'.
var reposRoot string

func init() {
	reposRoot = os.Getenv("REPOS_ROOT")
	if reposRoot == "" {
		reposRoot = "../../data/repositories"
	}
	absPath, err := filepath.Abs(reposRoot)
	if err == nil {
		reposRoot = absPath
	}
}

func main() {
	log.Println("reposRoot", reposRoot)
	// Create a new router (multiplexer)
	mux := http.NewServeMux()

	// MODERN GO ROUTING (1.22+):
	// - Methods (GET/POST/etc.) can be specified at the start of the pattern.
	// - {repoName} matches a single segment.
	// - {path...} captures everything else (including slashes).
	mux.HandleFunc("GET /api/repos", handleRepos)
	mux.HandleFunc("GET /api/repos/{repoName}", handleGetTree)
	mux.HandleFunc("GET /api/repos/{repoName}/tree", handleGetTree)
	mux.HandleFunc("GET /api/repos/{repoName}/branches", handleGetBranches)
	mux.HandleFunc("GET /api/repos/{repoName}/tree/{branch}/{path...}", handleGetTree)
	mux.HandleFunc("GET /api/repos/{repoName}/blob/{hash}", handleGetBlob)
	mux.HandleFunc("POST /api/repos", handleCreateRepo)

	// Git Protocol routes
	// Standard Git clients use .git suffix. Making this specific prevents it
	// from "stealing" invalid API requests.
	mux.HandleFunc("/{repoPath}/{suffix...}", handleGitProtocol)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Git Service listening on :%s\n", port)

	// Start the server
	log.Fatal(http.ListenAndServe(":"+port, mux))
}
