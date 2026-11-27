# Hive inference visualisation

This snapshot shows 1 recorded inference and 2 node votes. [Source ledger](investigations/inferences.jsonl)

## Accuracy × coherence

Each cell counts node votes. Accuracy runs down the rows and coherence across the columns.

| Accuracy ↓ / Coherence → | 1 | 2 | 3 |
| --- | ---: | ---: | ---: |
| 1 | 0 | 0 | 0 |
| 2 | 0 | 1 | 0 |
| 3 | 0 | 1 | 0 |

## Complex IV terminal oxygen reduction

How does human mitochondrial complex IV use oxygen as the terminal electron acceptor?

```mermaid
flowchart LR
    A["dioxygen"] -->|is a substrate of| B["Cytochrome c oxidase subunit 1"]
```

**Biomiv link.** Dioxygen is a substrate of Cytochrome c oxidase subunit 1 (UniProt, RHEA:11436). [Recorded query](https://biomiv.com/api/v1/healthspan/network/connect?a=oxygen&b=MT-CO1)

**Reaction.** `O₂ + 4 e⁻ + 4 H⁺ → 2 H₂O`

At the end of the mitochondrial electron transport chain, complex IV transfers electrons from cytochrome c to oxygen and makes water. This keeps electrons flowing and helps sustain the proton gradient that drives ATP synthesis.

Terminal reduction half-reaction of intact complex IV. Reduced cytochrome c supplies the electrons. Vectorial proton translocation is outside this equation.

**Quest context.** Homo sapiens · inner mitochondrial membrane · oxidative phosphorylation.

**Accuracy.** Dioxygen is a substrate of complex IV. MT-CO1 is its catalytic core subunit. The graph classifies dioxygen as a plant compound, while the physiological vocabulary classifies it as a biochemical.

**Pair coherence.** 2/3. The edge resolves both entities and identifies oxygen as a substrate. The reply does not specify the human mitochondrial compartment.

| Node | Accuracy | Coherence | Reason |
| --- | ---: | ---: | --- |
| dioxygen | 2 | 2 | Correct identity and substrate role. The Biomiv category needs qualification and the anatomical context is absent. |
| Cytochrome c oxidase subunit 1 | 3 | 2 | The node correctly identifies the catalytic subunit and provides the substrate link. The anatomical context is absent. |

**References**

- [Reaction reference returned by Biomiv](https://www.rhea-db.org/rhea/11436) (live verification unavailable)
- [Independent physiology reference](https://openstax.org/books/biology-2e/pages/7-4-oxidative-phosphorylation)
