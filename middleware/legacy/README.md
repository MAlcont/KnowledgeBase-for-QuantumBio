# KB4qb engine — frozen v0.2

Software only: tools, schemas, requirements and tests. Article content is maintained separately in KB4qb-archive. The Python source and schema files are byte-identical to the previous version. No new mathematical orchestration was added.

From a directory containing both extracted folders:

```sh
python -m pip install -r KB4qb-source/requirements.txt
python KB4qb-source/tools/kb.py validate --input KB4qb-archive/data/kb.json --parameters KB4qb-archive/data/parameter-space.json
python KB4qb-source/tools/kb.py export --input KB4qb-archive/data/kb.json --parameters KB4qb-archive/data/parameter-space.json --output KB4qb-archive/exports
```

The archive's new surface records are outside the specialized v0.2 typed-experiment schema. Only its core index and legacy parameter dataset are handled by the existing CLI. See the archive README for this boundary.

The retained tests use `data/kb.json` and `data/parameter-space.json` relative to this folder; copy the archive's two files into a local `data/` fixture directory before running them. This is a testing fixture, not the canonical article archive.

Historical 5% model-review thresholds remain in the legacy archive data; they are not universal scientific standards. New article sampling does not run those audits.
