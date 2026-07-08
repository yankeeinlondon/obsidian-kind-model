set dotenv-load
set positional-arguments

import "./just/devops.just"
import "./just/ai.just"
# import "./just/util.just"

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

# run the codebase in "dev" mode
dev:
    @pnpm dev

# Watch the plugin for changes and recompile when changes detected
watch:
    @echo ""
    @echo "Watching Kind Model for Changes (dev mode)"
    @echo ""
    pnpm test:watch

# run a comprehensive review
comprehensive-review:
    @claudine compose prompts/comprehensive-review.md -y

plan:
    target="$(just _choose_plan_target)"
