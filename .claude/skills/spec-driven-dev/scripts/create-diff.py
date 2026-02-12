#!/usr/bin/env python3
"""
Create a new diff file from a spec file path.

Usage:
    python create-diff.py <spec-file-path>

Arguments:
    spec-file-path: Path to the spec file (relative or absolute)

Examples:
    python create-diff.py packages/core/_specs_/contexts/training/exercises.md
    # Creates: packages/core/_diffs_/contexts/training/exercises/2024-01-15T10-30-00-bright-falcon.md

    python create-diff.py apps/api/_specs_/routes/exercises.md
    # Creates: apps/api/_diffs_/routes/exercises/2024-01-15T10-30-00-swift-pine.md
"""

import sys
import random
from datetime import datetime
from pathlib import Path

# Maps package prefix to its _specs_ and _diffs_ roots
PACKAGE_MAP = {
    "packages/core": {"package": "core", "specs": "packages/core/_specs_", "diffs": "packages/core/_diffs_"},
    "apps/api":      {"package": "api",  "specs": "apps/api/_specs_",      "diffs": "apps/api/_diffs_"},
}

ADJECTIVES = [
    "bright", "calm", "cool", "dark", "deep", "dry", "fair", "fast", "firm", "flat",
    "fresh", "full", "glad", "gold", "gray", "keen", "kind", "late", "lean", "long",
    "loud", "mild", "neat", "pale", "pure", "rare", "raw", "red", "rich", "ripe",
    "safe", "slim", "slow", "soft", "tall", "thin", "true", "warm", "wide", "wild",
    "bold", "cold", "dull", "free", "high", "just", "low", "new", "odd", "old",
    "open", "pink", "real", "shy", "sly", "tan", "tidy", "vast", "weak", "wise",
]

NOUNS = [
    "arch", "bark", "bell", "bird", "bolt", "bone", "cape", "cave", "clay", "coin",
    "cork", "dawn", "deer", "dew", "dock", "dove", "drum", "dust", "edge", "elm",
    "fern", "fire", "fish", "flax", "foam", "ford", "fox", "frost", "gate", "glow",
    "grain", "grove", "hare", "hawk", "hill", "hive", "horn", "ivy", "jade", "jay",
    "knot", "lake", "lark", "leaf", "lime", "lynx", "marsh", "mint", "moon", "moss",
    "moth", "oak", "owl", "palm", "peak", "pine", "plum", "pond", "rain", "reed",
    "reef", "ridge", "robin", "root", "rose", "sage", "seal", "shore", "silk", "slate",
    "snow", "spark", "star", "stem", "stone", "storm", "swan", "thorn", "tide", "trail",
    "vale", "vine", "wave", "well", "wind", "wing", "wolf", "wren", "yarn", "yew",
]


def generate_slug():
    """Generate a slug from timestamp + two random words."""
    adj = random.choice(ADJECTIVES)
    noun = random.choice(NOUNS)
    return f"{adj}-{noun}"


def resolve_spec(spec_path_str):
    """Resolve spec file path to package info and relative path within _specs_."""
    spec_path = Path(spec_path_str)

    # Normalize to relative path from repo root
    normalized = str(spec_path)
    for abs_prefix in ["/Users/", "/home/"]:
        if abs_prefix in normalized:
            # Try to find the repo-relative part by looking for known prefixes
            for prefix in PACKAGE_MAP:
                idx = normalized.find(prefix)
                if idx != -1:
                    normalized = normalized[idx:]
                    break

    # Match against known package prefixes
    for prefix, info in PACKAGE_MAP.items():
        specs_root = info["specs"]
        if normalized.startswith(specs_root):
            # Extract the relative path within _specs_, dropping the .md extension
            rel = normalized[len(specs_root):].lstrip("/")
            rel = rel.removesuffix(".md")

            return info, rel

    return None, None


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)

    spec_path = sys.argv[1]

    # Resolve package and relative path from spec file
    pkg_info, rel_path = resolve_spec(spec_path)
    if pkg_info is None:
        print(f"Error: Could not resolve spec path '{spec_path}'")
        print(f"Expected path under one of: {', '.join(info['specs'] for info in PACKAGE_MAP.values())}")
        sys.exit(1)

    package = pkg_info["package"]
    diffs_root = pkg_info["diffs"]

    # Verify spec file exists
    spec_file = Path(spec_path)
    if not spec_file.exists():
        print(f"Warning: Spec file not found at '{spec_path}' (continuing anyway)")

    # Generate timestamp and slug
    timestamp = datetime.now().strftime("%Y-%m-%dT%H-%M-%S")
    slug = generate_slug()
    filename = f"{timestamp}-{slug}.md"

    # Build full path
    full_path = Path(diffs_root) / rel_path / filename

    # Create directories if needed
    full_path.parent.mkdir(parents=True, exist_ok=True)

    # Create done/ subdirectory if it doesn't exist
    done_dir = full_path.parent / "done"
    done_dir.mkdir(exist_ok=True)

    # Spec path reference for the template
    spec_ref = spec_path

    # Create the file with template
    template = f"""# {rel_path.split('/')[-1].replace('-', ' ').title()} Implementation Plan

Based on the spec defined in `{spec_ref}`.

## Requirements

1. **TODO**: List requirements

## Folder Structure

```
TODO: Add folder structure with annotations
```

## Implementation Details

### TODO: Module Name

#### `TODO: path/to/file.ts`
```typescript
// TODO: Add implementation
```
"""

    full_path.write_text(template)
    print(f"Created: {full_path}")
    print(f"Done folder: {done_dir}")

if __name__ == "__main__":
    main()
