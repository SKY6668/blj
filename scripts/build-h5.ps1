$projectRoot = Split-Path -Parent $PSScriptRoot
$hBuilderRoot = Join-Path $env:LOCALAPPDATA 'Programs\HBuilderX\HBuilderX'
$hBuilderExecutable = Join-Path $hBuilderRoot 'HBuilderX.exe'
$cliExecutable = Join-Path $hBuilderRoot 'cli.exe'

if (-not (Test-Path -LiteralPath $cliExecutable)) {
  throw "未找到 HBuilderX CLI：$cliExecutable"
}

if (-not (Get-Process -Name HBuilderX -ErrorAction SilentlyContinue)) {
  Start-Process -FilePath $hBuilderExecutable
  Start-Sleep -Seconds 8
}

& $cliExecutable project open --path $projectRoot
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

& $cliExecutable publish web --project $projectRoot --webTitle '牙科病例库'
exit $LASTEXITCODE
