package main

import "testing"

func TestSanitizeFilename(t *testing.T) {
	got := sanitizeFilename("My Photo (1).PNG")
	if want := "my-photo--1-.png"; got != want {
		t.Errorf("sanitizeFilename() = %q, want %q", got, want)
	}
	// if want := "test-that-must-fail"; got != want {
	// 	t.Errorf("sanitizeFilename() = %q, want %q", got, want)
	// }
}

func TestSanitizeFilenameBlocksPathTraversal(t *testing.T) {
	got := sanitizeFilename("../../etc/passwd")
	if want := "passwd"; got != want {
		t.Errorf("sanitizeFilename() = %q, want %q", got, want)
	}
}
