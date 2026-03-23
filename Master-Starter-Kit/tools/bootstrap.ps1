# Quick check: if kit is already installed, exit silently.
# Otherwise run the full installer.
if (Test-Path "$env:USERPROFILE\.claude\skills\kit\SKILL.md") { exit 0 }
powershell -ExecutionPolicy Bypass -File "$PSScriptRoot\install.ps1"
