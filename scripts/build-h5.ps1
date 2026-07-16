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

$connectionErrors = @(
  '未检测到已打开的HBuilderX',
  '与主程序的连接已中断'
)

$openOutput = (& $cliExecutable project open --path $projectRoot 2>&1 | Out-String)
$openExitCode = $LASTEXITCODE
Write-Output $openOutput
if ($openExitCode -ne 0 -or ($connectionErrors | Where-Object { $openOutput.Contains($_) })) {
  exit 1
}

$publishOutput = (& $cliExecutable publish web --project $projectRoot --webTitle '牙科病例库' 2>&1 | Out-String)
$publishExitCode = $LASTEXITCODE
Write-Output $publishOutput
if ($publishExitCode -ne 0 -or ($connectionErrors | Where-Object { $publishOutput.Contains($_) })) {
  exit 1
}

exit 0
