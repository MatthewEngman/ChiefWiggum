#!/bin/bash
# Single iteration for testing/debugging
echo "🔍 Running single Ralph iteration..."
claude --print --dangerously-skip-permissions -p "$(cat .ralph/PROMPT_build.md)" "$(cat .ralph/RALPH_TASK.md)"
