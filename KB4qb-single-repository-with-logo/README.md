<p align="center">
  <img src="assets/kb4qb-logo.png" alt="KB4qb: a stylised Vitruvian figure with four flowing arms, dancing legs and a drape" width="260">
</p>

<p align="center"><strong>A body / organism is a knowledge base for quantum biology.</strong></p>

# KB4qb

A small literature compass for quantum biology. One repository, with separate middleware and research archive folders.

- `middleware/`: read-only interface, source-link validation, CSV and language-model-context exports.
- `archive/`: five research fragments, journal links, surface parameters and provenance.

## Publish on GitHub

1. Create one repository named `KB4qb` with default branch `main`.
2. Upload the contents of this folder to its root, including `.github/workflows/pages.yml`.
3. Select **Settings → Pages → Source → GitHub Actions**.
4. Run **Actions → Build and publish KB4qb**, or push a commit to `main`.

The workflow tests the middleware, builds the current archive and publishes `dist/`. The site automatically opens the archive. No second repository, external archive URL, dependency installation or account integration is required.

## Preview locally

Requires Node 22+ and Python 3. From this folder:

```sh
npm test
npm run build
python3 -m http.server 8000 --directory dist
```

Open http://localhost:8000. Do not open index.html directly via file://.

## Focus: grow the samples

Add a source-linked fragment in `archive/`, preserving experimental context, units, provenance and unknowns. Commit it. The deployment workflow rebuilds the delivery bundle automatically. Hand-edit canonical data, not the generated bundle. Keep code changes limited to real extraction or usability needs.

The archive currently contains F01–F05. Mitochondria, wound healing and magnetic targets are the next planned focused samples; no new research was added during this consolidation.

No field-completeness score, clinical interpretation, live Google Sheets sync, model API or automatic evidence grade is provided. CSV exports and model-context packages are functional. Historical mathematical checks are retained in the legacy material but are not run as scientific verdicts in the interface.

Verification: data and interaction checks passed; browser visual verification was unavailable in the preparation environment. This package has not been deployed to GitHub. Licensing remains undecided.
