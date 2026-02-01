# Guardrails & Lessons Learned

## Rules

1. ONE task per iteration - pick the most important incomplete item
2. **Write tests for every task** - New code must have appropriate tests (unit/integration/component)
3. **Check test coverage** - New code should have 80%+ coverage, document gaps if below
4. Run tests before committing - never commit broken code
5. If tests fail 3 times in a row, document the issue and move on
6. Always update progress.md after completing work (include test coverage info)
7. Commit with descriptive messages: "feat:", "fix:", "refactor:", "test:"
8. **Create PRs at milestones** - Every 5-10 tasks or at phase boundaries to avoid huge commits

## Critical CLI Commands

<!-- Auto-generated during initialization -->
<!-- Run: node .cursor/ralph-scripts/init-ralph.js to generate project-specific commands -->

### Quality Gates (Run Before Every Commit)

```bash
# Commands are generated after running init-ralph.js
# Example patterns:
# npm run type-check    # TypeScript projects
# npm run lint          # JavaScript/TypeScript
# npm run test:unit     # Unit tests
# npm run build         # Production build
#
# Or for other languages:
# mypy .               # Python type checking
# pytest               # Python tests
# cargo test           # Rust tests
# go test ./...        # Go tests
```

**Test Coverage Requirements:**
- New code must have 80%+ coverage (lines, functions, statements)
- Run coverage check after tests to verify
- Document any coverage gaps in progress.md if below threshold

### Database Migrations

After ANY changes to schema (if applicable):

```bash
# Use your project's migration command, e.g.:
# npm run db:push       # Drizzle push mode
# npm run migrate       # Traditional migrations
# python manage.py migrate  # Django
```

### Installing New Dependencies

When a task requires new packages:

```bash
# Use your project's package manager:
# npm add <package-name>           # Node.js
# pip install <package-name>       # Python
# cargo add <package-name>         # Rust
# go get <package-name>            # Go
```

## Learned Patterns

<!-- Agent will add patterns it discovers here -->

## Known Issues

<!-- Document recurring problems here -->

## File Patterns to Follow

<!-- Add project-specific patterns after initialization -->
