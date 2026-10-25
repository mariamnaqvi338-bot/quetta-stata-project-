# Labor Force Structure in Quetta Division

**Syeda Mariam Naqvi**

An independent empirical study of employment, educational attainment, and demographic differences in Quetta Division, Balochistan, Pakistan.

## Abstract

This repository brings together a research report, Stata analytical materials, the underlying uploaded Quetta labor-force extract, and an interactive dashboard. The study examines how economic activity, educational attainment, and marital status vary across age, gender, and rural–urban settlement categories. The analytical sample comprises **9,652 respondents** across Quetta, Pishin, and Killa Abdullah, using the division definition represented in the supplied survey extract. Weighted descriptive statistics complement the report’s unweighted hypothesis tests. The results describe associations within a cross-sectional survey; they do not identify causal mechanisms.

## Research questions

1. How are employment and unemployment distributed across age groups?
2. How do educational attainment and economic activity differ by gender and settlement type?
3. How are marital status, education, and employment associated within the observed sample?

## Analytical workflow

The study imports and screens the PBS microdata in Stata, isolates Quetta Division, constructs ten age groups and seven education categories, and derives employment, unemployment, labor-force, and student indicators. Weighted tables and graphs compare economic activity, education, and marital status by age, gender, and rural–urban settlement. Unweighted chi-square tests assess categorical associations, while independent-samples t-tests compare mean age across selected demographic groups.

See [analytical scope and variable construction](research/METHODS.md) for the exact implemented rules, the complete test scope, and the distinction between the author’s analytical definitions and the official PBS coding scheme. A year-wise employment/enrollment analysis is outside this study’s scope; no time-series claims are made.

## Interactive dashboard

The dashboard combines a monochrome visual design with violet and amber accents. Users may select age, gender, settlement type, and district; switch between weighted estimates and sample counts; explore labor-force, education, and demographic panels; and download filtered age summaries. A colorful Pakistan district map highlights the three study locations, with clickable district shapes and markers linked to filters. Historical boundaries provide geographic context rather than an exact representation of the 2020–21 survey geography. Colors distinguish areas and do not encode statistical values. Zoom controls and equivalent keyboard-accessible district buttons are available.

For local use, run from the repository root:

```sh
python -m http.server 8000 --directory .
```

Open `http://localhost:8000` on the same computer. For the hosted version, use the URL provided under repository **Settings → Pages**. Deployment from `main`, `/ (root)` requires no build process, backend, or API credentials.

## Research materials

| Material | Location | Description |
| --- | --- | --- |
| Research report | [PDF](research/report/quetta-labor-force-report.pdf) · [Word](research/report/quetta-labor-force-report.docx) | Full narrative analysis, tables, and figures |
| Supplied Stata commands | [finalprojectmariam.do](research/stata/finalprojectmariam.do) | Historical analysis script; retains its original Windows input path |
| Latest readable Stata output | [analysis-log.txt](research/stata/analysis-log.txt) | Author’s latest pasted transcript of the SMCL log; browser-readable text |
| Original Stata output | [analysis.smcl](research/stata/analysis.smcl) | Historical output log; open with Stata Viewer |
| Portable Stata runner | [run-analysis.do](research/stata/run-analysis.do) | Additional runner for descriptive tables and selected tests using the included prepared extract |
| Redesigned figures | [PDF](research/figures/research-figures.pdf) · [PNG files](research/figures/) | Recomputed economic-activity, education, and settlement comparisons |
| Original raw archive | [ZIP](research/source/LFS2020-21_Microdata_STATA.zip) · [coding metadata](research/source/README.md) | Supplied raw LFS file, unchanged; embedded labels and provenance checks |
| Survey extract | [finalprojectmariam.dta](research/data/finalprojectmariam.dta) | Supplied respondent-level Quetta dataset, approximately 18 MB |
| Dashboard aggregates | [quetta.json](data/quetta.json) | 725 aggregate cells used by the browser |
| Data preparation | [prepare_data.py](scripts/prepare_data.py) | Rebuilds the dashboard aggregates from the supplied extract |

The report’s cover/title page has been removed from the PDF and Word copies, and introductory Stata comment headers were adapted for independent publication. A supplementary section adds redesigned, independently recomputed descriptive figures; the original body and its historical charts are retained. The report’s analytical body, historical Stata commands and results, and the binary `.dta` dataset have not been substantively revised. Historical scripts and log paths may reference the author’s original local environment.

## Data and measurement

**Source:** Pakistan Bureau of Statistics (PBS), *Labour Force Survey 2020–21*, Quetta Division extract supplied by the author. Division code `41` is identified by the first two characters of `PCode`. The survey extract explicitly names the districts `QUETTA`, `PISHIN`, and `KILLA ABDULLAH`; district filters use those names rather than an assumed current administrative geography.

The dashboard preserves the supplied derived variables: `age_group`, `edu_level`, `employed`, `unemployed`, `not_in_labor_force`, `labor_force`, `student_status`, `marital_status`, and `gender`. Weighted counts sum `Weights`; sample counts enumerate respondents. The extract contains 2,121 employed respondents, 98 unemployed respondents, and 4,290 respondents flagged outside the labor force. A further 3,143 respondents aged 0–9 are unclassified by those indicators and are retained explicitly.

