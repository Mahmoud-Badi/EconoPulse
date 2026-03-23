# Master Starter Kit — Claude Code Setup
# Run from the Master-Starter-Kit/tools/ directory:
#   powershell -ExecutionPolicy Bypass -File install.ps1

$ErrorActionPreference = "Stop"

# ── Resolve paths ──────────────────────────────────────────────────────────────
$ToolsDir   = $PSScriptRoot
$KitHome    = Split-Path $ToolsDir -Parent          # Master-Starter-Kit/
$ClaudeDir  = "$env:USERPROFILE\.claude"
$SkillsDst  = "$ClaudeDir\skills"
$CmdsDst    = "$ClaudeDir\commands"
$SettingsF  = "$ClaudeDir\settings.json"

Write-Host ""
Write-Host "Master Starter Kit — Claude Code Setup" -ForegroundColor Cyan
Write-Host "Kit home : $KitHome"
Write-Host "Claude   : $ClaudeDir"
Write-Host ""

# ── Ensure destination directories exist ──────────────────────────────────────
New-Item -ItemType Directory -Force -Path $SkillsDst | Out-Null
New-Item -ItemType Directory -Force -Path $CmdsDst   | Out-Null

# ── Copy skills ────────────────────────────────────────────────────────────────
$skills = @("kit", "delta", "kickoff", "recreate", "gsd", "website-builder", "master-kit-upgrade", "kit-upgrade")
foreach ($skill in $skills) {
    $src = "$ToolsDir\skills\$skill"
    $dst = "$SkillsDst\$skill"
    if (Test-Path $src) {
        Copy-Item -Recurse -Force $src $SkillsDst
        Write-Host "  [skill] $skill -> $dst" -ForegroundColor Green
    }
}

