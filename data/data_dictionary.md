# Analytical data dictionary

This dictionary documents variables used by the Quetta dashboard and analysis. It is not a complete dictionary of the 165 original survey fields and is not an official PBS coding scheme. The source and derived-variable distinctions below matter for interpretation.

## Source fields used in the analysis

| Field | Use or interpretation | Verification status |
| --- | --- | --- |
| `PCode` | First two characters `41` select Quetta Division | Selection verified against raw and cleaned records |
| `District` | `QUETTA`, `PISHIN`, `KILLA ABDULLAH` | Names present in the supplied records |
| `Region` | 1 Rural; 2 Urban | Embedded raw-file labels |
| `S4C5` | 1 Male; 2 Female | Embedded raw-file labels |
| `S4C6` | Age in years | Interpretation used by supplied analysis |
| `S4C7` | Marital-status input; codes 1–4 used | Names follow author’s script; official coding document unavailable |
| `S4C9` | Educational-attainment input | Names follow author’s script; official coding document unavailable |
| `S4C10` | Enrollment input; codes 2–15 identify students in this analysis | Author-defined analytical rule |
| `S5C1`, `S5C2`, `S5C3` | Inputs to economic-activity indicators | Rules below reproduce author’s implementation |
| `S9C1` | Job-search input in unemployment/outside-labour-force rules | Rules reproduce author’s implementation |
| `Weights` | Survey weight used to obtain descriptive weighted totals | Provided numeric weight; no survey-design variance estimation |

## Analytical variables

| Variable | Definition |
| --- | --- |
| `age_group` | 1–10 = 0–9, 10–19, 20–29, 30–39, 40–49, 50–59, 60–69, 70–79, 80–89, 90+ |
| `edu_level` | 0 unclassified; 1 no formal education; 2 below primary; 3 primary; 4 middle; 5 matric; 6 intermediate; 7 graduation |
| `employed` | 1 if any of `S5C1`, `S5C2`, `S5C3` equals 1; otherwise 0 |
| `unemployed` | 1 if any of those three fields equals 2 and `S9C1` equals 1; otherwise 0 |
| `not_in_labor_force` | 1 if any of those three fields equals 2 and `S9C1` equals 2; otherwise 0 |
| `labor_force` | 1 if employed or unemployed equals 1; otherwise 0 |
| `student` | Binary student field in the latest cleaned dataset, matching `S4C10` in 2–15 |
| `student_status` | Dashboard’s in-memory name for `student`; not a stored field in the latest cleaned file |
| `gender` | Dashboard’s in-memory name for `S4C5` when absent from the cleaned file |
| `marital_status` | In-memory mapping of valid `S4C7` codes: 1 never married; 2 married; 3 widow/widower; 4 divorced |
| `district_code` | Dashboard mapping: 1 Quetta; 2 Pishin; 3 Killa Abdullah |

The latest dataset codes 1,845 education entries as zero; the historical script leaves them missing. Both are displayed as unclassified. For 3,143 children aged 0–9, economic activity is unclassified by the supplied flags. They are not silently reassigned outside the labour force.

## Dashboard aggregate schema

`quetta.json` records `age`, `region`, `gender`, `education`, `marital`, and `district` as grouping codes. `n` counts sample records; `weight` sums their survey weights. Each activity indicator stores a weighted sum, and its `_n` counterpart stores an unweighted count. Top-level metadata records the source-file SHA-256 and sample size.

## Summary-table units

`results/summary_tables.csv` includes a total and separate marginal breakdowns, not a mutually exclusive combined partition. Do not add totals across dimensions. `_sample_n` columns are respondents; `_weighted` columns are sums of weights. Weighted population is a survey estimate, not a current population projection. Undefined rates are blank rather than zero.

`participation_full_population_pct` = 100 × weighted labour force / full selected weighted population. It includes children where selected and is not a conventional working-age LFPR. `unemployment_rate_pct` = 100 × weighted unemployed / weighted labour force. No confidence intervals are provided.
