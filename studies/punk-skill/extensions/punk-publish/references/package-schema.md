# Publication Package Schema

Pass a UTF-8 JSON object to `scripts/package_publication.py`.

## Required input

```json
{
  "slug": "ai-agent-rnd",
  "platform": "xiaohongshu",
  "source_summary": "What the source is about.",
  "copy": {
    "title": "Exact cover/post title",
    "post": "Editable body copy",
    "summary": "Short reusable summary",
    "cta": "One concrete next action",
    "hashtags": ["#AI", "#效率工具"],
    "alt_text": "Concise description of the meaningful visual and visible text."
  },
  "visual": {
    "style_id": "retro-torn-collage",
    "ratio": "3:4",
    "cover_title": "Exact cover title",
    "cover_subtitle": "Optional subtitle",
    "prompt_path": "optional/existing/prompt.md",
    "artwork_path": "optional/existing/artwork.png",
    "cover_path": "optional/existing/cover.png"
  },
  "provenance": {
    "generator": "Agent or workflow name",
    "generated_at": "optional ISO-8601 timestamp"
  }
}
```

Unknown keys are ignored. Required text fields must be non-empty. `hashtags` must be an array of strings. The slug may contain only lowercase letters, digits, and single hyphens.

## Deterministic output

```text
<output>/<slug>/
├── copy/
│   ├── title.md
│   ├── post.md
│   ├── summary.md
│   ├── cta.md
│   ├── hashtags.md
│   └── alt-text.md
├── visual/
│   └── cover-copy.json
└── manifest.json
```

The script writes copy and metadata only. It never fabricates, copies, or downloads images. Every managed output file is recorded with its actual byte length and SHA-256. Optional visual paths are included with their real byte length and SHA-256 only when they already exist at packaging time; otherwise they appear in `missing_optional_assets`.

`manifest.json` always records `status: draft-not-published` and `schema_version: punk-publish/2`. It does not hash itself.
