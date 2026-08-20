---
name: punk-publish
description: Compile source content into a complete, platform-ready publication package containing editable copy, a visual subtask, accessibility text, and a traceable manifest. Use when a user wants a Xiaohongshu post or another social/content deliverable rather than a standalone cover image. This skill prepares draft assets but never logs in, posts, schedules, or claims that a missing image was generated.
---

# Punk Publish

Turn one source item into a reviewable publication folder. Treat the image as one component of the package, not the final product.

## Dependency Discovery

Before starting, verify that this Skill itself is loaded and whether `$punk-cover` is discoverable in the current Agent environment. When setup is missing, read [references/installation.md](references/installation.md) and report the exact missing path or dependency. Do not emit a `$punk-publish` or `$punk-cover` invocation that the current environment cannot resolve without also providing its setup instruction.

`$punk-cover` is an optional visual dependency, not a reason to discard the copy task. If it is missing, complete the text package and mark the visual subtask `dependency-missing`.

## Boundaries

- Produce drafts only. Never authenticate to, post on, or schedule content for a platform.
- Do not invent image files. Record an artwork or cover path only when that file actually exists.
- Use `$punk-cover` for the visual subtask when it is available. If it is unavailable, still deliver copy, alt text, a visual brief, and a manifest that marks the visual dependency as missing.
- Keep model-rendered artwork and deterministic typography separate: `artwork.png` is the no-text visual; `cover.png` is the final composition with exact title text.
- Use one visual style per cover. Do not silently blend several Punk styles.

## Workflow

1. Confirm the platform, audience, communication goal, source content, and desired output slug. If the platform is missing and cannot be inferred safely, ask for it.
2. Read [references/platforms.md](references/platforms.md) for the selected platform. Use its targets as editorial defaults, not claimed platform limits.
3. Derive an editable copy set:
   - title and opening hook;
   - post body with scannable paragraphs;
   - short summary;
   - one concrete call to action;
   - relevant hashtags without keyword stuffing;
   - alt text that describes the meaningful visual and visible cover text.
4. Create the visual subtask:
   - select exactly one `$punk-cover` style;
   - specify the platform ratio;
   - request and save the complete prompt before image generation;
   - request no text in the model-generated artwork when exact typography will be added later;
   - define the exact cover title/subtitle placement separately.
5. Read [references/package-schema.md](references/package-schema.md), create its JSON input, and run `scripts/package_publication.py` to write the deterministic copy and manifest files.
6. Add real visual files only after they exist. Update `manifest.json` so every recorded file path is truthful.
7. Report the package path, included files, missing dependencies, and `draft-not-published` status.

## Quality Check

Before handing off, verify:

- the title, body, CTA, hashtags, and alt text agree with the source;
- the artwork does not contain unreliable model-generated title text;
- the visible cover text can be reproduced from `visual/cover-copy.json`;
- all manifest paths exist or are explicitly listed as missing;
- no wording implies that the package has been posted.
- the handoff names whether `$punk-cover` was discovered, missing, or deliberately skipped.

## Typical Invocation

`Use $punk-publish to turn this source into a complete Xiaohongshu publication package. Use $punk-cover in one selected style for a 3:4 no-text artwork, then add deterministic cover copy. Include editable copy, hashtags, alt text, prompt provenance, and manifest. Do not publish it.`
