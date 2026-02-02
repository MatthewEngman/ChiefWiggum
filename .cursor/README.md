# Cursor Configuration

This directory contains Cursor IDE-specific configuration files.

## Files

- `.cursorrules` - Main project rules file (legacy format, still supported)
- `.cursor/docs-index.json` - Documentation indexing configuration for local files (auto-used by Cursor)
- `.cursor/docs-sources.json` - External documentation sources reference (may require manual setup)
- `.cursor/setup-docs.sh` - Setup script for macOS/Linux (displays sources to add)
- `.cursor/setup-docs.ps1` - Setup script for Windows (displays sources to add)

## Current Setup

- ✅ `.cursorrules` file is configured and aligned with project architecture
- ✅ `tsconfig.json` includes `serverless/**/*` (corrected from `api/**/*`)
- ✅ All deployment and architecture rules are documented
- ✅ Documentation indexing configured for all project docs

## Documentation Indexing

### Local Documentation (`docs-index.json`)

This file configures which local files and directories Cursor should index. It's automatically used by Cursor.

**Current configuration:**
- All `.md` files in `docs/` directory
- Root `README.md`
- API reference documentation
- Getting started guides
- Deployment documentation
- Testing documentation
- Security documentation

### External Documentation (`docs-sources.json`)

This file serves as a **reference** for external documentation sources. **Cursor requires manual setup** via Settings UI.

**To configure on a new machine:**

1. **Quick Setup (using script):**
   ```bash
   # macOS/Linux
   ./setup-docs.sh
   
   # Windows PowerShell
   .\setup-docs.ps1
   ```

2. **Manual Setup:**
   - Open Cursor Settings (`Ctrl+,` or `Cmd+,`)
   - Navigate to **Indexing & Docs** section
   - Scroll to **Docs** section
   - Click **+ Add Doc** for each source in `docs-sources.json`
   - Enter the URL from the `url` field

**Current external sources:**
- React Reference
- Next.js Reference (for reference, though project uses Vite)
- Tailwind CSS Reference
- Supabase Docs
- Vercel Docs
- Google Gen AI Eval Docs
- IBM Agent Eval Docs

### Cross-Machine Setup

**If you added documentation sources on another machine:**

1. **Export from other machine:**
   - Cursor stores docs configuration in local settings
   - Check Settings > Indexing & Docs > Docs section
   - Note any additional sources you added

2. **Add to this machine:**
   ```bash
   # Display sources to add
   ./setup-docs.sh  # macOS/Linux
   .\setup-docs.ps1  # Windows
   
   # Then manually add via Settings UI
   ```

3. **For local file paths:**
   - If you added local file paths, they're stored in Cursor's local settings
   - Update `docs-index.json` for project-local files
   - For files outside the project, use relative paths or consistent absolute paths

### Automatic Import Status

**Current Status:** Cursor's automatic import from `docs-sources.json` may vary by version:
- ✅ `docs-index.json` (local files) - Automatically used by Cursor
- ⚠️ `docs-sources.json` (external URLs) - May require manual setup via Settings UI

**To check if automatic import works:**
1. Open Cursor Settings → Indexing & Docs → Docs
2. See if sources from `docs-sources.json` appear automatically
3. If not, use the setup scripts to add them manually

**Best Practice:** Use `docs-sources.json` as the team reference, and manually add sources via Settings UI for active use. This ensures version-controlled documentation and immediate functionality.

## Notes

- `.cursorrules` is the legacy format but still fully supported by Cursor
- Cursor also supports `.cursor/rules/*.mdc` format for more advanced rule organization
- The current `.cursorrules` format is sufficient for this project
- `docs-sources.json` is a reference file - Cursor doesn't automatically import it yet
- Local documentation indexing (`docs-index.json`) is automatically used by Cursor

## Documentation

For more information:
- [Cursor Rules Documentation](https://docs.cursor.com/en/context/rules)
- [Cursor Codebase Indexing](https://docs.cursor.com/context/codebase-indexing)
- [Cursor Docs Configuration](https://docs.cursor.com/en/context/docs)
