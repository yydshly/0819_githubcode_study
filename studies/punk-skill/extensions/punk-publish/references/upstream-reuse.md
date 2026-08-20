# Pinned Upstream Reuse

Use this procedure when `$punk-cover` or `$punk-avatar` must be fetched, verified, or rediscovered for a real `$punk-publish` task.

## Reproduce the studied version

From this repository root, run:

```powershell
python studies/punk-skill/extensions/punk-publish/scripts/bootstrap_upstream.py fetch --run-checks
```

The script reads `studies/punk-skill/upstream-lock.json`, checks out the exact upstream commit under the ignored `vendor-projects/Punk-Skill/` path, verifies its Git tree and 29 style directories, then runs both upstream structural validators. It refuses to replace a non-Git destination, switch an unrelated origin, or change a dirty checkout.

For a read-only later check:

```powershell
python studies/punk-skill/extensions/punk-publish/scripts/bootstrap_upstream.py verify --run-checks
```

Successful JSON output contains the absolute `punk-cover` and `punk-avatar` entrypoint paths. Load those entrypoints from the intact upstream checkout so their `../../styles/` references continue to resolve.

## Dependency states

- `verified`: the origin, commit, tree, required files, and style count match the lock.
- `dependency-missing`: no verified checkout is available; `$punk-publish` may still prepare text and mark the visual task missing.
- `version-mismatch`: an upstream checkout exists but does not match the study lock. Do not claim reproducibility until it is updated or a new lock is reviewed.

## Updating the lock

Do not follow upstream `main` silently. To research a newer version, inspect its changes and license, run its validators, update the commit and tree together, then re-run this bootstrap and the local evaluation protocol. Updating the lock is a research change and should receive its own commit.

The upstream repository currently has no declared license. The lock records provenance but contains no upstream Skill, style, or screenshot body. Keep the full checkout under the ignored `vendor-projects/` path unless a future license explicitly allows redistribution.
