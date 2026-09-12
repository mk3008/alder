param(
  [Parameter(Mandatory = $true)]
  [string]$DatabaseUrl
)

$ErrorActionPreference = 'Stop'
$implementationRoot = $PSScriptRoot
$repositoryRoot = (Resolve-Path (Join-Path $implementationRoot '..\..\..\..\..')).Path
$ddlPath = Join-Path $repositoryRoot 'work\workflow-validation\frozen\ddl.sql'
$operationPath = Join-Path $implementationRoot 'report_equipment_fault.sql'
$acceptancePath = Join-Path $implementationRoot 'stage1-acceptance.sql'
$schemaName = 'stage1_' + [Guid]::NewGuid().ToString('N')
$psqlPath = 'C:\Program Files\PostgreSQL\18\bin\psql.exe'
$evidencePath = Join-Path $implementationRoot 'acceptance-evidence.log'

if (-not (Test-Path $psqlPath)) { throw "psql was not found at $psqlPath; acceptance is inconclusive." }

try {
  "schema_name=$schemaName" | Set-Content $evidencePath
  "runner_started_utc=$([DateTime]::UtcNow.ToString('o'))" | Add-Content $evidencePath
  & $psqlPath -X --set ON_ERROR_STOP=1 --dbname $DatabaseUrl `
    -c "CREATE SCHEMA `"$schemaName`";" `
    -c "SET search_path TO `"$schemaName`";" `
    -f $ddlPath `
      -f $operationPath `
      -f $acceptancePath 2>&1 | Tee-Object -FilePath $evidencePath -Append
  if ($LASTEXITCODE -ne 0) { throw "Stage 1 acceptance failed with psql exit code $LASTEXITCODE." }
}
finally {
  if ($schemaName) {
    & $psqlPath -X --set ON_ERROR_STOP=1 --dbname $DatabaseUrl `
      -c "DROP SCHEMA IF EXISTS `"$schemaName`" CASCADE;" `
      -c "SELECT 'cleanup_schema_remaining' AS observation, count(*) AS schema_count FROM information_schema.schemata WHERE schema_name = '$schemaName';" 2>&1 | Tee-Object -FilePath $evidencePath -Append
    if ($LASTEXITCODE -ne 0) { Write-Warning "Could not remove isolated schema $schemaName." }
  }
}
