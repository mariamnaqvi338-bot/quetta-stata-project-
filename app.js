'use strict';
const ages=['0–9','10–19','20–29','30–39','40–49','50–59','60–69','70–79','80–89','90+'];
const education=['Unclassified','No formal education','Below primary','Primary','Middle','Matric','Intermediate','Graduation'];
const marital=['Unclassified','Never married','Married','Widow / widower','Divorced'];
const colors=['#18181b','#a78bfa','#e7ac4b','#b6b6bc'];
const $=id=>document.getElementById(id);
let dataset,tab='labor',current=[],chartMetric='employed',chartMode='count';
const number=n=>new Intl.NumberFormat('en',{maximumFractionDigits:0}).format(n);
const percent=(a,b)=>b?`${(a/b*100).toFixed(1)}%`:'—';
const sum=(rows,key)=>rows.reduce((s,r)=>s+r[key],0);
const weighted=()=>$('measure').value==='weighted';
const val=(rows,key='population')=>sum(rows,key==='population'?(weighted()?'weight':'n'):(weighted()?key:key+'_n'));
const byAge=()=>ages.map((label,i)=>({label,rows:current.filter(r=>r.age===i+1)}));
function bars(groups,key='population',share=false){
 const values=groups.map(g=>val(g.rows,key)),total=values.reduce((a,b)=>a+b,0),max=share?Math.max(total,1):Math.max(...values,1);
 return `<div class="bars">${groups.map((g,i)=>`<div class="bar-row"><span>${g.label}</span><div class="track" tabindex="0" role="img" aria-label="${g.label}: ${number(values[i])}, ${percent(values[i],total)} of displayed total" title="${g.label}: ${number(values[i])} · ${percent(values[i],total)} of displayed total"><div class="fill" style="width:${values[i]/max*100}%"></div></div><span class="bar-value">${share?percent(values[i],total):number(values[i])}</span></div>`).join('')}</div>`;
}
function card(title,subtitle,content,extra=''){return `<article class="card ${extra}"><h3>${title}</h3><p class="subtitle">${subtitle}</p>${content}</article>`;}
function render(){
 current=dataset.rows.filter(r=>['district','region','gender','age'].every(k=>!+$(k).value||r[k]===+$(k).value));
 syncMap();
 const n=sum(current,'n'),population=val(current),lf=val(current,'labor_force'),unemployed=val(current,'unemployed');
 $('selection').textContent=['district','region','gender','age'].filter(k=>+$(k).value).map(k=>$(k).selectedOptions[0].text).join(' · ')||'All respondents';
 $('sample-note').textContent=`${number(n)} respondents · ${weighted()?'Survey-weighted estimates':'Unweighted sample counts'}`;
 const kpis=[['Selected population',number(population),weighted()?'Sum of survey weights':'Respondents in selected sample'],['Labor force',number(lf),`${percent(lf,population)} of selected population`],['Unemployment rate',percent(unemployed,lf),'Unemployed ÷ labor force'],['Female population share',percent(val(current.filter(r=>r.gender===2)),population),'Female ÷ selected population']];
 $('kpis').innerHTML=kpis.map(([label,value,note])=>`<article class="kpi"><span class="label">${label}</span><strong>${value}</strong><small>${note}</small></article>`).join('');
 const groups=byAge(),unit=weighted()?'Weighted people':'Sample respondents';
 if(tab==='labor'){
  const status=[['Employed',val(current,'employed')],['Unemployed',unemployed],['Outside labor force',val(current,'not_in_labor_force')],['Unclassified',Math.max(0,population-lf-val(current,'not_in_labor_force'))]];
  const content=status.map(([label,v],i)=>`<div class="status-row"><div><span><i class="dot" style="background:${colors[i]}"></i>${label}</span><span>${number(v)} · ${percent(v,population)}</span></div><div class="track"><div class="fill" style="width:${population?v/population*100:0}%;background:${colors[i]}"></div></div></div>`).join('');
  $('panel').innerHTML=`<div class="chart-grid">${card('Economic activity by age',`${unit} · ${chartMode==='share'?'share of the selected indicator total, not an age-specific rate':'counts by age group'}`,`<div class="chart-controls"><label>Indicator<select id="chart-metric">${[['employed','Employed'],['unemployed','Unemployed'],['labor_force','Labor force'],['not_in_labor_force','Outside labor force']].map(([v,t])=>`<option value="${v}" ${chartMetric===v?'selected':''}>${t}</option>`).join('')}</select></label><label>Display<select id="chart-mode"><option value="count" ${chartMode==='count'?'selected':''}>Counts</option><option value="share" ${chartMode==='share'?'selected':''}>Share of total (%)</option></select></label></div>`+bars(groups,chartMetric,chartMode==='share'))}${card('A snapshot of economic activity','Shares of the full selected population',content+`<p class="insight">${n<30?'Small sample: fewer than 30 respondents. Interpret estimates cautiously.':`Labor force participation is <strong>${percent(lf,population)}</strong> in this selection.`} The denominator includes children when selected. Unclassified records are retained.</p>`)}</div>`;
 }else if(tab==='education'){
  $('panel').innerHTML=`<div class="chart-grid">${card('Educational attainment',`${unit} · categories follow the original project`,bars(education.map((label,i)=>({label,rows:current.filter(r=>r.education===i)}))),'wide-labels')}${card('Students across generations',`${unit} · student_status from the supplied project`,bars(groups,'student_status'))}</div>`;
 }else if(tab==='demographics'){
  $('panel').innerHTML=`<div class="chart-grid">${card('The age profile',`${unit} · all selected respondents`,bars(groups))}${card('Marital status',`${unit} · missing categories are retained`,bars(marital.map((label,i)=>({label,rows:current.filter(r=>r.marital===i)}))),'wide-labels')}</div><div class="chart-grid" style="margin-top:20px">${card('Rural and urban population',unit,bars(['Rural','Urban'].map((label,i)=>({label,rows:current.filter(r=>r.region===i+1)}))))}${card('Population by gender',unit,bars(['Male','Female'].map((label,i)=>({label,rows:current.filter(r=>r.gender===i+1)}))))}</div>`;
 }else{
  const tests=[['Marital status × region','0.514','Not significant'],['Marital status × employment','<0.001','Significant'],['Education × gender','<0.001','Significant'],['Education × region','<0.001','Significant'],['Employment × gender','<0.001','Significant'],['Employment × region','0.687','Not significant'],['Female employment × region','0.004','Significant']];
  $('panel').innerHTML=card('From the original research','Reported results · full Quetta sample · these results do not change with dashboard filters',`<div class="research"><p>The report examines age, gender, region, education, and employment using the 2020–21 Labor Force Survey. The dashboard recomputes descriptive counts from the supplied dataset rather than copying narrative percentages.</p><div class="table-wrap"><table><thead><tr><th>Chi-square comparison</th><th>Reported p-value</th><th>At α = 0.05</th></tr></thead><tbody>${tests.map(t=>`<tr>${t.map((v,i)=>`<${i?'td':'th'}>${v}</${i?'td':'th'}>`).join('')}</tr>`).join('')}</tbody></table></div><p>These are selected unweighted tests quoted from the submitted report, not independently rerun survey-design tests. “0.000” in the report is displayed as p &lt; 0.001. Statistical association does not establish a causal explanation.</p><p><strong>Read the charts carefully:</strong> a share of all unemployed people in an age group is different from the unemployment rate within that age group. This dashboard labels denominators explicitly.</p></div>`);
 }
 if($('chart-metric')){$('chart-metric').addEventListener('change',e=>{chartMetric=e.target.value;render();});$('chart-mode').addEventListener('change',e=>{chartMode=e.target.value;render();});}
 $('table-body').innerHTML=groups.map(g=>`<tr><td>${g.label}</td>${['population','employed','unemployed','labor_force','not_in_labor_force'].map(k=>`<td>${number(val(g.rows,k))}</td>`).join('')}</tr>`).join('');
}
ages.forEach((label,i)=>$('age').add(new Option(label,i+1)));
['district','region','gender','age','measure'].forEach(k=>$(k).addEventListener('change',render));
$('reset').addEventListener('click',()=>{['district','region','gender','age'].forEach(k=>$(k).value='0');$('measure').value='weighted';render();});
document.querySelectorAll('[data-tab]').forEach(button=>{
 button.addEventListener('click',()=>{tab=button.dataset.tab;document.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-selected',b===button?'true':'false'));$('panel').setAttribute('aria-labelledby',button.id);render();});
 button.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const tabs=[...document.querySelectorAll('[data-tab]')],i=tabs.indexOf(button);const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[next].focus();tabs[next].click();});
});
$('download').addEventListener('click',()=>{
 const header=['age_group','measure','district_filter','region_filter','gender_filter','age_filter','sample_n','population','employed','unemployed','labor_force','outside_labor_force'];
 const lines=byAge().map(g=>[g.label,$('measure').value,...['district','region','gender','age'].map(k=>$(k).selectedOptions[0].text),sum(g.rows,'n'),...['population','employed','unemployed','labor_force','not_in_labor_force'].map(k=>val(g.rows,k))]);
 const blob=new Blob([[header,...lines].map(row=>row.join(',')).join('\n')],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='quetta-filtered-summary.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
fetch('data/quetta.json').then(r=>{if(!r.ok)throw Error('Data unavailable');return r.json();}).then(data=>{dataset=data;render();$('loading').hidden=true;$('dashboard').hidden=false;}).catch(()=>{$('loading').textContent='Could not load survey data. Serve this folder with a local web server and reload.';});

function syncMap(){
 const selected=+$('district').value;
 document.querySelectorAll('[data-district]').forEach(b=>{const active=+b.dataset.district===selected;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
 document.querySelectorAll('[data-region]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.region===+$('region').value)));
 $('map-selection').textContent=selected?`${$('district').selectedOptions[0].text} selected · charts updated`:'All three districts selected';
 document.querySelectorAll('.district-marker').forEach(m=>m.classList.toggle('selected',!selected||+m.dataset.id===selected));
}
document.querySelectorAll('[data-district]').forEach(b=>b.addEventListener('click',()=>{if(!dataset)return;$('district').value=b.dataset.district;render();}));
document.querySelectorAll('[data-region]').forEach(b=>b.addEventListener('click',()=>{if(!dataset)return;$('region').value=b.dataset.region;render();}));
let zoom=1;
function setZoom(value){zoom=Math.max(1,Math.min(2.5,value));const w=560/zoom,h=430/zoom;$('pakistan-map').setAttribute('viewBox',`${280-w/2} ${215-h/2} ${w} ${h}`);}
$('map-in').addEventListener('click',()=>setZoom(zoom+.25));
$('map-out').addEventListener('click',()=>setZoom(zoom-.25));
$('map-reset').addEventListener('click',()=>setZoom(1));
fetch('data/pakistan.geojson').then(r=>{if(!r.ok)throw Error();return r.json();}).then(geo=>{
 const project=([lon,lat])=>[50+(lon-60)*24,400-(lat-24)*28];
 const ringPath=ring=>ring.map((p,i)=>(i?'L':'M')+project(p).join(',')).join(' ')+' Z';
 const outlines=geo.features.map(f=>{const polygons=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;return `<path class="country-outline" d="${polygons.flatMap(p=>p.map(ringPath)).join(' ')}"/>`;}).join('');
 const places=[{id:1,name:'Quetta',p:[66.99,30.18],y:260},{id:2,name:'Pishin',p:[66.99,30.58],y:213},{id:3,name:'Killa Abdullah',p:[66.66,30.73],y:166}];
 const markers=places.map(place=>{const [x,y]=project(place.p);return `<g class="district-marker selected" data-id="${place.id}" role="button" tabindex="0" aria-label="Filter to ${place.name}"><title>Select ${place.name}</title><path class="leader" d="M${x},${y} L310,${place.y} L340,${place.y}"/><circle class="marker-hit" cx="${x}" cy="${y}" r="10"/><circle class="marker-dot" cx="${x}" cy="${y}" r="4"/><rect class="marker-label" x="340" y="${place.y-15}" width="143" height="30" rx="4"/><text x="351" y="${place.y+4}">${place.name} ↗</text></g>`;}).join('');
 const [qx,qy]=project([66.99,30.18]);
 $('pakistan-map').innerHTML=`<defs><pattern id="map-grid" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="#ddd"/></pattern></defs><rect x="0" y="0" width="560" height="430" fill="url(#map-grid)"/>${outlines}<text x="255" y="99" class="country-label">PAKISTAN</text><text x="120" y="266" class="province-label">BALOCHISTAN</text><circle class="study-halo" cx="${qx}" cy="${qy-7}" r="28"/>${markers}<text x="60" y="403" class="sea-label">ARABIAN SEA</text>`;
 document.querySelectorAll('.district-marker').forEach(m=>{const select=()=>{if(!dataset)return;$('district').value=m.dataset.id;render();};m.addEventListener('click',select);m.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select();}});});
 syncMap();
}).catch(()=>{$('pakistan-map').outerHTML='<p class="empty">Map could not load. Use the district buttons to explore the study area.</p>';});
