# Using Ralph Wiggum with AI Coding Assistants

This guide explains how to use Ralph Wiggum with various AI coding IDEs.

---

## Quick Reference

| IDE | Loop Script | Config Location | Notes |
|-----|-------------|-----------------|-------|
| **Cursor** | `.cursor/ralph-scripts/` | Built-in | Default location |
| **Windsurf** | Same scripts | `WINDSURF_RULES.md` | Copy rules if needed |
| **Claude Code** | Same scripts | Project context | Use `PROMPT_build.md` as context |
| **Antigravity** | Same scripts | `.gemini/` or task system | Works with task boundaries |
| **GitHub Copilot** | Manual triggers | Chat context | Best for single-task mode |

---

## Cursor

Cursor has native support for agent loops via Composer.

### Setup

1. Scripts are in `.cursor/ralph-scripts/` (default)
2. Use Composer Agent mode for autonomous execution

### Running the Loop

**Option A: Use shell scripts**
```bash
./.cursor/ralph-scripts/ralph-loop.sh
```

**Option B: Composer Agent**
1. Open Composer (Cmd/Ctrl + I)
2. Paste content from `PROMPT_build.md`
3. Say: "Read `.ralph/tasks.yaml` and implement the current task"

### Tips
- Use `@Codebase` to give context
- Reference `@.ralph/guardrails.md` for rules
- Let Composer auto-iterate by saying "continue until done"

---

## Windsurf

Windsurf (Codeium) uses Cascade for autonomous coding.

### Setup

1. Copy Ralph scripts to project
2. Optionally create `WINDSURF_RULES.md` with guardrails content

### Running the Loop

1. Open Cascade
2. Provide context: "Read PROMPT_build.md for instructions"
3. Say: "Implement the current task from .ralph/tasks.yaml"
4. Cascade will auto-continue through tasks

### Tips
- Use Write mode for implementation
- Cascade can run shell commands automatically
- Reference files with `@filename`

---

## Claude Code (Claude CLI / claude.ai)

Claude Code works via terminal or web interface.

### Setup

No special setup - Ralph Wiggum is IDE-agnostic.

### Running the Loop

**Terminal (claude CLI):**
```bash
claude "Read PROMPT_build.md and .ralph/tasks.yaml. Implement the current task."
```

**Web (claude.ai with Projects):**
1. Upload `PROMPT_build.md` and `.ralph/RALPH_TASK.md` to Project
2. In chat: "Read tasks.yaml and implement the current task"

### Tips
- Use Artifacts for complex outputs
- Claude can execute commands if given access
- Works best with explicit file paths

---

## Google Antigravity (Gemini)

Antigravity integrates via task boundaries and agents.

### Setup

Ralph Wiggum works naturally with Antigravity's task system.

### Running the Loop

1. Give context: "Read .ralph/PROMPT_build.md for my work instructions"
2. Say: "Implement the task from .ralph/tasks.yaml following the workflow"
3. Antigravity will use task boundaries to track progress

### Tips
- Task boundaries align well with Ralph's task-per-iteration model
- Use `notify_user` for milestone PRs
- Guardrails become knowledge items over time

---

## GitHub Copilot

Copilot Chat works best for single tasks rather than autonomous loops.

### Setup

No special setup required.

### Single-Task Mode

1. Open Copilot Chat
2. Paste the current task from `tasks.yaml`
3. Say: "Implement this task following the acceptance criteria"
4. Manually update task status after completion

### Tips
- Better for guided implementation than autonomous loops
- Use inline suggestions for code completion
- Combine with scripts for quality gates

---

## Universal Workflow

Regardless of IDE, follow this pattern:

### 1. Initial Context

Provide the agent with:
- `PROMPT_build.md` (or `.ralph/PROMPT_build.md`) - Operating instructions
- `.ralph/tasks.yaml` - Current task queue
- `.ralph/guardrails.md` - Rules and patterns

### 2. Start Command

```
Read PROMPT_build.md for instructions. Then read .ralph/tasks.yaml 
to find the current_task. Implement that task fully, write tests, 
run quality gates, then update tasks.yaml and progress.md.
```

### 3. Quality Gates

Have the agent run (or run manually):
```bash
# Example for Node.js - adjust for your stack
npm run type-check
npm run lint  
npm run test:unit
npm run build
```

### 4. Iteration

After each task:
1. Agent updates `tasks.yaml` (status → completed)
2. Agent updates `progress.md` 
3. Agent commits with task's `commit_message`
4. Either auto-continue or manually trigger next task

---

## Choosing an IDE

| Use Case | Recommended IDE |
|----------|-----------------|
| Full autonomous loops | Cursor, Windsurf, Claude Code |
| Task-by-task with guidance | Any (including Copilot) |
| Complex multi-file refactors | Cursor, Antigravity |
| Quick single features | Copilot, any with chat |

---

## Troubleshooting

### Agent Doesn't Follow Instructions
- Provide `PROMPT_build.md` content directly in prompt
- Be explicit: "Read the acceptance criteria and implement ALL of them"

### Agent Loses Context
- Re-provide `guardrails.md` and current task
- Reference specific files with paths

### Quality Gates Fail
- Have agent fix issues before proceeding
- Add failed patterns to `guardrails.md`

---

**All IDEs can use Ralph Wiggum - choose based on your preference!** 🚀
