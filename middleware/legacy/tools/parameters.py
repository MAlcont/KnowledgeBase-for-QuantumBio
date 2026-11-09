"""Typed parameter graph, safe dimension-aware formula evaluator and bounded audit."""
import json, math
from pathlib import Path
from jsonschema import Draft202012Validator, FormatChecker
ROOT=Path(__file__).resolve().parents[1]
ZERO=(0,)*7

def index(records):
    result={r['id']:r for r in records}
    if len(result)!=len(records): raise ValueError('Duplicate ID')
    return result

def expression(node, variables):
    if 'var' in node:
        if node['var'] not in variables: raise ValueError('Unknown model variable')
        return variables[node['var']]
    op=node['op']; args=node['args']
    if len(args)!=(1 if op=='exp' else 2): raise ValueError('Wrong expression arity')
    a,da=expression(args[0],variables)
    if op=='exp':
        if da!=ZERO: raise ValueError('Exponential requires a dimensionless argument')
        return math.exp(a),ZERO
    b,db=expression(args[1],variables)
    if op in ('add','sub'):
        if da!=db: raise ValueError('Incompatible dimensions')
        return (a+b if op=='add' else a-b),da
    if op=='mul': return a*b,tuple(x+y for x,y in zip(da,db))
    if op=='div':
        if b==0: raise ValueError('Zero denominator')
        return a/b,tuple(x-y for x,y in zip(da,db))
    raise ValueError('Unknown expression operator')

def evaluate(space, inputs, units):
    if set(inputs)!={v['name'] for v in space['variables']}: raise ValueError('Missing or extra model inputs')
    values={}
    for v in space['variables']:
        val=inputs[v['name']]
        if not isinstance(val,(int,float)) or not math.isfinite(val): raise ValueError('Nonfinite model input')
        if val<v['lower'] or (v['lower_exclusive'] and val==v['lower']): raise ValueError('Model domain violation')
        unit=units[v['unit']];values[v['name']]=(val*unit['to_si'],tuple(unit['dimension']))
    result,dimension=expression(space['expression'],values)
    output=units[space['output_unit']]
    if dimension!=tuple(output['dimension']): raise ValueError('Output dimension mismatch')
    if not math.isfinite(result): raise ValueError('Nonfinite result')
    return result/output['to_si']

def validate_parameter_space(data,kb):
    schema=json.loads((ROOT/'schema/parameter-space.schema.json').read_text())
    Draft202012Validator.check_schema(schema)
    Draft202012Validator(schema,format_checker=FormatChecker()).validate(data)
    tables={name:index(data[name]) for name in ['vocabulary','units','experiments','quantities','mathematical_spaces','model_checks','comparisons']}
    tables.update({name:index(kb[name]) for name in ['fragments','claims','sources','models']})
    def require(table,id):
        if id not in tables[table]:raise ValueError(f'Unknown {table} ID: {id}')
    def walk(node):
        if isinstance(node,dict):
            for key,value in node.items():
                table={'fragment_id':'fragments','claim_id':'claims','source_id':'sources','model_id':'models','experiment_id':'experiments','quantity_id':'quantities','space_id':'mathematical_spaces','term_id':'vocabulary','system_term_id':'vocabulary','process_term_id':'vocabulary','mechanism_term_ids':'vocabulary','parent_ids':'vocabulary','unit':'units','output_unit':'units','allowed_units':'units'}.get(key)
                if table:
                    for id in value if isinstance(value,list) else [value]: require(table,id)
                walk(value)
        elif isinstance(node,list):
            for v in node:walk(v)
    walk(data)
    visiting=set();done=set()
    def visit(id):
        if id in visiting:raise ValueError('Cyclic vocabulary hierarchy')
        if id in done:return
        visiting.add(id)
        for parent in tables['vocabulary'][id]['parent_ids']:visit(parent)
        visiting.remove(id);done.add(id)
    for id in tables['vocabulary']:visit(id)
    for f in kb['fragments']:
        expected={e['id'] for e in data['experiments'] if e['fragment_id']==f['id']}
        if set(f['experiment_ids'])!=expected:raise ValueError('Fragment/experiment linkage mismatch')
    for exp in data['experiments']:index(exp['arms'])
    for q in data['quantities']:
        if q['unit'] not in tables['vocabulary'][q['term_id']]['allowed_units']:raise ValueError('Invalid quantity unit')
        if q['arm_id'] is not None and q['arm_id'] not in index(tables['experiments'][q['experiment_id']]['arms']):raise ValueError('Arm outside experiment')
        if q['uncertainty']['status']=='not_extracted' and q['uncertainty']['value'] is not None:raise ValueError('Invented uncertainty')
    for c in data['comparisons']:
        arms=index(tables['experiments'][c['experiment_id']]['arms'])
        if c['intervention_arm_id'] not in arms or c['comparator_arm_id'] not in arms:raise ValueError('Comparator outside experiment')
        if tables['quantities'][c['quantity_id']]['experiment_id']!=c['experiment_id']:raise ValueError('Cross-context comparison')
        if c['intervention_arm_id']==c['comparator_arm_id']:raise ValueError('Self-comparison')
    for q in data['quantities']:
        if q['role']=='contrast' and len([c for c in data['comparisons'] if c['quantity_id']==q['id']])!=1:
            raise ValueError('Contrast needs exactly one structured comparison')
    for sp in data['mathematical_spaces']:
        values={v['name']:max(1,v['lower']+1) for v in sp['variables']}
        evaluate(sp,values,tables['units'])
    for ch in data['model_checks']:evaluate(tables['mathematical_spaces'][ch['space_id']],ch['inputs'],tables['units'])
    for t in data['translation']:
        levels={e['biological_level'] for e in data['experiments'] if e['fragment_id']==t['fragment_id']}
        if t['tested_level'] not in levels:raise ValueError('Translation level contradicts experiments')
        if t['tested_level']=='abiotic' and t['clinical_evidence']=='established_here':raise ValueError('Abiotic evidence cannot establish clinical evidence')
    return tables

def descendants(term,terms):
    if term not in terms:raise ValueError('Unknown query term')
    found={term}
    while True:
        new=found|{t['id'] for t in terms.values() if set(t['parent_ids'])&found}
        if new==found:return found
        found=new

def query(data,term):
    selected=descendants(term,index(data['vocabulary']))
    return [e['id'] for e in data['experiments'] if selected & {e['system_term_id'],e['process_term_id'],*e['mechanism_term_ids']}]

def audit(data):
    units=index(data['units']);spaces=index(data['mathematical_spaces'])
    checks=[]
    for ch in data['model_checks']:
        computed=evaluate(spaces[ch['space_id']],ch['inputs'],units)
        reported=ch['reported_output']
        error=abs(computed-reported)/abs(reported) if reported else abs(computed)
        checks.append(dict(id=ch['id'],computed=computed,reported=reported,relative_error=error,review_trigger=error>ch['relative_tolerance'],tolerance=ch['relative_tolerance']))
    return {'model_arithmetic':checks,'source_notes':data['audit_notes'],
            'translation_blocks':[{'fragment_id':t['fragment_id'],'decision':t['decision'],'blocking_codes':t['blocking_codes']} for t in data['translation']],
            'limits':'Arithmetic is not validation of the physical mechanism; review triggers are curator-defined.'}
