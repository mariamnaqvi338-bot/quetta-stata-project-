# Reproducibility guide

Run all commands below from the repository root.


### View the dashboard locally

From the repository root:

```sh
python -m http.server 8000 --directory .
```

Open `http://localhost:8000` on the same computer. The public dashboard requires no installation, backend, or API credentials.

### Regenerate aggregates and figures

```sh
python -m pip install -r requirements-data.txt
python scripts/prepare_data.py research/data/finalprojectmariam.dta
python scripts/render_figures.py
python scripts/export_results.py
python -m unittest discover -s tests
node --check app.js
```

To verify raw-data provenance, extract the original ZIP outside the repository, then run:

```sh
python scripts/verify_raw.py /path/to/LFS2020-21.dta
```

The uncompressed national dataset is approximately 1.04 GB. Its unchanged compressed archive is retained in the repository; the uncompressed copy is not committed.

### Run the Stata companion

From the repository root in an installed Stata environment:

```stata
do research/stata/run-analysis.do
```

The portable runner adapts the cleaned file in memory and produces selected descriptive tables and tests. The author’s complete historical do-file starts from a Windows-specific raw-data path, which must be adapted before use. The historical log includes an initial missing-path error followed by analytical output; it is not evidence of a clean execution in a new environment. Stata is unavailable in the dashboard development environment, so these commands have not been independently rerun there.

### Refresh repository screenshots

With the local dashboard server running, install Playwright and a supported Chromium browser, then run:

```sh
python scripts/capture_screenshots.py http://localhost:8000
```

The capture utility renders actual dashboard views and an explicitly labeled excerpt from the supplied log. It does not simulate a Stata application window.

