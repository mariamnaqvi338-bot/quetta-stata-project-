************************************************************************************************************************
*----------------------------------------------------------------------------------------------------------------------------*
* Name: Syeda Mariam Naqvi
* Dataset: LFS 2020-21
* Division code: 41
* Province: Balochistan
* Division: Quetta
* Districts: Killa Abdullah, Pishin, Quetta City
*----------------------------------------------------------------------------------------------------------------------------*

*----------------------------------------------------------------------------------------------------------------------------*
* Section 1: Data Import and Preparation
*----------------------------------------------------------------------------------------------------------------------------*

*1.1 Download data from PBS
*1.2 Import into Stata and save as a stata datset
use "C:\Users\61424\AppData\Local\Temp\26d7c71b-8d78-403b-8f32-e005d8c36f9d_LFS2020-21_Microdata_STATA.zip.f9d\LFS2020-21.dta", clear

*----------------------------------------------------------------------------------------------------------------------------*
*1.3 Extract Division Code
*----------------------------------------------------------------------------------------------------------------------------*
* Extract the first two digits with province and division
gen division = substr(PCode,1,2)   

*----------------------------------------------------------------------------------------------------------------------------*

*1.4 Keep only Quetta Division 
*----------------------------------------------------------------------------------------------------------------------------*
keep if division == "41"
tabulate division

*----------------------------------------------------------------------------------------------------------------------------*

*1.5 Define Age Groups
*----------------------------------------------------------------------------------------------------------------------------*
generate age_group = 1 if S4C6 <= 9
replace age_group = 2 if S4C6 > 9 & S4C6 <= 19
replace age_group = 3 if S4C6 > 19 & S4C6 <= 29
replace age_group = 4 if S4C6 > 29 & S4C6 <= 39
replace age_group = 5 if S4C6 > 39 & S4C6 <= 49
replace age_group = 6 if S4C6 > 49 & S4C6 <= 59
replace age_group = 7 if S4C6 > 59 & S4C6 <= 69
replace age_group = 8 if S4C6 > 69 & S4C6 <= 79
replace age_group = 9 if S4C6 > 79 & S4C6 <= 89
replace age_group = 10 if S4C6 >= 90

label define age_group_label 1 "0-9" 2 "10-19" 3 "20-29" 4 "30-39" 5 "40-49" 6 "50-59" 7 "60-69" 8 "70-79" 9 "80-89" 10 "90 & above"
label values age_group age_group_label

*----------------------------------------------------------------------------------------------------------------------------*
*1.6 Define 7 Education Levels
*----------------------------------------------------------------------------------------------------------------------------*
gen edu_level = .
replace edu_level = 1 if S4C9 == 1
replace edu_level = 2 if S4C9 == 2
replace edu_level = 3 if S4C9 == 3
replace edu_level = 4 if S4C9 == 4
replace edu_level = 5 if S4C9 == 5
replace edu_level = 6 if S4C9 == 6
replace edu_level = 7 if S4C9 == 7
label define edu_level 1 "No formal education" 2 "Below Primary" 3 "Primary" 4 "Middle" 5 "Matric" 6 "Intermediate" 7 "Graduation"

label values edu_level edu_level_label

*----------------------------------------------------------------------------------------------------------------------------*
*1.7 Labor Force Status Classification
*----------------------------------------------------------------------------------------------------------------------------*
*1.7.1    Employed
gen employed = 0
replace employed = 1 if S5C1 == 1 | S5C2 == 1 | S5C3 == 1
label define empl 0 "Not employed" 1 "Employed"
label values employed empl


*1.7.2    Unemployed
gen unemployed = 0
replace unemployed = 1 if (S5C1 == 2 | S5C2 == 2 | S5C3 == 2) & S9C1 == 1
label define notemoly 0 "Not unemployed" 1 "Unemployed"
label values unemployed notemoly


*1.7.3    Not in Labor Force
gen not_in_labor_force = 0
replace not_in_labor_force = 1 if (S5C1 == 2 | S5C2 == 2 | S5C3 == 2) & S9C1 == 2
label define nlf 0 "In labor force" 1 "Not in labor force"
label values not_in_labor_force nlf



