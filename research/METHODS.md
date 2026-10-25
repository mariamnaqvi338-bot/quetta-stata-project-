# Analytical scope and variable construction

This note summarizes the author’s description of the Quetta analysis, cross-checked against the supplied Stata commands. It documents the study’s analytical choices; it is not the official PBS questionnaire or coding scheme.

## Data preparation

The study uses Pakistan Bureau of Statistics Labour Force Survey 2020–21 microdata. Quetta Division is selected using the prefix `41` of `PCode`, the field name present in the supplied data. The resulting extract contains 9,652 respondents from Quetta, Pishin, and Killa Abdullah.

Age (`S4C6`) is organized into ten groups: 0–9, 10–19, 20–29, 30–39, 40–49, 50–59, 60–69, 70–79, 80–89, and 90+. The supplied education mapping assigns `S4C9` codes 1–7 to no formal education, below primary, primary, middle, matric, intermediate, and graduation. Those labels reproduce the analytical script and still require validation against the official code definitions. Missing/unmapped values remain unclassified in dashboard outputs.

| Derived indicator | Rule used in the supplied analysis |
| --- | --- |
| Employed | At least one of `S5C1`, `S5C2`, or `S5C3` equals 1 |
| Unemployed | At least one of those three responses equals 2, and `S9C1` equals 1 |
| Outside the labor force | At least one of those three responses equals 2, and `S9C1` equals 2 |
| Labor force | Employed or unemployed equals 1 |
| Student | `S4C10` is in the inclusive range 2–15 |
| Gender | `S4C5`, labeled 1 = Male and 2 = Female |
| Marital status | `S4C7` codes 1–4, mapped in the script to never married, married, widow/widower, and divorced |
| Settlement | `Region`, labeled 1 = Rural and 2 = Urban |

These rules document the supplied implementation rather than asserting that every rule is the official survey definition. No employed/unemployed overlap occurs in this extract. The 3,143 respondents aged 0–9 are not flagged as either in or outside the labor force; the dashboard retains them as unclassified.

## Weighted descriptive comparisons

The analysis examines employment, unemployment, labor force, outside-labor-force status, education, and marital status across ten age groups. Disaggregation distinguishes rural and urban respondents, male and female respondents, and gender differences within each settlement category. The dashboard applies the supplied `Weights` variable when weighted mode is selected and supports combinations of these filters. District selection is an additional dashboard feature.

Counts and distributions answer different questions from rates. The share of all unemployed respondents who are aged 20–29 is not the unemployment rate among people aged 20–29. Dashboard share mode uses the total of the selected indicator as its denominator; its unemployment KPI divides unemployed by labor force. Participation uses the full filtered population and is not a conventional working-age participation rate when children are included.

A year-wise employment/enrollment analysis for ages 15–29 is outside the described analytical scope. The dataset is treated as a single survey period; the dashboard does not imply a time series.

## Inferential analysis described by the author

The supplied Stata script includes the following unweighted tests:

- Marital status against settlement, employment status, and educational attainment.
- Educational attainment against gender and settlement, including separate settlement comparisons for males and females.
- Employment status against gender and settlement, including separate settlement comparisons for males and females.
- Independent-samples t-tests of mean age: rural versus urban, male versus female in the full extract, and male versus female within rural respondents.

The historical script and output log remain the analytical record. Dashboard research notes quote selected results from the report and do not recompute tests after filtering. These unweighted tests do not account for the complex survey design. They establish neither causal effects nor population-level certainty. Stata execution has not been independently rerun in the current development environment.

## Available evidence and limitations

The original raw archive, prepared dataset, supplied Stata script, output log, and report are included in this repository. A chunked comparison established that all 165 original columns and all 9,652 selected Quetta records match the prepared extract in order, ignoring storage-dtype differences. That check verifies provenance, not the substantive accuracy of derived variable definitions.

The raw archive embeds value labels for province, region, and gender only. The author’s analytical outline supplies additional intended mappings, but a separate official coding document is still needed to independently verify education and labor-market response meanings.

## Latest cleaned extract

The current source is `finalprojectmariam.dta`. Its binary `student` equals the indicator for `S4C10` in 2–15, and education category `0` is retained as unclassified. The importer adapts raw `S4C5` and `S4C7` to dashboard gender and marital categories in memory. The authoritative `finalprojectmariam.do` is the latest pasted script supplied by the author. Its binary `student_status` rule matches the delivered dataset’s `student` field. The script leaves unmapped education missing, while the latest cleaned dataset codes it as `0`; the dashboard retains both as unclassified.
