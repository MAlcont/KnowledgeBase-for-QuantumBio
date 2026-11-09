# Verification — 2026-11-09

Passed:
- Twelve dependency-free Node unit tests for the runtime adapter.
- JavaScript syntax checks.
- Assembly/validation of the real five-fragment archive.
- Preservation of F04's 21 quantities and F05's five fit results.
- Source resolution in each fragment's model-context export.
- Mock-DOM interaction checks against the real archive: file import, fragment selection, parameter display, CSV download, model-context export, DOI search, empty community filter and invalid-file error.
- Core source records and previous parameter data are copied unchanged from the accumulated archive.

Not verified:
- Real-browser rendering, responsive layout and browser download behavior. The managed preview relay was unavailable; no alternate server or browser route was used to bypass it. Mock-DOM checks are not browser QA.
- A live GitHub Actions run, repository creation, remote CORS loading or production Pages publication.
- Scientific validity, article replication or clinical applicability.

Deployment workflow follows the official GitHub Pages Actions pattern. Final publication is performed in the user's two repositories using the README steps.
