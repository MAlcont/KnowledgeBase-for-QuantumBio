# KB4qb research archive

Data-only folder within the single KB4qb repository. The site loads this archive automatically after the root build. Edit the canonical records below; the deployment workflow regenerates archive.json. See the root README.

## Canonical records and delivery bundle

- `data/kb.json`: five-layer index, source links, claims and model descriptions; core schema 0.2.0.
- `data/parameter-space.json`: preserved F04 structured experimental data and historical audit inputs.
- `articles/F05-meyer-2008.json`: compact F05 surface record with new/reused data provenance.
- `data/surface-vocabulary.json`: local archive term definitions.
- `exports/`: previously generated spreadsheet views.
- `selection-log.json`: earlier article-selection rationale.
- `archive.json`: generated, self-contained read-only delivery bundle, bundle schema 1.0.

Edit canonical records, then rebuild `archive.json` using the root `npm run build` command. Do not maintain contradictory manual edits to both forms. Existing CSV files are dated extraction views; use the middleware to export current filtered views after an update.

## Current samples

| Fragment | Source | Extraction scope |
|---|---|---|
| F01 | Hayashi & Stuchebrukhov, 2010 | Preliminary electron-transfer fragment |
| F02 | Sherrard et al., 2018 | Preliminary cryptochrome / magnetic-response fragment |
| F03 | Arany et al., 2014 | Preliminary light / dental-repair fragment |
| F04 | Sang et al., 2022 | Two abiotic contexts, 21 typed quantities |
| F05 | Meyer et al., 2008 | Five surface fit results: three new, two reused |

The archive is a sample of what has been extracted, not a systematic field map. Unknowns, extraction limits and source attribution remain visible. No record is community-surfaced yet. There is no global evidence or translation score. The original 5% audit tolerance is retained as historical curator metadata only; the browser does not execute it or classify articles with it.

Future mitochondrial, wound-healing and magnetic-target samples remain planned. No unseen ontology IDs, clinical outcomes or parameters were added to fill those areas. Full journal text is not redistributed. Archive compatibility has been checked, not scientific validity.