# ── Replace {{KIT_HOME}} placeholder in kit skill ─────────────────────────────
$kitSkill = "$SkillsDst\kit\SKILL.md"
if (Test-Path $kitSkill) {
    $content = Get-Content $kitSkill -Raw
    $content = $content -replace '\{\{KIT_HOME\}\}', $KitHome.Replace('\','\\')
    Set-Content $kitSkill $content -NoNewline
    Write-Host "  [patch] kit skill: KIT_HOME = $KitHome" -ForegroundColor Yellow
}

# ── Replace {{WEBSITE_BUILDER_DIR}} placeholder in website-builder skill ──────
$wbSkill = "$SkillsDst\website-builder\SKILL.md"
if (Test-Path $wbSkill) {
    $wbDir = "$SkillsDst\website-builder"
    $content = Get-Content $wbSkill -Raw
    $content = $content -replace '\{\{WEBSITE_BUILDER_DIR\}\}', $wbDir.Replace('\','\\')
    Set-Content $wbSkill $content -NoNewline
    Write-Host "  [patch] website-builder skill: WEBSITE_BUILDER_DIR = $wbDir" -ForegroundColor Yellow
}

# ── Replace {{KIT_HOME}} placeholder in master-kit-upgrade skill ─────────────
$mkuSkill = "$SkillsDst\master-kit-upgrade\SKILL.md"
if (Test-Path $mkuSkill) {
    $content = Get-Content $mkuSkill -Raw
    $content = $content -replace '\{\{KIT_HOME\}\}', $KitHome.Replace('\','\\')
    Set-Content $mkuSkill $content -NoNewline
    Write-Host "  [patch] master-kit-upgrade skill: KIT_HOME = $KitHome" -ForegroundColor Yellow
}

# ── Copy commands ──────────────────────────────────────────────────────────────
$cmds = @("kit.md", "log.md", "gsd-status.md")
foreach ($cmd in $cmds) {
    $src = "$ToolsDir\commands\$cmd"
    if (Test-Path $src) {
        Copy-Item -Force $src $CmdsDst
        Write-Host "  [cmd]   $cmd -> $CmdsDst" -ForegroundColor Green
    }
}

# ── Replace {{KIT_HOME}} placeholder in kit command ───────────────────────────
$kitCmd = "$CmdsDst\kit.md"
if (Test-Path $kitCmd) {
    $content = Get-Content $kitCmd -Raw
    $content = $content -replace '\{\{KIT_HOME\}\}', $KitHome.Replace('\','\\')
    Set-Content $kitCmd $content -NoNewline
    Write-Host "  [patch] kit command: KIT_HOME = $KitHome" -ForegroundColor Yellow
}

# ── Merge hooks into settings.json ────────────────────────────────────────────
$hooksSnippet = "$ToolsDir\hooks-snippet.json"
if (Test-Path $hooksSnippet) {
    $newHooks = (Get-Content $hooksSnippet -Raw | ConvertFrom-Json).hooks

    if (Test-Path $SettingsF) {
        $settings = Get-Content $SettingsF -Raw | ConvertFrom-Json
    } else {
        $settings = [PSCustomObject]@{}
    }

    if (-not $settings.PSObject.Properties["hooks"]) {
        $settings | Add-Member -NotePropertyName "hooks" -NotePropertyValue ([PSCustomObject]@{})
    }

    # Merge Stop hook
    if ($newHooks.PSObject.Properties["Stop"]) {
        $settings.hooks | Add-Member -NotePropertyName "Stop" -NotePropertyValue $newHooks.Stop -Force
    }
    # Merge PreCompact hook
    if ($newHooks.PSObject.Properties["PreCompact"]) {
        $settings.hooks | Add-Member -NotePropertyName "PreCompact" -NotePropertyValue $newHooks.PreCompact -Force
    }

    $settings | ConvertTo-Json -Depth 20 | Set-Content $SettingsF
    Write-Host "  [hooks] Merged Stop + PreCompact into $SettingsF" -ForegroundColor Green
}

# ── Merge recommended plugins into settings.json ────────────────────────────
$pluginsFile = "$ToolsDir\recommended-plugins.json"
if (Test-Path $pluginsFile) {
    $newPlugins = Get-Content $pluginsFile -Raw | ConvertFrom-Json

    # Re-read settings in case hooks block didn't run
    if (Test-Path $SettingsF) {
        $settings = Get-Content $SettingsF -Raw | ConvertFrom-Json
    } else {
        $settings = [PSCustomObject]@{}
    }

    if (-not $settings.PSObject.Properties["enabledPlugins"]) {
        $settings | Add-Member -NotePropertyName "enabledPlugins" -NotePropertyValue ([PSCustomObject]@{})
    }

    foreach ($prop in $newPlugins.PSObject.Properties) {
        if (-not $settings.enabledPlugins.PSObject.Properties[$prop.Name]) {
            $settings.enabledPlugins | Add-Member -NotePropertyName $prop.Name -NotePropertyValue $prop.Value
        }
    }

    $settings | ConvertTo-Json -Depth 20 | Set-Content $SettingsF
    Write-Host "  [plugins] Merged recommended plugins into $SettingsF" -ForegroundColor Green
}

# ── Copy .mcp.json.template if .mcp.json doesn't exist ─────────────────────
$RepoRoot = Split-Path $KitHome -Parent
$mcpTemplate = "$RepoRoot\.mcp.json.template"
$mcpTarget = "$RepoRoot\.mcp.json"
if ((Test-Path $mcpTemplate) -and (-not (Test-Path $mcpTarget))) {
    Copy-Item $mcpTemplate $mcpTarget
    Write-Host "  [mcp]   Created .mcp.json from template (add your API keys!)" -ForegroundColor Green
}

# ── Write installed version marker ────────────────────────────────────────────
$version = Get-Content "$ToolsDir\VERSION" -Raw
$version.Trim() | Set-Content "$SkillsDst\.kit-version"

# ── Done ───────────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "Done! Restart Claude Code to activate all skills and commands." -ForegroundColor Cyan
Write-Host ""
Write-Host "Available after restart:"
Write-Host "  /kit          — Master Starter Kit autopilot"
Write-Host "  /kit resume   — Resume in-progress planning session"
Write-Host "  /kit audit    — Quality hardening (Steps 29-33)"
Write-Host "  /gsd [path]   — Autonomous project build"
Write-Host "  /gsd-status   — GSD execution progress"
Write-Host "  /log          — Log work session"
Write-Host "  /delta           — Delta TMS session start  (customize skill for your project)"
Write-Host "  /kickoff         — Session kickoff          (customize skill for your project)"
Write-Host "  /website-builder — Build a complete Next.js site from a brief"
Write-Host "  /kit-upgrade     — Upgrade project plans to latest kit version"
Write-Host ""
