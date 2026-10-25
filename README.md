# Labour Force Structure in Quetta Division

**Syeda Mariam Naqvi | Independent empirical research**

An analysis of employment, educational attainment, and demographic variation using Pakistan’s Labour Force Survey 2020–21.

[**Interactive dashboard ↗**](https://mariamnaqvi338-bot.github.io/quetta-stata-project-/) · [**Research report**](research/report/quetta-labor-force-report.pdf) · [**Stata code**](research/stata/finalprojectmariam.do) · [**Summary tables**](results/summary_tables.csv)

![Quetta Labour Force Observatory dashboard](docs/screenshots/dashboard-overview.png)

## 1. Project purpose

This study characterizes the structure of the labour force in Quetta Division, with particular attention to age, gender, and rural–urban differences. It brings together the research report, analytical code, survey extract, statistical outputs, and interactive visualizations in one documented research archive.

The analysis addresses three questions:

1. How are employment, unemployment, and labour-force participation distributed across age groups?
2. How does educational attainment vary by gender and settlement type?
3. How are marital status, education, and employment associated within the observed sample?

| Study characteristic | Description |
| --- | --- |
| Data source | Pakistan Bureau of Statistics, Labour Force Survey 2020–21 |
| Geographic scope | Quetta, Pishin, and Killa Abdullah, as represented in the survey extract |
| Analytical sample | 9,652 respondents |
| Research design | Cross-sectional descriptive and associational analysis |
| Primary analytical tool | Stata |
| Methods | Weighted descriptive statistics, chi-square tests, independent-samples t-tests |
| Presentation | Interactive dashboard, tables, figures, and written report |

## 2. Data and ownership

**The Labour Force Survey (LFS) 2020–21 data are the property of the Pakistan Bureau of Statistics (PBS).** Ownership remains with PBS. Inclusion in this repository does not transfer ownership or grant additional reuse or redistribution rights; use is subject to PBS’s applicable terms and conditions.

The original archive contains 570,991 survey records. Selecting `PCode` prefix `41` produces the 9,652-record Quetta extract. All selected records and all **165 original survey columns** match the cleaned dataset in order, ignoring storage-dtype differences.

- [Cleaned Quetta dataset](research/data/finalprojectmariam.dta)
- [Original PBS archive and source documentation](research/source/README.md)
- [Analytical data dictionary](data/data_dictionary.md)
- [Provenance metadata and checksums](research/source/metadata.json)

The cleaned dataset is retained unchanged. Raw and cleaned files contain respondent-level survey records and identifiers and should not be described as anonymized. PBS redistribution permission has not been independently established by this repository.

## 3. Methodology and analytical process

| Stage | Work undertaken | Documentation |
| --- | --- | --- |
| Data preparation | Import the PBS microdata, select Quetta Division, screen records, and construct analytical variables | [Author’s do-file](research/stata/finalprojectmariam.do) |
| Classification | Define ten age groups, education categories, economic-activity indicators, and student status | [Data dictionary](data/data_dictionary.md) |
| Descriptive analysis | Produce weighted distributions by age, gender, and rural–urban settlement | [Methodology](analysis/methodology.md) |
| Hypothesis testing | Examine categorical associations and differences in mean age using unweighted tests | [Detailed methods](research/METHODS.md) · [Historical log](research/stata/analysis-log.txt) |
| Visualization | Present labelled figures and interactive subgroup comparisons | [Visual evidence](visuals/README.md) |
| Validation | Compare the raw and cleaned records and check dashboard aggregate totals | [Verification utilities](scripts/) |

Weighted counts sum the supplied `Weights` variable; sample counts enumerate respondents. The unemployment rate divides unemployed by labour force. Dashboard participation divides labour force by the full selected population, including children where selected, and is therefore **not a conventional working-age participation rate**.

The latest cleaned file stores a binary student indicator as `student`; the dashboard harmonizes gender, marital-status, and student field names in memory. Education category `0` and missing categories are retained as unclassified. The official PBS coding document has not been supplied; education labels follow the author’s analytical mapping.

## 4. Results and interpretation

The estimates below are recomputed from the current cleaned extract. Weighted estimates and unweighted sample counts are reported separately.

| Indicator | Result |
| --- | ---: |
| Analytical sample | 9,652 respondents |
| Employed respondents, unweighted | 2,121 |
| Unemployed respondents, unweighted | 98 |
| Weighted labour force | Approximately 881,078 |
| Weighted unemployment rate | 3.44% |
| Ages 20–29: share of weighted employment | 31.1% |
| Ages 20–29: share of weighted unemployment | 60.8% |

The concentration of unemployment among respondents aged 20–29 is a descriptive feature of the extract. **A share of total unemployment is not an age-specific unemployment rate.** These cross-sectional associations do not establish causal mechanisms.

Explore the [key findings](results/key_findings.md), download the [summary tables](results/summary_tables.csv), or read the [complete report](research/report/quetta-labor-force-report.pdf). The report retains its analytical body, omits the cover page, and includes redesigned supplementary figures.

## 5. Visual evidence and dashboard

### Geographic distribution

![Pakistan district map highlighting the three Quetta study districts](docs/screenshots/pakistan-district-map.png)

Select Quetta, Pishin, or Killa Abdullah to filter the dashboard, then disaggregate further by age, gender, and settlement. Historical boundaries provide geographic context and may differ from survey or current administrative boundaries. Colors distinguish districts rather than statistical magnitudes.

### Educational attainment

![Educational attainment and student enrolment analysis](docs/screenshots/education-analysis.png)

The dashboard includes labour-force, education, and demographic panels, weighted/sample-count controls, indicator selection, and CSV export. [Open the dashboard ↗](https://mariamnaqvi338-bot.github.io/quetta-stata-project-/)

<details>
<summary><strong>Stata output and mobile previews</strong></summary>

![Employment and gender contingency table from the historical Stata log](docs/screenshots/stata-output-excerpt.png)

This is a rendered excerpt of the supplied log, not a native Stata interface screenshot or a newly executed test. Counts and tests are unweighted; reported p = 0.000 denotes p < 0.001. The complete [do-file](research/stata/finalprojectmariam.do), [readable output](research/stata/analysis-log.txt), and [SMCL log](research/stata/analysis.smcl) remain available.

<img src="docs/screenshots/mobile-dashboard.png" alt="Mobile dashboard layout" width="300">

</details>

See [all visual materials](visuals/README.md) and the [supplementary figure PDF](research/figures/research-figures.pdf).

## 6. Repository structure

```text
quetta-stata-project-/
├── README.md                  Project overview and research evidence
├── CITATION.cff               Citation metadata
├── data/                      Dashboard aggregates and data dictionary
├── analysis/                  Methodology and analytical workflow
├── visuals/                   Index of figures and screenshots
├── results/                   Summary tables and key findings
├── docs/                      Screenshots and reproducibility guide
├── research/
│   ├── report/                PDF and editable Word report
│   ├── stata/                 Do-file, historical logs, portable runner
│   ├── data/                  Unchanged cleaned Quetta extract
│   ├── source/                Original PBS archive and metadata
│   └── figures/               Recomputed figures and figure PDF
├── scripts/                   Preparation, export, and verification
└── tests/                     Aggregate-data checks
```

No R script or R Markdown file is included: Stata is the analytical tool used for this study. A duplicate respondent-level CSV is not generated merely to populate a template.

## 7. Reproducibility

To view the dashboard locally, run from the repository root:

```sh
python -m http.server 8000 --directory .
```

Open `http://localhost:8000` on the same computer. The [public dashboard](https://mariamnaqvi338-bot.github.io/quetta-stata-project-/) requires no installation.

The [reproducibility guide](docs/REPRODUCIBILITY.md) documents aggregate preparation, figure generation, CSV export, raw-data verification, screenshot capture, and the portable Stata runner. The original do-file retains a Windows-specific raw-data path that must be adapted for reuse. Historical Stata logs are preserved as analytical records; Stata execution has not been independently rerun in the dashboard development environment.

## 8. Limitations

- Results describe the 2020–21 extract and its survey geography, rather than current conditions or a time series.
- The dashboard does not estimate complex-survey standard errors or confidence intervals; small subgroups may be unstable.
- Historical chi-square tests and t-tests are unweighted and do not update with dashboard filters.
- The supplied economic-activity flags leave 3,143 children aged 0–9 unclassified; these records remain visible.
- Education coding has not been independently verified against an official PBS codebook.
- Association does not establish causation, and survey-record matching does not independently validate analytical definitions.

## 9. Methodological lessons and further work

The analysis illustrates why explicit denominators, consistent variable definitions, and separation of weighted estimates from sample counts are essential to interpretation. Keeping source data, code, logs, and figures together makes the research process inspectable beyond the final narrative.

Further work could verify response-code mappings against the official questionnaire, incorporate survey-design uncertainty estimates, and evaluate sensitivity to alternative working-age definitions. These are prospective extensions, not completed analyses.

## 10. Attribution and citation

**Research:** Syeda Mariam Naqvi. **Survey ownership:** Pakistan Bureau of Statistics, Labour Force Survey 2020–21.

District geometry is derived from [Click That Hood’s Pakistan dataset](https://github.com/codeforgermany/click_that_hood/blob/main/public/data/pakistan.geojson), attributed there to DIVA-GIS. A generalized [Natural Earth-derived outline](https://github.com/johan/world.geo.json/blob/master/countries/PAK.geo.json) is also retained. Glacial Indifference is bundled under its [SIL Open Font License](assets/fonts/OFL.txt).

Use [CITATION.cff](CITATION.cff) or GitHub’s **Cite this repository** feature to cite the project; cite PBS separately for the survey data.

© 2025 Syeda Mariam Naqvi. All rights reserved. This notice applies to original author materials; source data, maps, and fonts remain subject to their respective terms. No general open-source license is granted.
