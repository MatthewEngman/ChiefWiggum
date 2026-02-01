# Cursor Documentation Sources Setup Script
# This script helps set up the documentation sources in Cursor IDE
# Run this script to get instructions on how to add the docs to Cursor

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Cursor Documentation Sources Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$docsConfig = Get-Content -Path ".\.cursor\docs-sources.json" | ConvertFrom-Json

Write-Host "Found $($docsConfig.documentationSources.Count) documentation sources to configure." -ForegroundColor Green
Write-Host ""
Write-Host "To add these to Cursor:" -ForegroundColor Yellow
Write-Host "1. Open Cursor Settings (Ctrl+, or Cmd+,)" -ForegroundColor White
Write-Host "2. Navigate to 'Indexing & Docs' section" -ForegroundColor White
Write-Host "3. Scroll to the 'Docs' section" -ForegroundColor White
Write-Host "4. Click '+ Add Doc' for each source below" -ForegroundColor White
Write-Host ""
Write-Host "Documentation Sources:" -ForegroundColor Cyan
Write-Host ""

foreach ($doc in $docsConfig.documentationSources) {
    Write-Host "  • $($doc.name)" -ForegroundColor Green
    Write-Host "    URL: $($doc.url)" -ForegroundColor Gray
    Write-Host "    Description: $($doc.description)" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Quick Copy URLs (for easy pasting):" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
foreach ($doc in $docsConfig.documentationSources) {
    Write-Host "$($doc.url)" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup complete! Follow the instructions above." -ForegroundColor Green
Write-Host ""
Write-Host "💡 After adding sources, run: .\verify-docs.ps1" -ForegroundColor Yellow
Write-Host "   to verify they were added correctly." -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

