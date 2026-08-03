[CmdletBinding()]
param(
    [string]$Scope = "cadguardians-projects-c28eede5",
    [switch]$Execute
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$protectedProjects = @(
    "mkathleen-llc"
)

$probeProjects = @(
    "mkathleen-filepath-probe",
    "mkathleen-base64-probe",
    "mkathleen-bundle-build-probe",
    "mkathleen-llc-contract-test",
    "mkathleen-llc-binary-test",
    "mkathleen-cdn-verification",
    "mkathleen-photo-verification",
    "mkathleen-pages-verification"
)

if ($probeProjects.Count -ne 8) {
    throw "Safety check failed: expected exactly 8 allowlisted probe projects."
}

$protectedCollision = $probeProjects | Where-Object { $_ -in $protectedProjects }
if ($protectedCollision) {
    throw "Safety check failed: a protected project appears in the deletion allowlist: $($protectedCollision -join ', ')."
}

if ([string]::IsNullOrWhiteSpace($Scope)) {
    throw "Safety check failed: Vercel scope cannot be empty."
}

Write-Host "Vercel scope: $Scope"
Write-Host "Protected project: $($protectedProjects -join ', ')"
Write-Host "Allowlisted probe projects ($($probeProjects.Count)):"
$probeProjects | ForEach-Object { Write-Host "  - $_" }

if (-not $Execute) {
    Write-Host "DRY RUN ONLY. No Vercel projects were deleted. Re-run with -Execute after review."
    exit 0
}

if ([string]::IsNullOrWhiteSpace($env:VERCEL_TOKEN)) {
    throw "VERCEL_TOKEN is required for an executed cleanup. Store it as a GitHub Actions environment or repository secret; never commit it."
}

foreach ($project in $probeProjects) {
    if ($project -in $protectedProjects) {
        throw "Refusing to delete protected project '$project'."
    }

    Write-Host "Deleting allowlisted Vercel probe project: $project"

    & npx --yes vercel@latest project rm $project `
        --scope $Scope `
        --token $env:VERCEL_TOKEN `
        --yes

    if ($LASTEXITCODE -ne 0) {
        throw "Vercel CLI failed while deleting '$project' with exit code $LASTEXITCODE. Cleanup stopped."
    }
}

Write-Host "All eight allowlisted probe deletion commands completed. Verify the Vercel project inventory before closing the cleanup record."
