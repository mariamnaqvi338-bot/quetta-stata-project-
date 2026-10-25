# Quetta Labor Force Observatory

An interactive dashboard of **Syeda Mariam Naqvi’s ECON 322 project**, exploring the Pakistan Bureau of Statistics Labor Force Survey 2020–21 for Quetta Division, Balochistan.

## Run locally

Requires Python 3; the dashboard has no build step or JavaScript dependencies.

```sh
python -m http.server 8000 --directory .
```

Open http://localhost:8000 in your browser. Use region, gender, age, and weighting controls to explore employment, education, students, marital status, and population. Export filtered age summaries as CSV. Keyboard users can navigate tabs using arrow keys, Home, and End.

## Publish with GitHub Pages

In repository **Settings → Pages**, select **Deploy from a branch**, choose the branch containing this dashboard and **/ (root)**, then save. GitHub will show the public URL after deployment. No backend or API key is required.

## Data and interpretation

`data/quetta.json` contains 353 aggregate cells derived from 9,652 respondents in the supplied Quetta `.dta` file. It contains no household identifiers or individual records. Raw uploads, report, and Stata log are not redistributed. Aggregation is not a formal statistical disclosure-control process; assess PBS redistribution terms before broader reuse.

Counts sum the original `Weights` in weighted mode and count respondents in sample mode. Existing project indicators are preserved. There are 2,121 employed and 98 unemployed sample respondents; 4,290 are flagged outside the labor force and 3,143 are unclassified (ages 0–9). These last records are retained rather than counted as outside the labor force.

Participation is labor force / selected population, including children if selected; it is **not a conventional working-age LFPR**. Unemployment is unemployed / labor force. Missing or unmapped education and marital categories remain visible. Education names reproduce the project mapping rather than an independently verified PBS codebook. No survey-design uncertainty estimates are computed. Reported hypothesis tests are separately labeled, unweighted, quoted results and do not change with filters. The dashboard does not reproduce unsupported causal claims from the report.

To rebuild the aggregate file from your private source data, install `requirements-data.txt` and run:

```sh
python scripts/prepare_data.py /path/to/271056957.dta
```

The source SHA-256 is recorded in the JSON for reproducibility. Raw data is not needed to view the dashboard. Fonts use Google Fonts when available, with local system fallbacks; no external chart libraries, analytics, or API calls are used.

## Validation

```sh
python -m unittest discover -s tests
node --check app.js
```

Browser smoke checks additionally cover filters, all tabs, CSV downloads, mobile layout, and console errors.
