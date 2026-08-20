#!/usr/bin/env python3
"""Write a truthful, deterministic publication package from validated JSON."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path
from typing import Any


SLUG_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
REQUIRED_COPY_FIELDS = ("title", "post", "summary", "cta", "alt_text")
OPTIONAL_VISUAL_PATHS = ("prompt_path", "artwork_path", "cover_path")


def require_text(container: dict[str, Any], key: str, scope: str) -> str:
    value = container.get(key)
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{scope}.{key} must be a non-empty string")
    return value.strip()


def validate(payload: dict[str, Any]) -> dict[str, Any]:
    slug = require_text(payload, "slug", "root")
    if not SLUG_PATTERN.fullmatch(slug):
        raise ValueError("root.slug must use lowercase letters, digits, and single hyphens")

    require_text(payload, "platform", "root")
    require_text(payload, "source_summary", "root")

    copy = payload.get("copy")
    if not isinstance(copy, dict):
        raise ValueError("root.copy must be an object")
    for field in REQUIRED_COPY_FIELDS:
        require_text(copy, field, "copy")
    hashtags = copy.get("hashtags")
    if not isinstance(hashtags, list) or not hashtags or not all(isinstance(tag, str) and tag.strip() for tag in hashtags):
        raise ValueError("copy.hashtags must be a non-empty array of strings")

    visual = payload.get("visual")
    if not isinstance(visual, dict):
        raise ValueError("root.visual must be an object")
    for field in ("style_id", "ratio", "cover_title"):
        require_text(visual, field, "visual")

    provenance = payload.get("provenance")
    if not isinstance(provenance, dict):
        raise ValueError("root.provenance must be an object")
    require_text(provenance, "generator", "provenance")
    return payload


def write_text(path: Path, value: str) -> None:
    path.write_text(value.rstrip() + "\n", encoding="utf-8")


def package(payload: dict[str, Any], output_root: Path) -> Path:
    package_root = output_root.resolve() / payload["slug"]
    copy_root = package_root / "copy"
    visual_root = package_root / "visual"
    copy_root.mkdir(parents=True, exist_ok=True)
    visual_root.mkdir(parents=True, exist_ok=True)

    copy = payload["copy"]
    file_values = {
        "copy/title.md": copy["title"],
        "copy/post.md": copy["post"],
        "copy/summary.md": copy["summary"],
        "copy/cta.md": copy["cta"],
        "copy/hashtags.md": " ".join(tag.strip() for tag in copy["hashtags"]),
        "copy/alt-text.md": copy["alt_text"],
    }
    for relative, value in file_values.items():
        write_text(package_root / relative, value)

    visual = payload["visual"]
    cover_copy = {
        "title": visual["cover_title"].strip(),
        "subtitle": str(visual.get("cover_subtitle", "")).strip(),
        "ratio": visual["ratio"].strip(),
        "style_id": visual["style_id"].strip(),
        "rendering": "deterministic-typography-over-no-text-artwork",
    }
    (visual_root / "cover-copy.json").write_text(
        json.dumps(cover_copy, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    existing_optional_assets: dict[str, dict[str, Any]] = {}
    missing_optional_assets: list[str] = []
    for key in OPTIONAL_VISUAL_PATHS:
        raw = visual.get(key)
        if not isinstance(raw, str) or not raw.strip():
            continue
        candidate = Path(raw).expanduser()
        if candidate.exists() and candidate.is_file():
            asset_bytes = candidate.read_bytes()
            existing_optional_assets[key] = {
                "path": str(candidate.resolve()),
                "bytes": len(asset_bytes),
                "sha256": hashlib.sha256(asset_bytes).hexdigest(),
            }
        else:
            missing_optional_assets.append(raw.strip())

    managed_paths = [*file_values.keys(), "visual/cover-copy.json"]
    file_records = []
    for relative in managed_paths:
        file_bytes = (package_root / relative).read_bytes()
        file_records.append(
            {
                "path": relative,
                "bytes": len(file_bytes),
                "sha256": hashlib.sha256(file_bytes).hexdigest(),
            }
        )

    manifest = {
        "schema_version": "punk-publish/2",
        "status": "draft-not-published",
        "slug": payload["slug"],
        "platform": payload["platform"].strip(),
        "source_summary": payload["source_summary"].strip(),
        "files": file_records,
        "visual": {
            "style_id": visual["style_id"].strip(),
            "ratio": visual["ratio"].strip(),
            "existing_optional_assets": existing_optional_assets,
            "missing_optional_assets": missing_optional_assets,
        },
        "provenance": payload["provenance"],
        "manifest_integrity": "The manifest does not hash itself; every managed output file is hashed from its written bytes.",
    }
    (package_root / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    return package_root


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True, type=Path, help="UTF-8 JSON input file")
    parser.add_argument("--output", required=True, type=Path, help="Output root directory")
    args = parser.parse_args()

    payload = json.loads(args.input.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise ValueError("root JSON value must be an object")
    package_root = package(validate(payload), args.output)
    print(json.dumps({"status": "ok", "package": str(package_root)}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
