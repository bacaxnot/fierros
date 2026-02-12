#!/usr/bin/env python3
"""
Archive a diff file by moving it to the done/ folder.

Usage:
    python archive-diff.py <diff-file-path>

Arguments:
    diff-file-path: Full path to the diff file to archive

Example:
    python archive-diff.py packages/core/_diffs_/contexts/training/exercises/2024-01-15T10-30-00-add-pause.md
    # Moves to: packages/core/_diffs_/contexts/training/exercises/done/2024-01-15T10-30-00-add-pause.md
"""

import sys
import shutil
from pathlib import Path


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)

    diff_path = Path(sys.argv[1])

    if not diff_path.exists():
        print(f"Error: Diff file not found: {diff_path}")
        sys.exit(1)

    if not diff_path.is_file():
        print(f"Error: Not a file: {diff_path}")
        sys.exit(1)

    # Check if already in done/
    if diff_path.parent.name == "done":
        print(f"Error: Diff is already archived: {diff_path}")
        sys.exit(1)

    # Target: same directory + done/ + same filename
    done_dir = diff_path.parent / "done"
    done_dir.mkdir(exist_ok=True)

    target_path = done_dir / diff_path.name

    if target_path.exists():
        print(f"Error: Target already exists: {target_path}")
        sys.exit(1)

    # Move the file
    shutil.move(str(diff_path), str(target_path))
    print(f"Archived: {diff_path}")
    print(f"      -> {target_path}")


if __name__ == "__main__":
    main()
