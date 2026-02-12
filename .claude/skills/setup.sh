#!/usr/bin/env bash
# Setup AI Skills for Fierros development
# .claude/skills/ is the source of truth for all skill files.
# This script configures other AI assistants via symlinks:
#   - Claude Code: CLAUDE.md copies (skills already in .claude/skills/)
#   - Gemini CLI:  .gemini/skills/ symlink + GEMINI.md copies
#   - Codex:       .codex/skills/ symlink (uses AGENTS.md natively)
#
# Usage:
#   ./setup.sh              # Configure Claude Code (default)
#   ./setup.sh --all        # Configure all AI assistants
#   ./setup.sh --claude     # Configure only Claude Code
#   ./setup.sh --gemini     # Configure only Gemini CLI
#   ./setup.sh --codex      # Configure only Codex (OpenAI)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
SKILLS_SOURCE="$SCRIPT_DIR"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Selection flags
SETUP_CLAUDE=false
SETUP_GEMINI=false
SETUP_CODEX=false

show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Configure AI coding assistants for Fierros development."
    echo ""
    echo "Options:"
    echo "  --all       Configure all AI assistants"
    echo "  --claude    Configure Claude Code"
    echo "  --gemini    Configure Gemini CLI"
    echo "  --codex     Configure Codex (OpenAI)"
    echo "  --help      Show this help message"
    echo ""
    echo "If no options provided, configures Claude Code by default."
}

# --- Shared helpers ---

copy_agents_md() {
    local target_name="$1"
    local count=0

    while IFS= read -r agents_file; do
        local agents_dir
        agents_dir=$(dirname "$agents_file")
        cp "$agents_file" "$agents_dir/$target_name"
        count=$((count + 1))
    done < <(find "$REPO_ROOT" -name "AGENTS.md" \
        -not -path "*/node_modules/*" \
        -not -path "*/.git/*" \
        -not -path "*/.wxt/*" \
        2>/dev/null)

    echo -e "${GREEN}  ✓ Copied $count AGENTS.md -> $target_name${NC}"
}

setup_skills_symlink() {
    local agent_dir="$1"
    local target="$REPO_ROOT/$agent_dir/skills"

    if [ ! -d "$REPO_ROOT/$agent_dir" ]; then
        mkdir -p "$REPO_ROOT/$agent_dir"
    fi

    if [ -L "$target" ]; then
        rm "$target"
    elif [ -d "$target" ]; then
        local backup="$REPO_ROOT/$agent_dir/skills.backup.$(date +%s)"
        mv "$target" "$backup"
        echo -e "${YELLOW}  Backed up existing skills/ to $(basename "$backup")${NC}"
    fi

    ln -s ../.claude/skills "$target"
    echo -e "${GREEN}  ✓ $agent_dir/skills -> ../.claude/skills/${NC}"
}

# --- Agent setup functions ---

setup_claude() {
    # .claude/skills/ is the real directory, no symlink needed
    copy_agents_md "CLAUDE.md"
}

setup_gemini() {
    setup_skills_symlink ".gemini"
    copy_agents_md "GEMINI.md"
}

setup_codex() {
    setup_skills_symlink ".codex"
    echo -e "${GREEN}  ✓ Codex uses AGENTS.md natively${NC}"
}

# --- Parse arguments ---

while [[ $# -gt 0 ]]; do
    case $1 in
        --all)
            SETUP_CLAUDE=true
            SETUP_GEMINI=true
            SETUP_CODEX=true
            shift
            ;;
        --claude)
            SETUP_CLAUDE=true
            shift
            ;;
        --gemini)
            SETUP_GEMINI=true
            shift
            ;;
        --codex)
            SETUP_CODEX=true
            shift
            ;;
        --help|-h)
            show_help
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

# Default to Claude if no flags
if [ "$SETUP_CLAUDE" = false ] && [ "$SETUP_GEMINI" = false ] && \
   [ "$SETUP_CODEX" = false ]; then
    SETUP_CLAUDE=true
fi

echo "🏋️ Fierros AI Skills Setup"
echo "======================"
echo ""

# Count skills
SKILL_COUNT=$(find "$SKILLS_SOURCE" -maxdepth 2 -name "SKILL.md" | wc -l | tr -d ' ')

if [ "$SKILL_COUNT" -eq 0 ]; then
    echo -e "${RED}No skills found in $SKILLS_SOURCE${NC}"
    exit 1
fi

echo -e "${BLUE}Found $SKILL_COUNT skills to configure${NC}"
echo ""

if [ "$SETUP_CLAUDE" = true ]; then
    echo -e "${YELLOW}Setting up Claude Code...${NC}"
    setup_claude
fi

if [ "$SETUP_GEMINI" = true ]; then
    echo -e "${YELLOW}Setting up Gemini CLI...${NC}"
    setup_gemini
fi

if [ "$SETUP_CODEX" = true ]; then
    echo -e "${YELLOW}Setting up Codex (OpenAI)...${NC}"
    setup_codex
fi

echo ""
echo -e "${GREEN}Successfully configured $SKILL_COUNT AI skills!${NC}"
echo ""
echo "Configured:"
[ "$SETUP_CLAUDE" = true ]  && echo "  • Claude Code: .claude/skills/ (source of truth) + CLAUDE.md"
[ "$SETUP_GEMINI" = true ]  && echo "  • Gemini CLI:  .gemini/skills/ -> ../.claude/skills/ + GEMINI.md"
[ "$SETUP_CODEX" = true ]   && echo "  • Codex:       .codex/skills/ -> ../.claude/skills/ (uses AGENTS.md)"
echo ""
echo -e "${BLUE}Note: AGENTS.md is the source of truth.${NC}"
echo -e "${BLUE}      Generated files are gitignored.${NC}"
echo -e "${BLUE}      Run .claude/skills/sync.sh to regenerate auto-invoke tables.${NC}"
