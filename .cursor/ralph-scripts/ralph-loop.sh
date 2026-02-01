#!/bin/bash
set -e

MAX_ITERATIONS=${1:-20}
ITERATION=0

echo "🔄 Starting Ralph Wiggum Loop (max: $MAX_ITERATIONS iterations)"

while [ $ITERATION -lt $MAX_ITERATIONS ]; do
    ITERATION=$((ITERATION + 1))
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📍 Iteration $ITERATION of $MAX_ITERATIONS"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Run Claude Code agent with the task
    # --print outputs to stdout, --dangerously-skip-permissions allows file edits
    OUTPUT=$(claude --print --dangerously-skip-permissions -p "$(cat .ralph/PROMPT_build.md)" "$(cat .ralph/RALPH_TASK.md)" 2>&1) || true
    
    echo "$OUTPUT"
    
    # Check for completion signal
    if echo "$OUTPUT" | grep -q "<promise>DONE</promise>"; then
        echo "✅ All tasks completed!"
        break
    fi
    
    # Check for stuck signal
    if echo "$OUTPUT" | grep -q "<promise>STUCK</promise>"; then
        echo "⚠️ Agent is stuck. Review .ralph/errors.log"
        break
    fi
    
    echo "🔄 Iteration $ITERATION complete. Continuing..."
    sleep 2
done

echo "🏁 Ralph loop finished after $ITERATION iterations"
