# Original survey archive and coding metadata

**Source:** Pakistan Bureau of Statistics (PBS), Labour Force Survey 2020–21. The archive was supplied by the author and is retained unchanged.

- [Original compressed Stata data](LFS2020-21_Microdata_STATA.zip): approximately 25.5 MB compressed; contains `LFS2020-21.dta`, approximately 1.04 GB uncompressed. The large uncompressed file is not committed.
- [Extracted metadata and checksums](metadata.json): raw and Quetta sample sizes, embedded value labels, variable-label inventory, SHA-256 hashes, and verification outcome.

## Coding information available in this upload

The ZIP contains one `.dta` file, with no separate questionnaire or coding-scheme document. All variable-description labels are blank. The following value labels are embedded:

| Variable | Codes |
| --- | --- |
| `Province` | 1 = KP; 2 = Punjab; 3 = Sindh; 4 = Balochistan |
| `Region` | 1 = Rural; 2 = Urban |
| `S4C5` | 1 = Male; 2 = Female |

Other codes, including educational attainment (`S4C9`) and labor-market questions, have no explanatory value labels in this raw file. Dashboard education labels therefore continue to follow the supplied analysis script; they have not been independently verified against an official questionnaire. This metadata inventory is not a substitute for the PBS coding scheme.

## Verification

The raw file was read in chunks, filtered to `PCode` beginning with `41`, and compared with the prepared Quetta dataset. Every original column and record matched in order, ignoring storage-dtype differences. Additional derived variables in the prepared dataset are not part of that equality check, and their substantive definitions remain those of the supplied Stata analysis.

To repeat the check after extracting the original archive outside the repository:

```sh
python scripts/verify_raw.py /path/to/LFS2020-21.dta
```

The survey contains respondent-level records and survey identifiers. Retaining the original archive does not make it anonymized or assign new redistribution rights; consult the originating provider’s terms.
