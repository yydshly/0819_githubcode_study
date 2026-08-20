# Installation and Discovery

`$punk-publish` is a research extension in this repository. It is not part of `adrianpunk/Punk-Skill`.

## Two required locations

1. Upstream visual Skills: install or load <https://github.com/adrianpunk/Punk-Skill>. This provides `$punk-cover` and `$punk-avatar`. For the exact version evaluated by this study, use the pinned procedure in [upstream-reuse.md](upstream-reuse.md).
2. Research publication Skill: load the local directory `studies/punk-skill/extensions/punk-publish/`. This provides `$punk-publish`.

When the Agent shares this repository workspace, ask it to load the local directory directly. When distributing elsewhere, copy the complete `punk-publish` directory into that environment's supported Skills directory, preserving `SKILL.md`, `agents/`, `scripts/`, and `references/`.

In this repository, prefer the reproducible bootstrap over an unpinned clone:

```powershell
python studies/punk-skill/extensions/punk-publish/scripts/bootstrap_upstream.py fetch --run-checks
```

The command returns the verified absolute entrypoint paths for both upstream Skills. It keeps the complete upstream repository layout intact so their shared `styles/` references continue to resolve.

## Discovery check

Before issuing a production task, confirm:

- `$punk-publish` resolves to this research Skill;
- `$punk-cover` resolves to the upstream Skill when a generated visual is required;
- `scripts/package_publication.py` is readable and Python is available when filesystem packaging is requested.

If `$punk-publish` is missing, stop and provide its local path. If only `$punk-cover` is missing, continue the text package and set the visual state to `dependency-missing`; do not claim that an image exists.
