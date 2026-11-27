# Hive backlog

Resume on `book-kqbarc-hive`. Grow coverage of human physiology one quest at a time. The priority is to query Biomiv and leave a trace that the next chat can follow.

## Per quest

1. Read related entries in the [inference ledger](investigations/inferences.jsonl). Keep the original question, then name two Biomiv elements and the relationship they could explain in the physiological setting.
2. Reuse a dated reply when it still fits. For every new lookup, record the exact query and date, save the full JSON under [`investigations/biomiv/`](investigations/biomiv/), and link it from the ledger. Keep empty replies and record failed attempts.
3. Return three things with the evidence links. Append the result using the existing ledger format.
   - A **chemical reaction or biophysical formula**, when supported. State the gap if neither can be justified.
   - A **brief explanation** in plain language. Say which relationship Biomiv returned and where the physiological interpretation comes from.
   - A **3×3 accuracy × coherence grid**. Give each node a manual 1–3 vote on each axis with a short reason. Keep the separate 0–3 pair coherence score in the ledger. Leave votes unscored where the reply gives no basis for them.
4. Use the [element tree](visualisation.md) to organise the work. Add new links under the closest physiological branch with a brief relation label. Save regrouping and deduplication for a dedicated taxonomy pass.

## Action trace

After a quest, add one dated line with the pair, what was saved or added, and any open evidence question. Link to the ledger or raw reply for detail.

- **2026-11-27** · Oxygen / MT-CO1. Logged the complex IV oxygen-reduction reaction and added its tree branch. The first [ledger entry](investigations/inferences.jsonl#L1) preserves selected Biomiv fields.
- **2026-11-27** · CYCS / MT-CO2. Logged the electron-transfer model and added the interaction to the same branch. Archived the [primary reply](investigations/biomiv/2026-11-27-cycs-mt-co2.json) and the [complex IV subunit lookup](investigations/biomiv/2026-11-27-mt-co2-mt-co1.json). The [ledger entry](investigations/inferences.jsonl#L2) cites separate literature for the tunneling interpretation.
- **2026-11-27** · Added this handoff. Continue with the next quest and keep taxonomy additions small.
- **2026-11-27** · CYCS / MT-CO2. Added the ledger’s distance formula to the [element tree](visualisation.md). The cloud proxy blocked the [Cells paper suggested for the next MT-CO2 quest](https://www.mdpi.com/2073-4409/15/21/1941). Review the abstract or full text before choosing the new pair.
- **2026-11-27** · MT-CO2 / SDHB. Reviewed the supplied abstract and [archived the Biomiv reply](investigations/biomiv/2026-11-27-mt-co2-sdhb.json). Added the shared oxidative phosphorylation branch and logged the [tissue and cell findings](investigations/inferences.jsonl#L3). Mitochondrial content in the cortex samples remains unknown.
- **2026-11-27** · Oxygen-18 / MT-CO1. Archived the [unmatched isotope query](investigations/biomiv/2026-11-27-oxygen-18-mt-co1.json) and two name checks. The [ledger entry](investigations/inferences.jsonl#L4) records isotope bookkeeping for the known oxygen-reduction reaction and leaves the replies unscored.