*----------------------------------------------------------------------------------------------------------------------------*
*1.8 Labor Force Participation
*----------------------------------------------------------------------------------------------------------------------------*
gen labor_force = 0
replace labor_force = 1 if employed == 1 | unemployed == 1
label define lf_label 0 "Not in labor force" 1 "Labor force"
label values labor_force lf_label
*----------------------------------------------------------------------------------------------------------------------------*
*1.9 Student Status
*----------------------------------------------------------------------------------------------------------------------------*
gen student_status = 0
replace student_status = 1 if inrange(S4C10, 2, 15)

label define student_label 0 "Not a Student" 1 "Student"
label values student_status student_label


*----------------------------------------------------------------------------------------------------------------------------*
*----------------------------------------------------------------------------------------------------------------------------*
* Section 2: Required Tabs & Graphs (Principal Economic Actvities)
*----------------------------------------------------------------------------------------------------------------------------*

*2.1.1    Distribution of employed individuals across the ten age groups
tab age_group if employed == 1
graph bar (count) [pweight = Weights] if employed == 1, over(age_group) title("Employed Individuals by Age Group") ytitle("Number of Employed")

*2.1.2    Distribution of unemployed individuals across the ten age groups
tab age_group if unemployed == 1
graph bar (count) [pweight = Weights] if unemployed == 1, over(age_group) title("Unemployed Individuals by Age Group") ytitle("Number of Unemployed")


*2.1.3    Distribution of individuals in the labor force (employed + unemployed) across the ten age groups
tab age_group if labor_force == 1
graph bar (count) [pweight = Weights] if labor_force == 1, over(age_group) title("Labor Force by Age Group") ytitle("Number of individuals in Labor Force")


*2.1.4    Distribution of individuals outside the labor force across the ten age groups.
tab age_group if not_in_labor_force == 1
graph bar (count) [pweight = Weights] if not_in_labor_force == 1, over(age_group) title("Not in Labor Force by Age Group") ytitle("Number of individuals Not in Labor Force")

*----------------------------------------------------------------------------------------------------------------------------*
* 2.2 Educational Attainment
*----------------------------------------------------------------------------------------------------------------------------*

tabulate age_group edu_level [iweight = Weights]
graph bar (count) [pweight = Weights], over(age_group, label(angle(forty_five) labsize(tiny))) over(edu_level, label(labsize(vsmall))) ytitle(Number of Individuals) title(Education Distribution by Age Group)



*----------------------------------------------------------------------------------------------------------------------------*
* 2.3 Marital Status
*----------------------------------------------------------------------------------------------------------------------------*

*2.3.1    Distribution of marital status categories 
gen marital_status = 1 if S4C7 == 1
replace marital_status = 2 if S4C7 == 2
replace marital_status = 3 if S4C7 == 3
replace marital_status = 4 if S4C7 == 4
label define marital_lbl 1 "Never Married" 2 "Married" 3 "Widow/Widower" 4 "Divorced"
label values marital_status marital_lbl
*created marital status variable*
*This gives a weighted table of marital status by age group:*
tabulate age_group marital_status [iweight = Weights]
*Bar Graph*
graph bar (count) [pweight = Weights], over(age_group, label(angle(forty_five) labsize(tiny))) over(marital_status, label(labsize(vsmall))) ytitle(Number of Individuals) title(Marital Status Distribution by Age Group)
tabulate age_group marital_status [iweight = Weights]

*----------------------------------------------------------------------------------------------------------------------------*
* 2.4 Disaggregation: Region & Gender
*----------------------------------------------------------------------------------------------------------------------------*

*    2.4.1 Urban, rural, and total population (within each age group)
 tabulate age_group Region [iweight = Weights]
 graph bar (count) [pweight = Weights], over(age_group, label(angle(forty_five) labsize(tiny))) over(Region, label(labsize(vsmall))) ytitle(Number of Individuals) title(Urban/Rural/Total Population by Age Group )



