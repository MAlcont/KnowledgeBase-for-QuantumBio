# Hive element tree

- **Human respiration**
  - **Oxidative phosphorylation · Complex IV**
    - [Dioxygen (O₂)](https://biomiv.com/api/v1/healthspan/network/connect?a=oxygen)
      - [is a substrate of](https://biomiv.com/api/v1/healthspan/network/connect?a=oxygen&b=MT-CO1) [MT-CO1 (catalytic subunit of complex IV)](https://biomiv.com/api/v1/healthspan/network/connect?a=MT-CO1). The intact complex takes electrons from cytochrome c and uses them to turn oxygen into water.
      - [Oxygen reduction](https://www.rhea-db.org/rhea/11436) · `O₂ + 4 e⁻ + 4 H⁺ → 2 H₂O`
    - [Cytochrome c](https://biomiv.com/api/v1/healthspan/network/connect?a=CYCS)
      - [interacts with](https://biomiv.com/api/v1/healthspan/network/connect?a=CYCS&b=MT-CO2) [MT-CO2 (complex IV subunit II)](https://biomiv.com/api/v1/healthspan/network/connect?a=MT-CO2). Cytochrome c passes an electron to the CuA center on MT-CO2.
      - [Electron-transfer distance model](https://doi.org/10.1038/355796a0) · `k_ET ∝ exp(−βR)`
  - **Oxidative phosphorylation · Complexes II and IV**
    - [SDHB (complex II iron–sulfur subunit)](https://biomiv.com/api/v1/healthspan/network/connect?a=SDHB)
      - [shares the oxidative phosphorylation pathway with](https://biomiv.com/api/v1/healthspan/network/connect?a=MT-CO2&b=SDHB) [MT-CO2 (complex IV subunit II)](https://biomiv.com/api/v1/healthspan/network/connect?a=MT-CO2). Both were less abundant in Alzheimer’s temporal cortex than in cognitively normal controls. [Study](https://www.mdpi.com/2073-4409/15/21/1941)
      - [Succinate oxidation](https://enzyme.expasy.org/EC/1.3.5.1) · `Succinate + Q → fumarate + QH₂`

[Inference ledger](investigations/inferences.jsonl)
