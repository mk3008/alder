param(
  [Parameter(Mandatory = $true)]
  [string]$DatabaseUrl
)

$ErrorActionPreference = 'Stop'
$implementationRoot = $PSScriptRoot
$repositoryRoot = (Resolve-Path (Join-Path $implementationRoot '..\..\..\..\..')).Path
$ddlPath = Join-Path $repositoryRoot 'work\workflow-validation\frozen\ddl.sql'
$reportOperationPath = Join-Path $implementationRoot 'report_equipment_fault.sql'
$lifecycleOperationPath = Join-Path $implementationRoot 'maintenance_lifecycle.sql'
$stage1AcceptancePath = Join-Path $implementationRoot 'stage1-acceptance.sql'
$stage2AcceptancePath = Join-Path $implementationRoot 'stage2-acceptance.sql'
$schemaName = 'stage2_' + [Guid]::NewGuid().ToString('N')
$psqlPath = 'C:\Program Files\PostgreSQL\18\bin\psql.exe'
$evidencePath = Join-Path $implementationRoot 'acceptance-evidence.log'

if (-not (Test-Path $psqlPath)) { throw "psql was not found at $psqlPath; acceptance is inconclusive." }

try {
  "schema_name=$schemaName" | Set-Content $evidencePath
  "runner_started_utc=$([DateTime]::UtcNow.ToString('o'))" | Add-Content $evidencePath
  & $psqlPath -X --set ON_ERROR_STOP=1 --dbname $DatabaseUrl `
    -c "CREATE SCHEMA `"$schemaName`";" `
    -c "SET search_path TO `"$schemaName`";" `
    -c "SELECT 'runner_session' AS observation, current_database() AS database_name, current_user AS database_user, pg_backend_pid() AS backend_pid, current_schema() AS schema_name;" `
    -f $ddlPath `
      -f $reportOperationPath `
      -f $lifecycleOperationPath `
      -f $stage1AcceptancePath `
      -f $stage2AcceptancePath 2>&1 | Tee-Object -FilePath $evidencePath -Append
  if ($LASTEXITCODE -ne 0) { throw "Cumulative Stage 1 + Stage 2 acceptance failed with psql exit code $LASTEXITCODE." }
}
finally {
  if ($schemaName) {
    & $psqlPath -X --set ON_ERROR_STOP=1 --dbname $DatabaseUrl `
      -c "DROP SCHEMA IF EXISTS `"$schemaName`" CASCADE;" `
      -c "SELECT 'cleanup_schema_remaining' AS observation, count(*) AS schema_count FROM information_schema.schemata WHERE schema_name = '$schemaName';" 2>&1 | Tee-Object -FilePath $evidencePath -Append
    if ($LASTEXITCODE -ne 0) { Write-Warning "Could not remove isolated schema $schemaName." }
  }
}
