package main

import (
	"encoding/json"
	"log"
	"net/http"
	"net/http/cgi"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
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

func handleCreateRepo(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		Name string `json:"name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if payload.Name == "" {
		http.Error(w, "Repository name is required", http.StatusBadRequest)
		return
	}

	repoPath := filepath.Join(reposRoot, payload.Name)
	if _, err := os.Stat(repoPath); err == nil {
		http.Error(w, "Repository already exists", http.StatusConflict)
		return
	}

	if err := initBareRepository(repoPath); err != nil {
		http.Error(w, "Failed to initialize repository: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Repository created successfully"})
}

func handleGitProtocol(w http.ResponseWriter, r *http.Request) {
	gitExecPath, err := exec.Command("git", "--exec-path").Output()
	if err != nil {
		http.Error(w, "Git not found", http.StatusInternalServerError)
		return
	}
	backendPath := filepath.Join(strings.TrimSpace(string(gitExecPath)), "git-http-backend")

	handler := &cgi.Handler{
		Path: backendPath,
		Env: []string{
			"GIT_PROJECT_ROOT=" + reposRoot,
			"GIT_HTTP_EXPORT_ALL=1",
		},
	}
	handler.ServeHTTP(w, r)
}
