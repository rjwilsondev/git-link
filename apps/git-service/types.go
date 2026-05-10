package main

// TreeEntry defines the structure of a single file/directory in a git tree.
type TreeEntry struct {
	Mode string `json:"mode"`
	Type string `json:"type"`
	Hash string `json:"hash"`
	Name string `json:"name"`
}
