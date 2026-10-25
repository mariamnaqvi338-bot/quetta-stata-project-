* Labor Force Structure in Quetta Division
* Portable descriptive runner for the supplied, already prepared dataset.
* Run from repository root: do research/stata/run-analysis.do
clear all
set more off
capture log close
log using "research/stata/local-analysis.smcl", replace
use "research/data/finalprojectmariam.dta", clear
keep if substr(PCode, 1, 2) == "41"
* Adapt the latest cleaned extract in memory, leaving the source unchanged.
gen gender = S4C5
gen marital_status = S4C7 if inrange(S4C7, 1, 4)
count
assert r(N) == 9652
count if employed == 1
assert r(N) == 2121
count if unemployed == 1
assert r(N) == 98
* Weighted descriptive tables retain the original variable definitions.
tabulate age_group [iw=Weights]
tabulate age_group if employed == 1 [iw=Weights]
tabulate age_group if unemployed == 1 [iw=Weights]
tabulate age_group edu_level [iw=Weights], missing
tabulate age_group marital_status [iw=Weights], missing
tabulate age_group gender [iw=Weights], missing
tabulate age_group Region [iw=Weights], missing
* Original unweighted hypothesis-test approach; not survey-design inference.
tabulate marital_status Region, chi2
tabulate edu_level gender, chi2
tabulate employed Region, chi2
ttest S4C6, by(Region)
log close
