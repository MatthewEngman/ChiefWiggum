#!/bin/bash
# Cursor Documentation Sources Setup Script
# This script helps set up the documentation sources in Cursor IDE
# Run this script to get instructions on how to add the docs to Cursor

echo "========================================"
echo "Cursor Documentation Sources Setup"
echo "========================================"
echo ""

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "Error: jq is required to run this script."
    echo "Install it with: brew install jq (macOS) or apt-get install jq (Linux)"
    exit 1
fi

DOCS_COUNT=$(jq '.documentationSources | length' .cursor/docs-sources.json)

echo "Found $DOCS_COUNT documentation sources to configure."
echo ""
echo "To add these to Cursor:"
echo "1. Open Cursor Settings (Ctrl+, or Cmd+,)"
echo "2. Navigate to 'Indexing & Docs' section"
echo "3. Scroll to the 'Docs' section"
echo "4. Click '+ Add Doc' for each source below"
echo ""
echo "Documentation Sources:"
echo ""

jq -r '.documentationSources[] | "  • \(.name)\n    URL: \(.url)\n    Description: \(.description)\n"' .cursor/docs-sources.json

echo ""
echo "========================================"
echo "Quick Copy URLs (for easy pasting):"
echo "========================================"
echo ""
jq -r '.documentationSources[] | "\(.url)"' .cursor/docs-sources.json

echo ""
echo "========================================"
echo "Setup complete! Follow the instructions above."
echo ""
echo "💡 After adding sources, run: ./verify-docs.sh"
echo "   to verify they were added correctly."
echo "========================================"

