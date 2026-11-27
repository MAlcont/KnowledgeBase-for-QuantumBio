# Agent instructions

At the start of a Hive session, read the [quest pipeline](README.md#from-quest-to-reviewed-inference) and [`backlog.md`](backlog.md). Run the same five stages for the user's current physiology question and record the outcome in the quest process log.

Before making a Biomiv request or revisiting a research question, read related entries in `investigations/inferences.jsonl` and any matching `investigations/*.json` notes. Reuse dated lookups when they still answer the question. Append dated observations to preserve earlier interpretations. Keep exploratory findings out of curated archive claims until source review supports a change. The canonical archive is `archive/data/kb.json` and related source records. Regenerate `archive/archive.json` and the Pages bundle with `npm run build` after canonical archive edits.
