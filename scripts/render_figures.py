"""Recompute standalone research figures from the included Stata extract."""
from pathlib import Path
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.backends.backend_pdf import PdfPages
import numpy as np
import pandas as pd

root=Path(__file__).resolve().parents[1]
d=pd.read_stata(root/'research/data/finalprojectmariam.dta',convert_categoricals=False)
if 'gender' not in d:
    d['gender'] = d.S4C5
out=root/'research/figures'
out.mkdir(exist_ok=True)
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':10,'axes.spines.top':False,'axes.spines.right':False,'axes.spines.left':False,'axes.edgecolor':'#dddddf','axes.titleweight':'bold','figure.facecolor':'white','axes.labelcolor':'#55555b','xtick.color':'#66666b','ytick.color':'#66666b'})
ages=['0–9','10–19','20–29','30–39','40–49','50–59','60–69','70–79','80–89','90+']
def finish(fig,title,note,name):
    fig.suptitle(title,x=.08,y=.98,ha='left',fontsize=19,fontweight='bold')
    fig.text(.08,.025,note+'\nUploaded Quetta extract · 9,652 respondents · survey-weighted descriptive estimates',fontsize=8,color='#6c6c73')
    fig.tight_layout(rect=[.035,.1,.98,.88])
    fig.savefig(out/(name+'.png'),dpi=180,bbox_inches='tight')
    pdf.savefig(fig)
    plt.close(fig)
with PdfPages(out/'research-figures.pdf') as pdf:
    fig,axes=plt.subplots(1,2,figsize=(12,6))
    for ax,measure,color in zip(axes,['employed','unemployed'],['#222225','#a78bfa']):
        series=(d.Weights*d[measure]).groupby(d.age_group).sum().reindex(range(1,11),fill_value=0)
        ax.barh(ages,series,color=color,height=.62)
        ax.invert_yaxis();ax.set_title(measure.capitalize(),loc='left',pad=18)
        ax.set_xlabel('Weighted people (separate scales)');ax.xaxis.set_major_formatter(matplotlib.ticker.StrMethodFormatter('{x:,.0f}'))
        ax.set_xlim(0,max(series)*1.3)
        for i,v in enumerate(series):ax.text(v+max(series)*.025,i,f'{v:,.0f}',va='center',fontsize=8)
        ax.set_axisbelow(True);ax.grid(axis='x',alpha=.15)
    finish(fig,'Economic activity across the life course','Counts describe where activity is concentrated; they are not age-specific employment or unemployment rates.','economic-activity')
    fig,ax=plt.subplots(figsize=(12,6))
    labels=['Unclassified','No formal education','Below primary','Primary','Middle','Matric','Intermediate','Graduation']
    edu=d.edu_level.fillna(0).astype(int)
    y=np.arange(8)
    for gender,offset,color,label in [(1,-.18,'#222225','Male'),(2,.18,'#a78bfa','Female')]:
        sub=d[d.gender==gender];values=sub.Weights.groupby(edu.loc[sub.index]).sum().reindex(range(8),fill_value=0)/sub.Weights.sum()*100
        ax.barh(y+offset,values,height=.32,color=color,label=label)
    ax.set_yticks(y,labels);ax.invert_yaxis();ax.set_xlabel('Share of the selected gender’s weighted population (%)');ax.legend(frameon=False)
    ax.grid(axis='x',alpha=.15);ax.set_axisbelow(True)
    finish(fig,'Educational attainment by gender','Education categories reproduce the supplied mapping; missing categories remain unclassified.','education')
    fig,axes=plt.subplots(1,2,figsize=(12,6))
    for ax,measure,title in [(axes[0],'participation','Labor force / full population'),(axes[1],'unemployment','Unemployed / labor force')]:
        for j,(region,label) in enumerate([(1,'Rural'),(2,'Urban')]):
            sub=d[d.Region==region];lf=(sub.Weights*sub.labor_force).sum()
            value=100*(lf/sub.Weights.sum() if measure=='participation' else (sub.Weights*sub.unemployed).sum()/lf)
            ax.bar(label,value,color=['#222225','#e7ac4b'][j],width=.48)
            ax.text(j,value+.3,f'{value:.1f}%',ha='center',fontsize=12)
        ax.set_title(title,loc='left',pad=18);ax.set_ylabel('Percent');ax.set_ylim(0,ax.get_ylim()[1]*1.2);ax.grid(axis='y',alpha=.15);ax.set_axisbelow(True)
    finish(fig,'Two perspectives on rural–urban differences','Participation includes all ages, including children. These panels use different denominators and separate scales.','settlement')
print('Created three PNG figures and a three-page figure PDF')
