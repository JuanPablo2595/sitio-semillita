$ErrorActionPreference = "Stop"

$siteRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$outputRoot = Resolve-Path (Join-Path $siteRoot "..")
$localNode = Join-Path $outputRoot ".tmp\node-runtime\node.exe"
$serverScript = Join-Path $siteRoot "scripts\serve-dist.mjs"

Set-Location $siteRoot
$env:HOST = "127.0.0.1"
$env:PORT = "4321"

if (Test-Path $localNode) {
  & $localNode $serverScript
  exit $LASTEXITCODE
}

$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCommand) {
  & node $serverScript
  exit $LASTEXITCODE
}

throw "No se encontró Node.js. Instala Node.js o conserva Output\.tmp\node-runtime\node.exe para abrir el prototipo local."
