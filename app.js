'use strict';
const ages=['0–9','10–19','20–29','30–39','40–49','50–59','60–69','70–79','80–89','90+'];
const education=['Unclassified','No formal education','Below primary','Primary','Middle','Matric','Intermediate','Graduation'];
const marital=['Unclassified','Never married','Married','Widow / widower','Divorced'];
const colors=['#276c55','#83a77a','#d59b65','#bdc6b5'];
const $=id=>document.getElementById(id);
let dataset,tab='labor',current=[];
const number=n=>new Intl.NumberFormat('en',{maximumFractionDigits:0}).format(n);
const percent=(a,b)=>b?`${(a/b*100).toFixed(1)}%`:'—';
const sum=(rows,key)=>rows.reduce((s,r)=>s+r[key],0);
const weighted=()=>$('measure').value==='weighted';
const val=(rows,key='population')=>sum(rows,key==='population'?(weighted()?'weight':'n'):(weighted()?key:key+'_n'));
const byAge=()=>ages.map((label,i)=>({label,rows:current.filter(r=>r.age===i+1)}));
function bars(groups,key='population'){
 const values=groups.map(g=>val(g.rows,key)),max=Math.max(...values,1);
 return `<div class="bars">${groups.map((g,i)=>`<div class="bar-row"><span>${g.label}</span><div class="track" title="${g.label}: ${number(values[i])}"><div class="fill" style="width:${values[i]/max*100}%"></div></div><span class="bar-value">${number(values[i])}</span></div>`).join('')}</div>`;
}
function card(title,subtitle,content,extra=''){return `<article class="card ${extra}"><h3>${title}</h3><p class="subtitle">${subtitle}</p>${content}</article>`;}
function render(){
 current=dataset.rows.filter(r=>['region','gender','age'].every(k=>!+$ (k).value||r[k]===+$ (k).value));
 const n=sum(current,'n'),population=val(current),lf=val(current,'labor_force'),unemployed=val(current,'unemployed');
 $('selection').textContent=['region','gender','age'].filter(k=>+$(k).value).map(k=>$(k).selectedOptions[0].text).join(' · ')||'All respondents';
 $('sample-note').textContent=`${number(n)} respondents · ${weighted()?'Survey-weighted estimates':'Unweighted sample counts'}`;
 const kpis=[['Selected population',number(population),weighted()?'Sum of survey weights':'Respondents in selected sample'],['Labor force',number(lf),`${percent(lf,population)} of selected population`],['Unemployment rate',percent(unemployed,lf),'Unemployed ÷ labor force'],['Female population share',percent(val(current.filter(r=>r.gender===2)),population),'Female ÷ selected population']];
 $('kpis').innerHTML=kpis.map(([label,value,note])=>`<article class="kpi"><span class="label">${label}</span><strong>${value}</strong><small>${note}</small></article>`).join('');
 const groups=byAge(),unit=weighted()?'Weighted people':'Sample respondents';
 if(tab==='labor'){
  const status=[['Employed',val(current,'employed')],['Unemployed',unemployed],['Outside labor force',val(current,'not_in_labor_force')],['Unclassified',Math.max(0,population-lf-val(current,'not_in_labor_force'))]];
  const content=status.map(([label,v],i)=>`<div class="status-row"><div><span><i class="dot" style="background:${colors[i]}"></i>${label}</span><span>${number(v)} · ${percent(v,population)}</span></div><div class="track"><div class="fill" style="width:${population?v/population*100:0}%;background:${colors[i]}"></div></div></div>`).join('');
  $('panel').innerHTML=`<div class="chart-grid">${card('Where employment is concentrated',`${unit} by age group · bar lengths show counts`,bars(groups,'employed'))}${card('A snapshot of economic activity','Shares of the full selected population',content+`<p class="insight">${n<30?'Small sample: fewer than 30 respondents. Interpret estimates cautiously.':`Labor force participation is <strong>${percent(lf,population)}</strong> in this selection.`} The denominator includes children when selected. Unclassified records are retained.</p>`)}</div>`;
 }else if(tab==='education'){
  $('panel').innerHTML=`<div class="chart-grid">${card('Educational attainment',`${unit} · categories follow the original project`,bars(education.map((label,i)=>({label,rows:current.filter(r=>r.education===i)}))),'wide-labels')}${card('Students across generations',`${unit} · student_status from the supplied project`,bars(groups,'student_status'))}</div>`;
 }else if(tab==='demographics'){
  $('panel').innerHTML=`<div class="chart-grid">${card('The age profile',`${unit} · all selected respondents`,bars(groups))}${card('Marital status',`${unit} · missing categories are retained`,bars(marital.map((label,i)=>({label,rows:current.filter(r=>r.marital===i)}))),'wide-labels')}</div><div class="chart-grid" style="margin-top:20px">${card('Rural and urban population',unit,bars(['Rural','Urban'].map((label,i)=>({label,rows:current.filter(r=>r.region===i+1)}))))}${card('Population by gender',unit,bars(['Male','Female'].map((label,i)=>({label,rows:current.filter(r=>r.gender===i+1)}))))}</div>`;
 }else{
  const tests=[['Marital status × region','0.514','Not significant'],['Marital status × employment','<0.001','Significant'],['Education × gender','<0.001','Significant'],['Education × region','<0.001','Significant'],['Employment × gender','<0.001','Significant'],['Employment × region','0.687','Not significant'],['Female employment × region','0.004','Significant']];
  $('panel').innerHTML=card('From the original research','Reported results · full Quetta sample · these results do not change with dashboard filters',`<div class="research"><p>The report examines age, gender, region, education, and employment using the 2020–21 Labor Force Survey. The dashboard recomputes descriptive counts from the supplied dataset rather than copying narrative percentages.</p><div class="table-wrap"><table><thead><tr><th>Chi-square comparison</th><th>Reported p-value</th><th>At α = 0.05</th></tr></thead><tbody>${tests.map(t=>`<tr>${t.map((v,i)=>`<${i?'td':'th'}>${v}</${i?'td':'th'}>`).join('')}</tr>`).join('')}</tbody></table></div><p>These are selected unweighted tests quoted from the submitted report, not independently rerun survey-design tests. “0.000” in the report is displayed as p &lt; 0.001. Statistical association does not establish a causal explanation.</p><p><strong>Read the charts carefully:</strong> a share of all unemployed people in an age group is different from the unemployment rate within that age group. This dashboard labels denominators explicitly.</p></div>`);
 }
 $('table-body').innerHTML=groups.map(g=>`<tr><td>${g.label}</td>${['population','employed','unemployed','labor_force','not_in_labor_force'].map(k=>`<td>${number(val(g.rows,k))}</td>`).join('')}</tr>`).join('');
}
ages.forEach((label,i)=>$('age').add(new Option(label,i+1)));
['region','gender','age','measure'].forEach(k=>$(k).addEventListener('change',render));
$('reset').addEventListener('click',()=>{['region','gender','age'].forEach(k=>$(k).value='0');$('measure').value='weighted';render();});
document.querySelectorAll('[data-tab]').forEach(button=>{
 button.addEventListener('click',()=>{tab=button.dataset.tab;document.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-selected',b===button?'true':'false'));$('panel').setAttribute('aria-labelledby',button.id);render();});
 button.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const tabs=[...document.querySelectorAll('[data-tab]')],i=tabs.indexOf(button);const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[next].focus();tabs[next].click();});
});
$('download').addEventListener('click',()=>{
 const header=['age_group','measure','region_filter','gender_filter','age_filter','sample_n','population','employed','unemployed','labor_force','outside_labor_force'];
 const lines=byAge().map(g=>[g.label,$('measure').value,...['region','gender','age'].map(k=>$(k).selectedOptions[0].text),sum(g.rows,'n'),...['population','employed','unemployed','labor_force','not_in_labor_force'].map(k=>val(g.rows,k))]);
 const blob=new Blob([[header,...lines].map(row=>row.join(',')).join('\n')],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='quetta-filtered-summary.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
fetch('data/quetta.json').then(r=>{if(!r.ok)throw Error('Data unavailable');return r.json();}).then(data=>{dataset=data;render();$('loading').hidden=true;$('dashboard').hidden=false;}).catch(()=>{$('loading').textContent='Could not load survey data. Serve this folder with a local web server and reload.';});
