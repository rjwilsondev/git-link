package main

import (
	"os/exec"
	"strings"
)

// getRepositoryTree executes the 'git ls-tree' command and returns a list of tree entries.
func getRepositoryTree(repoPath, branch, subPath string) ([]TreeEntry, error) {
	// '-z' makes output null-terminated; '--full-tree' shows paths relative to repo root.
	cmd := exec.Command("git", "ls-tree", "-z", "--full-tree", branch+":"+subPath)
	cmd.Dir = repoPath

	output, err := cmd.Output()
	if err != nil {
		return nil, err
	}

	return parseGitTree(string(output)), nil
}

// parseGitTree converts the raw text output from Git into a slice of TreeEntry structs.
func parseGitTree(output string) []TreeEntry {
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
	return entries
}

func getRepositoryBlob(repoPath, hash string) (string, error) {
	// git cat-file -p <hash>
	cmd := exec.Command("git", "cat-file", "-p", hash)
	cmd.Dir = repoPath
	output, err := cmd.Output()
	if err != nil {
		return "", err
	}
	return string(output), nil
}
