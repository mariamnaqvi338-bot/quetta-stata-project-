"""Verify the prepared Quetta extract against an unzipped raw LFS Stata file.
Usage: python scripts/verify_raw.py /path/to/LFS2020-21.dta
"""
from pathlib import Path
import sys
import pandas as pd

root = Path(__file__).resolve().parents[1]
parts = []
total = 0
with pd.read_stata(sys.argv[1], convert_categoricals=False, chunksize=50000) as reader:
    for chunk in reader:
        total += len(chunk)
        selected = chunk[chunk.PCode.astype(str).str.startswith('41')]
        if len(selected):
            parts.append(selected)
if not parts:
    raise ValueError('No Quetta records found in raw input')
raw_subset = pd.concat(parts, ignore_index=True)
prepared = pd.read_stata(root / 'research/data/finalprojectmariam.dta', convert_categoricals=False)
pd.testing.assert_frame_equal(raw_subset, prepared[raw_subset.columns].reset_index(drop=True),
                              check_dtype=False, check_categorical=False)
print(f'PASS: {total:,} raw records; {len(raw_subset):,} Quetta records; '
      f'all {len(raw_subset.columns)} original columns match the prepared extract')