*    2.4.2 Male, female, and total population (within each age group)
gen gender = S4C5
label define gender_label 1 "Male" 2 "Female"
label values gender gender_label

tabulate ( age_group ) ( gender ) [iweight = Weights]
graph bar (count) [pweight = Weights], over(age_group, label(angle(forty_five) labsize(tiny))) over(gender, label(labsize(vsmall))) ytitle(Number of Individuals) title(Population by Age Group and Gender)


*    2.4.3 Rural Population (male vs female)
table ( age_group ) ( gender ) () if Region==1
table ( age_group ) ( gender ) () if Region==1 [pweight = Weights]
graph bar (count) [pweight = Weights] if Region==1, over(age_group, label(angle(forty_five) labsize(tiny))) over(gender, label(labsize(vsmall))) ytitle(Number of Individuals) title(Population by Age Group and Gender (Rural))

*    2.4.4 Urban Population (male vs female)
table ( age_group ) ( gender ) () if Region==2
table ( age_group ) ( gender ) () if Region==2 [pweight = Weights]
graph bar (count) [pweight = Weights] if Region==2, over(age_group, label(angle(forty_five) labsize(tiny))) over(gender, label(labsize(vsmall))) ytitle(Number of Individuals) title(Population by Age Group and Gender (Urban))

*----------------------------------------------------------------------------------------------------------------------------*
*----------------------------------------------------------------------------------------------------------------------------*
*            Section 3: Hypothesis testing
*----------------------------------------------------------------------------------------------------------------------------*

*----------------------------------------------------------------------------------------------------------------------------*
* 3.1.1 Marital Status
*----------------------------------------------------------------------------------------------------------------------------*

*    3.1.1.1 distribution of marital status is the same across regions
tabulate marital_status Region, chi2

*    3.1.1.2 distribution of marital status is the same across employment status
tabulate marital_status employed, chi2

*    3.1.1.3 distribution of marital status is the same across educational attainment
tabulate marital_status edu_level, chi2

*----------------------------------------------------------------------------------------------------------------------------*
*  3.1.2 Education Level:
*----------------------------------------------------------------------------------------------------------------------------*

*    3.1.2.1 distribution of educational attainment is the same across gender
tabulate edu_level gender, chi2

*    3.1.2.2 distribution of educational attainment is the same across region
tabulate edu_level Region, chi2

*    3.1.2.3 distribution of educational attainment of males is the same across region
tabulate edu_level Region if gender==1, chi2

*    3.1.2.4 distribution of educational attainment of females is the same across region
tabulate edu_level Region if gender==2, chi2

*----------------------------------------------------------------------------------------------------------------------------*
* 3.1.3 Employment Status:
*----------------------------------------------------------------------------------------------------------------------------*
*    3.1.3.1 distribution of employment status is the same across gender
tabulate employed gender, chi2

*    3.1.3.2 distribution of employment status is the same across region
tabulate employed Region, chi2

*    3.1.3.3 distribution of employment status of males is the same across region
tabulate employed Region if gender==1, chi2

*    3.1.3.4 distribution of employment status of females is the same across region
tabulate employed Region if gender==2, chi2

*----------------------------------------------------------------------------------------------------------------------------*
* 3.2 Independent Samples t-Test*
*----------------------------------------------------------------------------------------------------------------------------*
* 3.2.1 Comparison of Mean Age of Individuals:
*----------------------------------------------------------------------------------------------------------------------------*

*    3.2.1.1 mean age of rural individuals is equal to that of urban individuals
ttest S4C6, by(Region)

*    3.2.1.2 mean age of male individuals is equal to that of female individuals
ttest S4C6, by(gender)

*    3.2.1.3 mean age of male individuals is equal to that of female individuals in the rural region
ttest S4C6 if Region==1, by(gender)
*----------------------------------------------------------------------------------------------------------------------------*
*----------------------------------------------------------------------------------------------------------------------------*
*    END OF FILE
*----------------------------------------------------------------------------------------------------------------------------*
*----------------------------------------------------------------------------------------------------------------------------*
