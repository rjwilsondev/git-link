package main

import (
	"bytes"
	"context"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

type GitRepository struct {
	Path string
}

func NewGitRepository(repoName string) (*GitRepository, error) {
	var path = filepath.Join(reposRoot, repoName)
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return nil, fmt.Errorf("repository not found: %s", repoName)
	}
	return &GitRepository{Path: path}, nil
}

func (r *GitRepository) git(ctx context.Context, args ...string) (string, error) {
	var stdout, stderr bytes.Buffer
	cmd := exec.CommandContext(ctx, "git", args...)
	cmd.Dir = r.Path
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr
	log.Println("Executing git:", cmd.Args)
	err := cmd.Run()
	if err != nil {
		return "", fmt.Errorf("git %v failed: %s", args, stderr.String())
	}
	var output = stdout.String()
	log.Println("Output: ", output)
	return output, nil
}

func (r *GitRepository) GetTree(ctx context.Context, branch string, subPath string) ([]TreeEntry, error) {
	output, err := r.git(ctx, "ls-tree", "-z", "--full-tree", branch+":"+subPath)
	if err != nil {
		return nil, err
	}

	var entries []TreeEntry
	rawEntries := strings.Split(output, "\x00") // Split by null character
	for _, entry := range rawEntries {
		if entry == "" {
			continue
		}
		// Format: <mode> <type> <hash>\t<name>
		// strings.Fields splits by any whitespace.
		parts := strings.Fields(entry)
		if len(parts) < 4 {
			continue
		}
		entries = append(entries, TreeEntry{
			Mode: parts[0],
			Type: parts[1],
			Hash: parts[2],
			Name: parts[3],
		})
	}
	return entries, nil
}

func (r *GitRepository) GetBlob(ctx context.Context, hash string) (string, error) {
	output, err := r.git(ctx, "cat-file", "-p", hash)
	if err != nil {
		return "", err
	}
	return string(output), nil
}

func initBareRepository(repoPath string) error {
	if err := exec.Command("git", "init", "--bare", repoPath).Run(); err != nil {
		return err
	}
	// Enable push support over HTTP
	cmd := exec.Command("git", "config", "-f", filepath.Join(repoPath, "config"), "http.receivepack", "true")
	return cmd.Run()
}

func (r *GitRepository) GetDefaultBranch(ctx context.Context) (string, error) {
	// symbolic-ref --short HEAD returns the clean branch name (e.g., "main" or "master")
	output, err := r.git(ctx, "symbolic-ref", "--short", "HEAD")
	if err != nil {
		return "", err
	}
	return strings.TrimSpace(output), nil
}

func (r *GitRepository) ListBranches(ctx context.Context) ([]string, error) {
	// Use for-each-ref to get short names directly
	output, err := r.git(ctx, "for-each-ref", "--format=%(refname:short)", "refs/heads")
	if err != nil {
		return nil, err
	}
	var branches []string
	rawBranches := strings.Split(strings.TrimSpace(output), "\n")
	for _, branch := range rawBranches {
		if branch != "" {
			branches = append(branches, branch)
		}
	}
	return branches, nil
}
