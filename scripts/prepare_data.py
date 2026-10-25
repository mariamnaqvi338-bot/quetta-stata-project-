"""Build dashboard aggregates: python scripts/prepare_data.py /path/to/project.dta."""
import hashlib
import json
import sys
from pathlib import Path
import pandas as pd

source = Path(sys.argv[1])
d = pd.read_stata(source, convert_categoricals=False)
d = d[d.PCode.astype(str).str.startswith('41')].copy()
assert len(d) and d.Weights.gt(0).all()
# The latest cleaned extract retains raw gender/marital codes and calls its
# binary student indicator 'student'. Adapt fields without modifying the file.
if 'gender' not in d:
    d['gender'] = d.S4C5
if 'marital_status' not in d:
    d['marital_status'] = d.S4C7.where(d.S4C7.isin([1, 2, 3, 4]))
if 'student_status' not in d:
    d['student_status'] = d.student if 'student' in d else d.S4C10.between(2, 15).astype(int)
assert d.student_status.isin([0, 1]).all()
d['district_code'] = d.District.map({'QUETTA': 1, 'PISHIN': 2, 'KILLA ABDULLAH': 3})
keys = ['age_group', 'Region', 'gender', 'edu_level', 'marital_status', 'district_code']
d[keys] = d[keys].fillna(0).astype(int)
measures = ['employed', 'unemployed', 'not_in_labor_force', 'labor_force', 'student_status']
for m in measures:
    d[m + '_weighted'] = d[m] * d.Weights
rows = []
for group, frame in d.groupby(keys, dropna=False):
    rows.append(dict(zip(['age', 'region', 'gender', 'education', 'marital', 'district'], map(int, group)),
        n=len(frame), weight=float(frame.Weights.sum()),
        **{m: float(frame[m + '_weighted'].sum()) for m in measures},
        **{m + '_n': int(frame[m].sum()) for m in measures}))
result = {'source': 'Pakistan Bureau of Statistics · Labour Force Survey 2020–21',
          'division': 'Quetta (41)', 'sample': len(d),
          'source_sha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'rows': rows}
target = Path(__file__).resolve().parents[1] / 'data' / 'quetta.json'
target.write_text(json.dumps(result, separators=(',', ':'), allow_nan=False) + '\n')
print(f'Wrote {len(rows)} aggregate cells from {len(d):,} survey records')
