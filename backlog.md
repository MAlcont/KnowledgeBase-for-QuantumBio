# Hive backlog

Resume from the current tip of `book-kqbarc-hive` and take the topic from the user's new question. Apply the [same five-stage pipeline](README.md#from-quest-to-reviewed-inference) to every quest. Use earlier rows to recover evidence for related questions.

## Quest process log

Append one dated row per user quest with the same five stage columns below. The [inference ledger](investigations/inferences.jsonl) keeps the detailed records. When a quest takes several pairs, link their ledger rows from the same log row. Record the actual outcome of each stage, including incomplete runs.

1. **Quest.** Keep the original wording and physiological setting in the ledger. Link the row from a short title in the log.
2. **Elements.** Name the two entities and record the proposed relationship and the reason for choosing them before the lookup.
3. **Biomiv.** Log the result as a direct link, indirect path, no path, unmatched name or failed request. Keep exact requests and dates in the ledger and link to each full reply under [`investigations/biomiv/`](investigations/biomiv/). Label reused replies and keep retries distinct.
4. **Judgment.** Record how well the evidence supports the proposed explanation and score the original quest against the returned pair, relationship and anatomical context. Report pair coherence out of 3, with empty or failed lookups unscored. Keep a supported reaction or formula, a brief plain-language explanation, and short reasons for the manual 3×3 node votes in the ledger. Identify evidence from outside Biomiv.
5. **Taxonomy.** Log where you appended a supported connection in the [element tree](visualisation.md). When an addition is deferred, give the reason. Keep additions short and save regrouping for a dedicated pass.

| Date | Quest | Elements | Biomiv | Judgment | Taxonomy |
| --- | --- | --- | --- | --- | --- |
| 2026-11-27 | [Fundamental reactions of human respiration](investigations/inferences.jsonl#L1) | Oxygen / MT-CO1 | Direct substrate link. Selected fields preserved. | Oxygen reduction supported at intact complex IV. Coherence 2/3. | Added oxygen reduction under Human respiration → Complex IV. |
| 2026-11-27 | [Why quantum biology involves respiration](investigations/inferences.jsonl#L2) | CYCS / MT-CO2 | [Direct interaction](investigations/biomiv/2026-11-27-cycs-mt-co2.json) and [subunit context](investigations/biomiv/2026-11-27-mt-co2-mt-co1.json). | Interaction supported. The electron-transfer model came from separate literature. Coherence 1/3. | Added the cytochrome c link under Complex IV, then added the distance formula. |
| 2026-11-27 | [MT-CO2 study and respiration](investigations/inferences.jsonl#L3) | MT-CO2 / SDHB | [Indirect path](investigations/biomiv/2026-11-27-mt-co2-sdhb.json) through oxidative phosphorylation. | Shared pathway supported. The supplied abstract reports lower protein abundance in Alzheimer’s cortex, with mitochondrial content unresolved. Coherence 2/3. | Added the Complexes II and IV branch. |
| 2026-11-27 | [Natural oxygen isotopes in respiration](investigations/inferences.jsonl#L4) | Oxygen-18 / MT-CO1 | [Unmatched isotope name](investigations/biomiv/2026-11-27-oxygen-18-mt-co1.json) and two name checks. | Logged the labelled form of the known oxygen-reduction reaction. Isotope query unscored. | Deferred because the isotope label was unmatched. |
| 2026-11-27 | [Respiratory genes and isotope sensitivity](investigations/inferences.jsonl#L5-L7) | Heavy water / MT-CO1 · CO₂ / CA2 · succinic acid / SDHA | Seven archived replies. Ordinary CA2 and SDHA reaction links, with no isotope-specific links in the tested pairs. | Ordinary pairs 2/3. Isotope queries unscored. Independent CA2 enzyme evidence described a hydrogen isotope effect. | Added the CA2 reaction under CO₂ transport in blood and the SDHA link under Complexes II and IV. |

The handoff first appeared in `b240b5a`. The cloud proxy blocked the [Cells article](https://www.mdpi.com/2073-4409/15/21/1941) when it was first suggested. The MT-CO2 / SDHB quest used the abstract the user later supplied.
