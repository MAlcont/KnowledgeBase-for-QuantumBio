export const BUNDLE_VERSION='1.0';
const array=(x,name)=>{if(!Array.isArray(x))throw Error(`${name} must be an array`);return x};
const ids=(records,name)=>{const set=new Set();for(const r of array(records,name)){if(typeof r.id!=='string'||!r.id||set.has(r.id))throw Error(`Invalid or duplicate ID in ${name}`);set.add(r.id)}return set};
export function validateBundle(b){
 if(!b||b.bundle_version!==BUNDLE_VERSION)throw Error('Unsupported archive bundle. Choose archive.json built for bundle version 1.0.');
 if(!b.kb||b.kb.schema_version!=='0.2.0')throw Error('Unsupported core schema');
 const k=b.kb,S=ids(k.sources,'sources'),C=ids(k.claims,'claims'),F=ids(k.fragments,'fragments'),M=ids(k.models,'models');
 const need=(set,id,label)=>{if(!set.has(id))throw Error(`Unknown ${label}: ${id}`)};
 const refs=x=>array(x,'references').forEach(r=>need(S,r.source_id,'source'));
 for(const s of k.sources)if(!safeURL(s.url))throw Error(`Invalid source URL: ${s.id}`);
 for(const c of k.claims){if(typeof c.text!=='string')throw Error('Claim text required');refs(c.references);array(c.limits||[],'claim limits')}
 for(const m of k.models){refs(m.references);array(m.equations,'model equations')}
 for(const f of k.fragments){
  if(typeof f.title!=='string')throw Error('Fragment title required');
  for(const key of ['physiology','mathematics','hypotheses','evidence','relevance'])if(!f[key]||typeof f[key]!=='object')throw Error(`Missing layer ${key}`);
  for(const key of ['physiology','mathematics','hypotheses','evidence'])array(f[key].claim_ids,'claim_ids').forEach(id=>need(C,id,'claim'));
  array(f.physiology.tags,'tags');if(typeof f.physiology.lay_summary!=='string')throw Error('Physiology summary required');
  array(f.hypotheses.source_ids,'source_ids').forEach(id=>need(S,id,'source'));
  array(f.mathematics.model_ids,'model_ids').forEach(id=>need(M,id,'model'));
  if(typeof f.evidence.surface!=='boolean')throw Error('Community visibility must be boolean');
  array(f.links,'links').forEach(l=>need(F,l.target_fragment_id,'fragment'));
 }
 const P=b.parameter_space;if(!P||P.schema_version!=='0.2.0')throw Error('Missing parameter-space data');
 const E=ids(P.experiments,'experiments');const Q=ids(P.quantities,'quantities');
 for(const e of P.experiments){need(F,e.fragment_id,'fragment');need(S,e.source_id,'source');ids(e.arms,'arms')}
 for(const q of P.quantities){need(E,q.experiment_id,'experiment');refs(q.references);if(q.status==='reported' && (typeof q.value!=='number'||!Number.isFinite(q.value)))throw Error('Reported numeric quantity missing');if(q.status!=='reported'&&q.value!==null)throw Error('Missing quantity must be null')}
 for(const c of P.comparisons||[]){need(Q,c.quantity_id,'quantity');need(C,c.claim_id,'claim')}
 const seen=new Set();
 for(const a of array(b.articles,'articles')){need(F,a.fragment_id,'fragment');need(S,a.source_id,'source');if(seen.has(a.fragment_id))throw Error('Duplicate surface article');seen.add(a.fragment_id);for(const r of array(a.results,'results')){need(F,r.fragment_id,'fragment');need(S,r.source_id,'source');if(r.fragment_id!==a.fragment_id||r.source_id!==a.source_id)throw Error('Surface row outside article');if(typeof r.value!=='number'||!Number.isFinite(r.value))throw Error('Invalid surface value')}}
 return b;
}
export function safeURL(value){try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)?u.href:null}catch{return null}}
export function filterFragments(b,search='',state='all'){
 const q=search.trim().toLowerCase();return b.kb.fragments.filter(f=>{
  const sources=b.kb.sources.filter(s=>f.hypotheses.source_ids.includes(s.id));
  return (state!=='surfaced'||f.evidence.surface)&&(state!=='parameters'||parametersFor(b,f.id).length>0)&&JSON.stringify([f.title,f.id,f.physiology.tags,sources]).toLowerCase().includes(q)
 });
}
export function parametersFor(b,id){
 const ex=new Map(b.parameter_space.experiments.filter(e=>e.fragment_id===id).map(e=>[e.id,e]));
 const rows=b.parameter_space.quantities.filter(q=>ex.has(q.experiment_id)).map(q=>({fragment_id:id,context:q.experiment_id,variant:q.arm_id||'',observable:q.term_id,role:q.role,value:q.value,unit:q.unit,uncertainty:q.uncertainty?.value??null,uncertainty_kind:q.uncertainty?.status||'not_checked',status:q.status,origin:q.status==='reported'?'reported_in_source':'unresolved',source_ids:q.references.map(r=>r.source_id).join(';'),locator:q.references.map(r=>r.locator).join(';'),qualifier:q.qualifier||''}));
 for(const a of b.articles.filter(a=>a.fragment_id===id))for(const r of a.results)rows.push({fragment_id:id,context:'surface_record',variant:r.variant,observable:r.observable_id,role:r.result_type,value:r.value,unit:r.unit,uncertainty:r.uncertainty_value??null,uncertainty_kind:r.uncertainty_kind,status:r.status,origin:r.data_origin,source_ids:r.source_id,locator:r.locator,qualifier:r.origin_doi?`Origin DOI: ${r.origin_doi}`:''});
 return rows;
}
export function csv(rows,fields){
 const cell=v=>{if(v===null||v===undefined)return '""';let s=typeof v==='object'?JSON.stringify(v):String(v);if(typeof v==='string'&&/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"'};
 return '\ufeff'+[fields.map(cell).join(','),...rows.map(r=>fields.map(f=>cell(r[f])).join(','))].join('\r\n');
}
export function contextFor(b,id,contract){
 const fragment=b.kb.fragments.find(f=>f.id===id);if(!fragment)throw Error('Unknown fragment');
 const claimIds=new Set(['physiology','mathematics','hypotheses','evidence'].flatMap(k=>fragment[k].claim_ids));
 const claims=b.kb.claims.filter(c=>claimIds.has(c.id));const models=b.kb.models.filter(m=>fragment.mathematics.model_ids.includes(m.id));
 const sourceIds=new Set([...fragment.hypotheses.source_ids,...claims.flatMap(c=>c.references.map(r=>r.source_id)),...models.flatMap(m=>m.references.map(r=>r.source_id))]);
 return {contract,archive_version:b.archive_version,fragment,claims,models,sources:b.kb.sources.filter(s=>sourceIds.has(s.id)),parameters:parametersFor(b,id),surface_articles:b.articles.filter(a=>a.fragment_id===id),experimental_contexts:b.parameter_space.experiments.filter(e=>e.fragment_id===id),term_definitions:[...(b.parameter_space.vocabulary||[]),...(b.surface_vocabulary||[])].filter(t=>parametersFor(b,id).some(p=>p.observable===t.id)),limits:['No full article text included.','No model service was called.','The contract guides interpretation; it cannot guarantee model compliance.']};
}
