package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

// handleRepos lists all available repository directories.
func handleRepos(w http.ResponseWriter, r *http.Request) {
	log.Println("handleRepos")
	entries, err := os.ReadDir(reposRoot)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var repos []string
	for _, entry := range entries {
		if entry.IsDir() {
			repos = append(repos, entry.Name())
		}
	}
	json.NewEncoder(w).Encode(repos)
}

// handleGetTree handles fetching the file tree for a specific repository/branch/path.
func handleGetTree(w http.ResponseWriter, r *http.Request) {
	// Using Go 1.22+ PathValue to grab variables directly from the URL!
	repoName := r.PathValue("repoName")
	branch := r.PathValue("branch")
	subPath := r.PathValue("path")

	// Set defaults if not provided in URL
	if branch == "" {
		branch = "main"
	}

	repoPath := filepath.Join(reposRoot, repoName)

	// Validate repo exists
	if _, err := os.Stat(repoPath); os.IsNotExist(err) {
		http.Error(w, "Repository not found", http.StatusNotFound)
		return
	}

	// Call our service logic from service.go
	entries, err := getRepositoryTree(repoPath, branch, subPath)
	if err != nil {
		http.Error(w, "Failed to list tree: "+err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(entries)
}

func handleGetBlob(w http.ResponseWriter, r *http.Request) {
	// Using Go 1.22+ PathValue to grab variables directly from the URL!
	repoName := r.PathValue("repoName")
	hash := r.PathValue("hash")

	repoPath := filepath.Join(reposRoot, repoName)

	// Validate repo exists
	if _, err := os.Stat(repoPath); os.IsNotExist(err) {
		http.Error(w, "Repository not found", http.StatusNotFound)
		return
	}

	// Call our service logic from service.go
	content, err := getRepositoryBlob(repoPath, hash)
	if err != nil {
		http.Error(w, "Failed to get blob: "+err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(content)
}
