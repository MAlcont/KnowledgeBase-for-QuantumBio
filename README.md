<p align="center">
  <img src="assets/kb4qb-logo.png" alt="KB4qb: a stylised Vitruvian figure with four flowing arms, dancing legs and a drape" width="260">
</p>

<p align="center"><strong>A body / organism is a knowledge base for quantum biology.</strong></p>

# KB4qb
A small literature compass for quantum biology. One repository, with separate middleware and research archive folders.
- `middleware/`: read-only interface, source-link validation, CSV and language-model-context exports.
- `archive/`: five research fragments, journal links, surface parameters and provenance.
Licensing remains undecided.

# kqbarc-hive · Public inference notebook as a table @ https://www.quantumbiology.xyz

We start with a question about a human body. Where does a process occur? What varies there, and on what timescale? What observation could distinguish two explanations? This repository uses the surface parameters of KB4qb to follow such questions from physiology through biophysics to the literature and, where available, human intervention evidence. The original sample papers are starting points. A new investigation can begin with any well-specified tissue or cross-tissue question.

The purpose of keeping this notebook public is to let another reader retrace an inference, challenge a term, or resume an open question. The choice of a search term is itself part of the inference.

## Three levels of an investigation

1. **The researcher asks.** Preserve the original question, its anatomical scope and the observation that would help answer it.
2. **Codex frames a physiology quest.** Read related investigations and distill the question to the two most relevant physiological elements, such as a pair of molecules. Say why each matters and ask how their interaction could help explain a process in a cell, tissue or organ. Keep plausible alternatives visible. Use tissue, species, timescale and study design to read the papers wherever the API cannot express them.
3. **Biomiv returns JSON.** Query the pair through the network endpoint, which accepts one named entity and an optional second entity. Record the exact request, the returned identities, paths, relationship wording and source references. Use Biomiv’s versioned vocabulary to interpret direction, sign and the aspect affected. A one-edge path describes proximity in the graph. Whether a source demonstrates a direct molecular mechanism is a separate question.

### Reading the Biomiv result

- **Accuracy.** Judge how well the cited evidence supports the proposed connection in that physiological setting. Name the Biomiv entities and relation, then briefly say whether the evidence is direct, indirect, conflicting or unverified.
- **Rate of coherence (0–3).** Compare the result with the original prompt and the distilled quest. Give one point each for matching the two elements, addressing the proposed relationship and covering the anatomical setting. Name any main gap in plain language. Leave empty or failed lookups unscored.
- **Comment.** Give the most relevant biophysical formula when justified and define its terms. Add one plain-language sentence about what the interaction could mean for the larger anatomical process.

## Surface parameters

| KB4qb dimension | Question the record answers |
|---|---|
| Physiology | Which human organ, tissue, cell type or compartment anchors the question? For a cross-tissue question, what passes between the sites, and what is measured at each? Record the species and system actually studied. |
| Mathematics | Which physiological quantity varies? Define its observable, units and timescale. Name a stochastic model or distribution when justified, and distinguish measured variation, model-inferred quantities and uncertainty in the estimate. |
| Hypotheses & journal library | Which interpretations could explain the variation? Record competing explanations, the papers that motivate them and an observation that could distinguish them. |
| Evidence | What did each study measure under its particular conditions? Which interpretations fit those measurements and the wider biophysics? Keep contrary observations and unresolved alternatives visible. |
| Translational relevance | What evidence reaches the scale of a human intervention? Record the population, intervention, comparator and outcome where available. If the inquiry finds only model, animal or human observational evidence, state that scope. |
| Source record | Preserve the provenance of each inference, including the original question, vocabulary mapping, lookup date, endpoint and parameters, matched identifiers, returned relations, citations and the curator’s interpretation. |

The **inference vocabulary** runs through all six dimensions. The source record preserves how ordinary language became a KB4qb concept, how that concept became a Biomiv entity or relation, and which parts of the question remained for a human to interpret.

## Example · From tissue physiology to a ferritin question

Suppose the question is whether variation in iron handling within a particular tissue helps explain variation in a circulating measurement. First specify the tissue, the measurement and the timescale. One quest might ask how ferritin and the labile iron pool in liver cells contribute to the liver’s iron buffering. Record why each was selected and whether the paper concerns a circulating biomarker, a tissue measurement or a particular protein subunit. Those choices can lead to different searches.

If the question is about fluctuations over time, ask whether the paper repeatedly measured the same system. Differences among people at a single time point answer a different question. A Biomiv relationship can point to a paper worth reading. The paper’s design determines which question it can answer.

## How to resume a question

The proposed record layout is one versioned JSON file per investigation under `investigations/`. Each file carries a stable ID, links to any relevant KB4qb fragments, the question and dated lookups, papers checked, current interpretation and next open question. Keep an unmatched name, an empty search and a failed request distinguishable. On a new prompt, read the related record first and append new observations with their dates. Promote a claim into the curated archive when its supporting source and scope have been reviewed.

[Original KB4qb archive](https://github.com/MAlcont/KnowledgeBase-for-QuantumBio/tree/main/archive) · [Biomiv agent documentation](https://biomiv.com/ai-agents) · [API schema](https://biomiv.com/openapi.json) · [Relation vocabulary](https://biomiv.com/api/v1/healthspan/network/vocabulary)