- **Labor force:** respondents flagged as employed or unemployed.
- **Participation:** labor force divided by the entire selected population. When children are selected, this differs from a conventional working-age labor force participation rate.
- **Unemployment rate:** unemployed divided by the selected labor force.
- **Education:** the original mapping of `S4C9` codes 1–7 is reproduced. Labels have not been independently checked against the PBS codebook; missing and unmapped categories remain visible.

The separate research-notes panel quotes selected unweighted tests from the report. They do not update with dashboard filters and have not been independently replicated as complex-survey tests. Reported `0.000` p-values are displayed as `<0.001`.

## Reproducibility

### Dashboard data

Python 3 and the packages in `requirements-data.txt` are needed only to regenerate aggregates:

```sh
python -m pip install -r requirements-data.txt
python scripts/prepare_data.py research/data/finalprojectmariam.dta
python scripts/render_figures.py
python -m unittest discover -s tests
node --check app.js
```

The aggregate JSON records the SHA-256 of the source dataset. Viewing the dashboard requires only a browser and static HTTP hosting.

### Stata

From the repository root, in an installed Stata environment:

```stata
do research/stata/run-analysis.do
```

The portable runner uses existing variables in the prepared dataset; the historical `finalprojectmariam.do` instead expects an original raw input at a Windows-specific path and generates those variables. Neither Stata execution nor statistical-test replication has been validated in this environment because Stata is unavailable.

## Limitations and data stewardship

The findings pertain to the supplied 2020–21 extract and its survey geography. No survey-design standard errors or confidence intervals are calculated by the dashboard, and small subgroups may produce unstable estimates. The report’s narrative interpretations should be considered alongside the descriptive evidence; association does not demonstrate causation.

The dashboard consumes aggregated data, but the separately downloadable `.dta` is the supplied respondent-level file and retains survey identifiers. It should not be described as anonymized. Consult the originating data provider’s applicable access and redistribution terms before further redistribution; this repository does not assign a new license to the source survey data.

## Geographic attribution

The locally bundled Pakistan outline comes from [johan/world.geo.json](https://github.com/johan/world.geo.json/blob/master/countries/PAK.geo.json), a Natural Earth-derived dataset. It is a generalized cartographic locator, not an authoritative statement of boundaries or territorial status. The atlas-style district layer is simplified from [Click That Hood’s Pakistan dataset](https://github.com/codeforgermany/click_that_hood/blob/main/public/data/pakistan.geojson), attributed there to DIVA-GIS. These historical district geometries may differ from survey or current boundaries. District point locations are approximate. Rural and urban are survey classifications, not mapped polygons. Glacial Indifference is bundled locally in regular, italic, and bold weights under the SIL Open Font License; see `assets/fonts/OFL.txt`. The map, typography, and charts require no external service.

## Validation

Automated checks verify sample totals, weighted indicator partitions, permitted aggregate fields, and district totals. Browser smoke checks cover combined filters, selectable map markers, zoom, topic panels, CSV export, download links, mobile overflow, and JavaScript errors. These checks validate the dashboard implementation rather than the underlying survey instrument or the report’s inferential claims.

## Figure design

Redesigned figures use readable labels, a consistent monochrome/violet/amber palette, sample-size context, and explicit denominators. Employment and unemployment counts use separate panels because their scales differ substantially. Education compares weighted distributions within gender, including unclassified records; settlement panels show full-population participation and labor-force unemployment separately. These supplementary figures describe the entire uploaded sample, while browser charts respond to filters. Source: Pakistan Bureau of Statistics, Labour Force Survey 2020–21.

## Raw-data provenance check

The original PBS archive is retained in `research/source/` without recompression. Its uncompressed Stata file is approximately 1.04 GB and is not committed separately. The Quetta subset was compared against the prepared extract across all original columns and records, with storage-dtype differences ignored. See [source metadata](research/source/metadata.json) for counts and checksums. The archive contains no separate coding-scheme document: only province, settlement, and gender value labels are embedded. Education and labor-market definitions therefore remain subject to the official questionnaire and the documented limitations above.

## Latest cleaned source files

The dashboard now uses the author’s latest `finalprojectmariam.dta` and includes the corresponding `finalprojectmariam.do`. The binary dataset is preserved exactly. It contains the same 9,652 Quetta respondents and original survey columns as the earlier extract. Education category `0` represents the 1,845 previously missing/unclassified entries; the binary enrollment indicator is named `student`. The dashboard reads gender from `S4C5`, marital status from valid `S4C7` codes, and student status from `student` when derived field names are absent. These adaptations happen in memory only.

The authoritative do-file is the text most recently supplied by the author, saved as `finalprojectmariam.do`. It starts from the original national raw data at a Windows-specific path and defines a binary student indicator using `S4C10` codes 2–15, consistent with the cleaned dataset’s `student` field. The script uses missing values for unclassified education, whereas the latest cleaned dataset uses category `0`; both are displayed as unclassified. The historical report and SMCL output predate these latest uploads; reported tests remain attributed to those historical materials rather than claimed as rerun results. Introductory personal/course comment lines are omitted for the independent presentation; analytical commands are preserved.

The most recently pasted output is published as `analysis-log.txt` because it contains rendered text rather than SMCL directives. The earlier uploaded `.smcl` is retained for Stata Viewer. Both preserve analytical output; course/personal introductory comment lines are omitted. The transcript records an initial missing Windows-path error (`r(601)`) and subsequent statistical results, so it is a historical analysis record rather than a verified clean execution in a new session.
