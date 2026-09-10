param(
    [Parameter(Mandatory = $true)] [string] $RunDirectory,
    [Parameter(Mandatory = $true)] [string] $OutputDirectory
)

$ErrorActionPreference = 'Stop'
$run = (Resolve-Path -LiteralPath $RunDirectory).Path
$out = New-Item -ItemType Directory -Force -Path $OutputDirectory
$sourceRoot = Join-Path $run 'src/main/java'
$types = @()

Get-ChildItem -LiteralPath $sourceRoot -Filter '*.java' -File -Recurse | Sort-Object FullName | ForEach-Object {
    $sourceFile = $_
    $text = Get-Content -LiteralPath $sourceFile.FullName -Raw
    $packageMatch = [regex]::Match($text, '(?m)^\s*package\s+([\w.]+)\s*;')
    $package = if ($packageMatch.Success) { $packageMatch.Groups[1].Value } else { '' }
    [regex]::Matches($text, '(?m)^\s*(public\s+)?(?:(?:final|abstract|sealed|non-sealed)\s+)*(class|interface|record|enum)\s+(\w+)') | ForEach-Object {
        $types += [ordered]@{
            source = $sourceFile.FullName.Substring($run.Length + 1).Replace('\', '/')
            package = $package
            name = $_.Groups[3].Value
            kind = $_.Groups[2].Value
            declaredVisibility = if ($_.Groups[1].Success) { 'public' } else { 'package-private' }
            fqcn = if ($package) { "$package.$($_.Groups[3].Value)" } else { $_.Groups[3].Value }
        }
    }
}

$types | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath (Join-Path $out 'top-level-types.json') -Encoding utf8

# Generic compiler probe: create an external-package source referencing every discovered
# top-level type one at a time. No candidate-specific type names are preconfigured.
$probeResults = @()
foreach ($type in $types) {
    $probeRoot = Join-Path $run (".observer-probes/probe-" + $type.name)
    $probeSource = Join-Path $probeRoot 'external/Probe.java'
    New-Item -ItemType Directory -Force -Path (Split-Path $probeSource) | Out-Null
    @"
package external;
import $($type.fqcn);
public final class Probe { Class<?> observed = $($type.name).class; }
"@ | Set-Content -LiteralPath $probeSource -Encoding utf8
    $containerRun = $run.Replace('\', '/')
    $containerProbe = $probeSource.Replace('\', '/').Substring($run.Length + 1)
    $command = "rm -rf /work/out && mkdir /work/out && javac -d /work/out `$(find /work/src/main/java -name '*.java') /work/$containerProbe"
    $result = & docker run --rm -v "${containerRun}:/work" -w /work eclipse-temurin:21-jdk sh -lc $command 2>&1
    $probeResults += [ordered]@{
        fqcn = $type.fqcn
        declaredVisibility = $type.declaredVisibility
        externalCompilationExitCode = $LASTEXITCODE
        compilerOutput = ($result -join "`n")
    }
    Remove-Item -LiteralPath $probeRoot -Recurse -Force
}
$probeResults | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath (Join-Path $out 'external-type-probes.json') -Encoding utf8
