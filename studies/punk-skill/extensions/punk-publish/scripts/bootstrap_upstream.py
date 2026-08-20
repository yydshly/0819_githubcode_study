#!/usr/bin/env python3
"""Fetch or verify the pinned Punk-Skill checkout without vendoring it here."""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Any


SCRIPT_PATH = Path(__file__).resolve()
STUDY_DIR = SCRIPT_PATH.parents[3]
REPOSITORY_ROOT = SCRIPT_PATH.parents[5]
DEFAULT_LOCK = STUDY_DIR / "upstream-lock.json"
DEFAULT_CHECKOUT = REPOSITORY_ROOT / "vendor-projects" / "Punk-Skill"


class BootstrapError(RuntimeError):
    """Raised when a pinned checkout cannot be created or verified safely."""


def run_git(checkout: Path | None, *arguments: str) -> str:
    command = ["git"]
    if checkout is not None:
        safe_checkout = checkout.as_posix()
        command.extend(["-c", f"safe.directory={safe_checkout}", "-C", str(checkout)])
    command.extend(arguments)
    completed = subprocess.run(
        command,
        check=False,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    if completed.returncode != 0:
        detail = completed.stderr.strip() or completed.stdout.strip()
        raise BootstrapError(f"Git command failed: {' '.join(command)}\n{detail}")
    return completed.stdout.strip()


def load_lock(path: Path) -> dict[str, Any]:
    try:
        lock = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise BootstrapError(f"Cannot read lock file {path}: {error}") from error
    for field in ("repository", "commit", "tree", "skills", "required_paths"):
        if not lock.get(field):
            raise BootstrapError(f"Lock file is missing required field: {field}")
    return lock


def normalize_repository(value: str) -> str:
    return value.rstrip("/").removesuffix(".git").lower()


def ensure_checkout(lock: dict[str, Any], checkout: Path) -> None:
    git_directory = checkout / ".git"
    created_checkout = False
    if checkout.exists() and not git_directory.is_dir():
        raise BootstrapError(
            f"Refusing to replace existing non-Git path: {checkout}"
        )
    if not checkout.exists():
        checkout.parent.mkdir(parents=True, exist_ok=True)
        run_git(None, "clone", "--no-checkout", lock["repository"], str(checkout))
        created_checkout = True

    origin = run_git(checkout, "remote", "get-url", "origin")
    if normalize_repository(origin) != normalize_repository(lock["repository"]):
        raise BootstrapError(
            f"Origin mismatch for {checkout}: expected {lock['repository']}, found {origin}"
        )

    if not created_checkout:
        dirty = run_git(checkout, "status", "--porcelain")
        if dirty:
            raise BootstrapError(
                f"Refusing to change dirty upstream checkout: {checkout}\n{dirty}"
            )

    commit = lock["commit"]
    object_check = subprocess.run(
        [
            "git",
            "-c",
            f"safe.directory={checkout.as_posix()}",
            "-C",
            str(checkout),
            "cat-file",
            "-e",
            f"{commit}^{{commit}}",
        ],
        check=False,
        capture_output=True,
    )
    if object_check.returncode != 0:
        run_git(checkout, "fetch", "--depth", "1", "origin", commit)
    run_git(checkout, "checkout", "--detach", commit)


def verify_checkout(lock: dict[str, Any], checkout: Path) -> dict[str, Any]:
    if not (checkout / ".git").is_dir():
        raise BootstrapError(
            f"Pinned checkout is missing: {checkout}. Run the fetch command first."
        )

    origin = run_git(checkout, "remote", "get-url", "origin")
    if normalize_repository(origin) != normalize_repository(lock["repository"]):
        raise BootstrapError(
            f"Origin mismatch: expected {lock['repository']}, found {origin}"
        )

    head = run_git(checkout, "rev-parse", "HEAD")
    tree = run_git(checkout, "rev-parse", "HEAD^{tree}")
    if head != lock["commit"]:
        raise BootstrapError(f"Commit mismatch: expected {lock['commit']}, found {head}")
    if tree != lock["tree"]:
        raise BootstrapError(f"Tree mismatch: expected {lock['tree']}, found {tree}")

    missing = [
        relative_path
        for relative_path in lock["required_paths"]
        if not (checkout / relative_path).exists()
    ]
    if missing:
        raise BootstrapError(f"Required upstream paths are missing: {', '.join(missing)}")

    style_directories = sorted(
        path.parent
        for path in (checkout / "styles").glob("*/META.md")
        if (path.parent / "STYLE.md").is_file()
    )
    expected_styles = lock.get("expected_style_directories")
    if expected_styles is not None and len(style_directories) != expected_styles:
        raise BootstrapError(
            f"Style count mismatch: expected {expected_styles}, found {len(style_directories)}"
        )

    return {
        "status": "verified",
        "repository": lock["repository"],
        "commit": head,
        "tree": tree,
        "checkout": str(checkout.resolve()),
        "styles": len(style_directories),
        "skills": {
            item["name"]: str((checkout / item["entrypoint"]).resolve())
            for item in lock["skills"]
        },
        "redistribution": "upstream-not-vendored",
    }


def run_upstream_checks(checkout: Path) -> list[str]:
    node = shutil.which("node")
    if node is None:
        raise BootstrapError("Node.js is required for --run-checks but was not found.")
    outputs: list[str] = []
    for script in ("validate-punk-cover.mjs", "validate-punk-avatar.mjs"):
        completed = subprocess.run(
            [node, str(checkout / "scripts" / script)],
            cwd=checkout,
            check=False,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
        )
        if completed.returncode != 0:
            detail = completed.stderr.strip() or completed.stdout.strip()
            raise BootstrapError(f"Upstream check failed ({script}):\n{detail}")
        outputs.append(completed.stdout.strip())
    return outputs


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Fetch or verify the Punk-Skill commit pinned by this study."
    )
    parser.add_argument(
        "action",
        choices=("fetch", "verify"),
        help="fetch creates/updates the ignored checkout; verify is read-only",
    )
    parser.add_argument("--lock", type=Path, default=DEFAULT_LOCK)
    parser.add_argument("--checkout", type=Path, default=DEFAULT_CHECKOUT)
    parser.add_argument(
        "--run-checks",
        action="store_true",
        help="run the two upstream Node.js structural validators after verification",
    )
    return parser.parse_args()


def main() -> int:
    arguments = parse_arguments()
    try:
        lock = load_lock(arguments.lock.resolve())
        checkout = arguments.checkout.resolve()
        if arguments.action == "fetch":
            ensure_checkout(lock, checkout)
        result = verify_checkout(lock, checkout)
        if arguments.run_checks:
            result["checks"] = run_upstream_checks(checkout)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0
    except BootstrapError as error:
        print(f"bootstrap error: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
