# Vercel probe cleanup

## Decision

Retain the legitimate Vercel project:

- `mkathleen-llc`

Remove only these eight one-purpose troubleshooting projects:

1. `mkathleen-filepath-probe`
2. `mkathleen-base64-probe`
3. `mkathleen-bundle-build-probe`
4. `mkathleen-llc-contract-test`
5. `mkathleen-llc-binary-test`
6. `mkathleen-cdn-verification`
7. `mkathleen-photo-verification`
8. `mkathleen-pages-verification`

The cleanup script uses an exact allowlist. It does not accept wildcards, repository input, or arbitrary project names. The retained project is separately hard-blocked.

## Repository authority

This repository's documented public release remains GitHub Pages:

- `https://tsmithcode.github.io/mkathleen-llc/`

The retained Vercel project is not deleted by this operation. Any future decision to decommission it requires a separate review of domains, traffic, integrations, and rollback requirements.

## Dry run

```powershell
./scripts/Remove-VercelProbeProjects.ps1
```

The default mode prints the exact scope, protected project, and eight deletion targets. It performs no mutation.

## GitHub Actions execution

1. Add `VERCEL_TOKEN` as a GitHub Actions repository secret or as a secret in the `vercel-cleanup` environment.
2. Open **Actions → Governed Vercel probe cleanup → Run workflow**.
3. First run with `execute=false` and review the allowlist.
4. Run again with `execute=true` and confirmation `DELETE_MKATHLEEN_PROBES`.
5. Re-list the Vercel projects and verify that `mkathleen-llc` remains while all eight probe projects are absent.

## Local execution

```powershell
$env:VERCEL_TOKEN = "<temporary-token>"
./scripts/Remove-VercelProbeProjects.ps1 -Execute
Remove-Item Env:VERCEL_TOKEN
```

Never place the token in source control, workflow YAML, documentation, shell history, or an issue comment.

## Closure criteria

The cleanup is complete only when all of the following are true:

- `mkathleen-llc` remains present.
- All eight allowlisted probes are absent.
- No custom domain was detached from the retained project.
- The GitHub Pages deployment remains healthy.
- The cleanup run is retained in GitHub Actions as an audit record.
