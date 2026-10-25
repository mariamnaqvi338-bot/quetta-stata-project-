"""Export aggregate descriptive tables from the current dashboard data."""
from pathlib import Path
import csv
import json

root = Path(__file__).resolve().parents[1]
rows = json.loads((root / 'data/quetta.json').read_text())['rows']
out = root / 'results'
out.mkdir(exist_ok=True)
measures = ['employed', 'unemployed', 'labor_force', 'not_in_labor_force', 'student_status']
labels = {
    'age': {i+1: label for i, label in enumerate(['0–9','10–19','20–29','30–39','40–49','50–59','60–69','70–79','80–89','90+'])},
    'district': {1:'Quetta',2:'Pishin',3:'Killa Abdullah'},
    'region': {1:'Rural',2:'Urban'},
    'gender': {1:'Male',2:'Female'},
}
fields = ['dimension','group','sample_n','weighted_population']
fields += [field for m in measures for field in [m+'_sample_n', m+'_weighted']]
fields += ['weighted_unclassified','participation_full_population_pct','unemployment_rate_pct']
with (out / 'summary_tables.csv').open('w', newline='', encoding='utf-8') as handle:
    writer = csv.DictWriter(handle, fieldnames=fields)
    writer.writeheader()
    selections = [('total', 'All respondents', rows)]
    for dimension, mapping in labels.items():
        selections += [(dimension,label,[r for r in rows if r[dimension]==code]) for code,label in mapping.items()]
    for dimension, label, selected in selections:
        value = {'dimension':dimension,'group':label,'sample_n':sum(r['n'] for r in selected),
                 'weighted_population':sum(r['weight'] for r in selected)}
        for m in measures:
            value[m+'_sample_n'] = sum(r[m+'_n'] for r in selected)
            value[m+'_weighted'] = sum(r[m] for r in selected)
        population = value['weighted_population']
        lf = value['labor_force_weighted']
        value['weighted_unclassified'] = max(0, population-lf-value['not_in_labor_force_weighted'])
        value['participation_full_population_pct'] = 100*lf/population if population else ''
        value['unemployment_rate_pct'] = 100*value['unemployed_weighted']/lf if lf else ''
        writer.writerow({k:round(v,6) if isinstance(v,float) else v for k,v in value.items()})
print('Exported 20 descriptive summary rows (total and separate age, district, settlement, gender breakdowns).')
