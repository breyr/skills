# Link every skill in .\skills into ~\.claude\skills using directory junctions
# (no admin rights needed). Safe to re-run.
$ErrorActionPreference = 'Stop'
$src  = Join-Path $PSScriptRoot 'skills'
$dest = if ($env:CLAUDE_SKILLS_DIR) { $env:CLAUDE_SKILLS_DIR } else { Join-Path $HOME '.claude\skills' }
New-Item -ItemType Directory -Force -Path $dest | Out-Null
Get-ChildItem -Directory $src | ForEach-Object {
  $target = Join-Path $dest $_.Name
  $item = Get-Item $target -Force -ErrorAction SilentlyContinue
  if ($item -and -not $item.LinkType) {
    Write-Warning "skip $($_.Name): $target exists and is not a link"
    return
  }
  if ($item) { $item.Delete() }  # removes the old link only, not the repo folder
  New-Item -ItemType Junction -Path $target -Target $_.FullName | Out-Null
  Write-Host "linked $($_.Name)"
}
