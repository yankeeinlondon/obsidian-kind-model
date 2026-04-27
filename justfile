set dotenv-load := true
set positional-arguments := true

BOLD := '\033[1m'
RESET := '\033[0m'

default:
    #!/usr/bin/env bash
    set -euo pipefail
    if command -v md &> /dev/null; then
    	md just.md
    else
    	echo "Kind Model Plugin"
        echo "======================"
    fi
    echo ""
    just --list | grep -v 'default'
    echo

# Build the plugin and deploy to the Vault
build:
    @echo ""
    @echo "Building Kind Model"
    @echo "-------------------"
    pnpm build

# Watch the plugin for changes and recompile when changes detected
watch:
    @echo ""
    @echo "Watching Kind Model for Changes (dev mode)"
    @echo ""
    pnpm test:watch

# Start Claude Code in Yolo mode
cc *args="":
    @echo ""
    @echo "Staring Claude Code (in yolo mode)"
    @echo ""
    @claude --dangerously-skip-permissions {{ args }}

# Start Opencode in Yolo mode
oc *args="":
    @echo ""
    @echo "Staring Opencode CLI (in yolo mode)"
    @echo ""
    @OPENCODE_YOLO=true opencode {{ args }}

commit:
    @claudine compose "prompts/commit.md" --opencode -y
