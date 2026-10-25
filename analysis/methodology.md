# Methodology

## Design and population

A cross-sectional descriptive analysis of PBS Labour Force Survey 2020–21 records belonging to Quetta Division (`PCode` prefix `41`). The author’s cleaned extract comprises 9,652 respondents across Quetta, Pishin, and Killa Abdullah. Filtering the supplied national raw file reproduces all selected records and all 165 original survey columns, ignoring storage-dtype differences.

## Preparation and estimation

The supplied Stata analysis constructs ten age categories and seven named education levels, and defines employment, unemployment, labour-force, and student indicators. The dashboard retains the cleaned dataset unchanged and harmonizes missing derived names in memory. Exact rules and known coding limitations appear in the [data dictionary](../data/data_dictionary.md) and [detailed methods](../research/METHODS.md).

Descriptive tables use `Weights` for survey-weighted totals and retain sample counts separately. Disaggregation covers age, gender, settlement, and district. Figure and dashboard labels distinguish counts, composition shares, and rates. Missing/unclassified records remain visible.

## Hypothesis testing

The historical Stata script includes chi-square tests of categorical associations and independent-samples t-tests comparing mean age. The [detailed methods](../research/METHODS.md) identify their full scope. These tests are unweighted and do not account for the complex survey design. The repository preserves the supplied results and does not claim an independently rerun Stata analysis.

## Interpretation

Associations do not establish causation. Survey-period estimates are not current population estimates. Participation based on all ages must not be presented as working-age LFPR. A share of unemployment concentrated in an age group must not be presented as that age group’s unemployment rate. Small-cell instability, incomplete official coding documentation, and unavailable survey-design uncertainty estimates constrain interpretation.
