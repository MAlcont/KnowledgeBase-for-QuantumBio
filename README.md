<p align="center">
  <img src="assets/kb4qb-logo.png" alt="KB4qb: a stylised Vitruvian figure with four flowing arms, dancing legs and a drape" width="260">
</p>

<p align="center"><strong>A body / organism is a knowledge base for quantum biology.</strong></p>

# KB4qb
A small literature compass for quantum biology. One repository, with separate middleware and research archive folders.
- `middleware/`: read-only interface, source-link validation, CSV and language-model-context exports.
- `archive/`: curated research fragments, journal links, surface parameters and provenance.
Licensing remains undecided.

# kqbarc-hive · Public inference notebook @ https://www.quantumbiology.xyz

We start with a question about a human body. Where does a process occur? What varies there, and on what timescale? What observation could distinguish two explanations? This repository uses the surface parameters of KB4qb to follow such questions from physiology through biophysics to the literature and, where available, human intervention evidence. The original sample papers are starting points. A new investigation can begin with any well-specified tissue or cross-tissue question.

The purpose of keeping this notebook public is to let another reader retrace an inference, challenge a term, or resume an open question. The choice of a search term is itself part of the inference.

## From quest to reviewed inference

Use the same five stages for any physiology topic, including digestion, endocrinology and respiration. Start with the current question and record each stage in the dated [quest process log](backlog.md#quest-process-log).

1. **Quest.** Preserve the original question, its anatomical scope and the observation that would help answer it.
2. **Elements.** Translate the question into a proposed relationship between two named entities from Biomiv’s network of genes, proteins, enzymes, biochemicals, plant compounds and drug compounds. Record the pair and why it fits before looking at the reply. Consult related earlier investigations when available.
3. **Biomiv.** Query the pair through the network endpoint or cite a dated reply that answers the same lookup. Keep exact requests, full JSON replies and statuses, including any retries. Use Biomiv’s vocabulary to interpret direction, sign and the aspect affected. A one-edge path describes proximity in the graph. Whether a source demonstrates a direct molecular mechanism is a separate question.
4. **Judgment.** Judge the accuracy of the proposed explanation against the evidence, then score how well the lookup answers the original quest. Record the reaction or formula, brief explanation, and 3×3 node votes when supported. See the rubric below.
5. **Taxonomy.** Append the result to the ledger and add supported links under the closest physiological branch in [`visualisation.md`](visualisation.md). Use short relation labels and brief notes. Record the branch added to or the evidence gap that deferred the addition. Reserve regrouping and deduplication for a dedicated pass.

### Reading the Biomiv result

- **Accuracy.** Judge how well the cited evidence supports the proposed connection in that physiological setting. Name the Biomiv entities and relation, then briefly say whether the evidence is direct, indirect, conflicting or unverified.
- **Rate of coherence (0–3).** Compare the result with the original prompt and the distilled quest. Give one point each for matching the two elements, addressing the proposed relationship and covering the anatomical setting. Name any main gap in plain language. Leave empty or failed lookups unscored.
- **Formula or reaction.** Give the most relevant biophysical formula when justified and define its terms. A chemical reaction can show the transformation when a suitable model is unavailable. Add one plain-language sentence about what the interaction could mean for the larger anatomical process. Cite any evidence used to extend the Biomiv result.

## Ledger and weighted vocabulary

The [inference ledger](investigations/inferences.jsonl) uses one JSONL row per reviewed inference. Each row records the original question, the two-element quest, the lookup and selected relation, the evidence judgment, the reaction or formula, and a brief explanation with sources. Save each complete, dated Biomiv reply under [`investigations/biomiv/`](investigations/biomiv/) and link it from the ledger. The first respiration entry predates full-reply archiving and preserves the selected fields.

The **vector space** uses readable features such as entity IDs, relation terms, and anatomical context. Record which features came from Biomiv and which came from physiological interpretation. After reviewing the reply, give each node a vote on a **3×3 grid** with accuracy and coherence each ranging from 1 to 3. The ledger preserves the reasons for the votes and the separate 0–3 coherence score for the pair.

## Taxonomy and visualisation

The [Hive element tree](visualisation.md) is a compact Markdown taxonomy that opens directly on GitHub. It groups connections by physiological process and lists linked elements using Biomiv’s relation terms. An element links to its individual lookup, and a relation links to the pair query. A short note can clarify the connection. The tree and the 3×3 grid give two ways to revisit the same ledger as elements recur across quests. Keep detailed evidence, formulas, and scoring rationale in the ledger.

The respiration branch shows how the taxonomy grows. Dioxygen and MT-CO1 introduce oxygen reduction at complex IV. A later quest adds cytochrome c and MT-CO2 under the same process. Biomiv returns `interacts with` for that pair. The ledger records electron transfer and its distance model as an interpretation supported by separate literature.

For a broader review, the interactive **Browse inferences** page reads the same ledger and provides quest filters, a clickable vote matrix, and a local network. Run `npm run build` from the repository root with Node.js 22+, then serve `dist/` with `python3 -m http.server --bind 127.0.0.1 --directory dist 8765`. Open `http://localhost:8765/inferences.html`.

## End-to-end reliability test

Start with **100 quests across 10 areas of human physiology**, with 10 per area. Cover distinct mechanisms and include established links, open questions, and plausible pairs with no expected support. Before looking at Biomiv, record each quest's anatomical setting, expected evidence outcome, and the sources or criteria a reviewer can use. Use the pilot to refine the rubric, then freeze it for a separate **1,000-quest benchmark**. With independent quests, the overall rate has a rough worst-case 95% margin of error of ±3 percentage points. An area with 100 quests is closer to ±10 points.

1. **Run and record.** Save the original quest, the first two-entity interpretation, and why the pair was chosen. Archive each complete, dated Biomiv JSON reply with its exact query. Track revised queries separately. Distinguish unresolved names, empty replies, and request failures.
2. **Review.** Have two reviewers independently assess **accuracy** against the cited evidence and **coherence** against the pair, relationship, and anatomical setting. Record whether a formula or reaction is justified, and assign the 3×3 node weights after reviewing the reply. Preserve both reviewers' judgments and record how disagreements were resolved. A justified conclusion of insufficient evidence can pass the accuracy check.
3. **Check the outputs.** Append the reviewed outcome to the [inference ledger](investigations/inferences.jsonl) and verify that it links to the archived reply. For supported connections, check whether reviewers place the linked elements and relation in the same branch of the [element tree](visualisation.md). Replay the saved replies to check that the recorded terms, weights, and tree placement can be traced to the same inputs.

Set acceptance thresholds before the benchmark. Report accuracy, coherence, and taxonomy agreement separately, overall and by area. Include first-query results and counts for empty, failed, and unscored lookups so graph coverage stays visible alongside reliability.

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

Read the related ledger rows and any earlier investigation notes under `investigations/`. Reuse dated lookups when they still answer the question. Append new observations with stable IDs and link revisions to the earlier inference. Keep an unmatched name, an empty search and a failed request distinguishable. Promote a claim into the curated archive when its supporting source and scope have been reviewed.

[Original KB4qb archive](https://github.com/MAlcont/KnowledgeBase-for-QuantumBio/tree/main/archive) · [Biomiv agent documentation](https://biomiv.com/ai-agents) · [API schema](https://biomiv.com/openapi.json) · [Relation vocabulary](https://biomiv.com/api/v1/healthspan/network/vocabulary)
