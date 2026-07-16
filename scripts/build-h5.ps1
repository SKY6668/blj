$projectRoot = Split-Path -Parent $PSScriptRoot
$hBuilderRoot = Join-Path $env:LOCALAPPDATA 'Programs\HBuilderX\HBuilderX'
$cliExecutable = Join-Path $hBuilderRoot 'cli.exe'

if (-not (Test-Path -LiteralPath $cliExecutable)) {
  throw "未找到 HBuilderX CLI：$cliExecutable"
}

$connectionErrors = @(
  '未检测到已打开的HBuilderX',
  '与主程序的连接已中断'
)

$cliOpenOutput = (& $cliExecutable open 2>&1 | Out-String)
$cliOpenExitCode = $LASTEXITCODE
Write-Output $cliOpenOutput
if ($cliOpenExitCode -ne 0) {
  exit 1
}

$openOutput = ''
$openExitCode = 1
for ($attempt = 1; $attempt -le 10; $attempt++) {
  $openOutput = (& $cliExecutable project open --path $projectRoot 2>&1 | Out-String)
  $openExitCode = $LASTEXITCODE
  if ($openExitCode -eq 0 -and -not ($connectionErrors | Where-Object { $openOutput.Contains($_) })) {
    break
  }

  Start-Sleep -Seconds 1
}

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
