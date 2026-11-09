# Middleware

Code for the single-repository KB4qb prototype. See the root README for launch and deployment.

`web/` holds the static interface. `tools/build-site.mjs` validates and assembles `../archive/` into the deployed site. `web/config.json` points to the generated same-origin archive.json. Local archive file loading remains available to inspect a different snapshot.

`legacy/` preserves the previous Python orchestrator and schemas. It is not deployed or executed by the browser. The current interface exports structured context for language models but does not call them.
