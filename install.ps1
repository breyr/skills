# Link every skill in .\skills into ~\.claude\skills (directory junctions, no
# admin rights needed) and every rule file in .\rules\*.md into ~\.claude\rules
# (Claude loads those every session). Safe to re-run.
# Rule files are file symlinks, which need Developer Mode or admin on Windows.
$ErrorActionPreference = 'Stop'
$skillsDest = if ($env:CLAUDE_SKILLS_DIR) { $env:CLAUDE_SKILLS_DIR } else { Join-Path $HOME '.claude\skills' }
$rulesDest  = if ($env:CLAUDE_RULES_DIR)  { $env:CLAUDE_RULES_DIR }  else { Join-Path $HOME '.claude\rules' }
New-Item -ItemType Directory -Force -Path $skillsDest, $rulesDest | Out-Null

Get-ChildItem -Directory (Join-Path $PSScriptRoot 'skills') | ForEach-Object {
  $target = Join-Path $skillsDest $_.Name
  $item = Get-Item $target -Force -ErrorAction SilentlyContinue
  if ($item -and -not $item.LinkType) {
    Write-Warning "skip skill $($_.Name): $target exists and is not a link"
    return
  }
  if ($item) { $item.Delete() }  # removes the old link only, not the repo folder
  New-Item -ItemType Junction -Path $target -Target $_.FullName | Out-Null
  Write-Host "linked skill $($_.Name)"
}

$rulesSrc = Join-Path $PSScriptRoot 'rules'
if (Test-Path $rulesSrc) {
  Get-ChildItem -File -Filter *.md $rulesSrc | ForEach-Object {
    $target = Join-Path $rulesDest $_.Name
    $item = Get-Item $target -Force -ErrorAction SilentlyContinue
    if ($item -and -not $item.LinkType) {
      Write-Warning "skip rule $($_.Name): $target exists and is not a link"
      return
    }
    if ($item) { $item.Delete() }  # removes the old link only, not the repo file
    try {
      New-Item -ItemType SymbolicLink -Path $target -Target $_.FullName | Out-Null
      Write-Host "linked rule $($_.Name)"
    } catch {
      Write-Warning "skip rule $($_.Name): symlinks need Developer Mode or admin on Windows"
    }
  }
}
