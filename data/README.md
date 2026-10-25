# Data directory

**Data ownership:** Labour Force Survey 2020–21 data are the property of the Pakistan Bureau of Statistics (PBS). PBS retains ownership; repository inclusion does not grant additional reuse or redistribution rights.

| File | Purpose |
| --- | --- |
| [quetta.json](quetta.json) | Dashboard aggregates; 725 cells from 9,652 respondents |
| [data_dictionary.md](data_dictionary.md) | Definitions, codes, units, and known classification limitations |
| [Cleaned Quetta Stata dataset](../research/data/finalprojectmariam.dta) | Author-supplied source extract, retained unchanged |
| [Original raw archive and metadata](../research/source/) | PBS national dataset archive, embedded labels, checksums, and verification |
| [Aggregate CSV results](../results/summary_tables.csv) | Browser-readable descriptive tables; no individual records |

A respondent-level `cleaned_data.csv` is intentionally not generated merely to duplicate the Stata file. The original and cleaned files already contain survey records and identifiers; they must not be described as anonymized. PBS permission and applicable terms govern further redistribution, and permission has not been independently established by this repository. No dataset license is invented here.

The geographic JSON files support map presentation and have separate source attribution in the main README; their colors do not encode survey estimates.
