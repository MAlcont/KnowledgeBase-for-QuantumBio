"""Validate KB4qb JSON and export conservative spreadsheet views."""
import argparse
import csv
import json
from pathlib import Path
from jsonschema import Draft202012Validator, FormatChecker
from parameters import validate_parameter_space, query, audit

ROOT = Path(__file__).resolve().parents[1]

def validate(data):
    schema = json.loads((ROOT / 'schema/kb.schema.json').read_text())
    Draft202012Validator.check_schema(schema)
    Draft202012Validator(schema, format_checker=FormatChecker()).validate(data)
    ids = {}
    for collection in ('sources', 'models', 'claims', 'fragments'):
        values = [record['id'] for record in data[collection]]
        if len(values) != len(set(values)):
            raise ValueError(f'Duplicate ID in {collection}')
        ids[collection] = set(values)
    def walk(node):
        if isinstance(node, dict):
            for key, value in node.items():
                target = {'source_id':'sources', 'source_ids':'sources',
                          'model_ids':'models', 'claim_ids':'claims',
                          'target_fragment_id':'fragments'}.get(key)
                if target:
                    for identifier in value if isinstance(value, list) else [value]:
                        if identifier not in ids[target]:
                            raise ValueError(f'Unknown {key}: {identifier}')
                walk(value)
        elif isinstance(node, list):
            for value in node:
                walk(value)
    walk(data)

def cell(value):
    if value is None:
        return ''
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return value
    if isinstance(value, (list, dict)):
        value = json.dumps(value, ensure_ascii=False)
    else:
        value = str(value)
    if value.lstrip().startswith(('=', '+', '-', '@', '\t', '\r', '\n')) or value.startswith(('\t','\r','\n')):
        value = "'" + value
    return value

def write_csv(path, fields, rows):
    with path.open('w', encoding='utf-8-sig', newline='') as stream:
        writer = csv.DictWriter(stream, fieldnames=fields)
        writer.writeheader()
        for row in rows:
            writer.writerow({key: cell(row.get(key)) for key in fields})

def export(data, destination):
    destination.mkdir(parents=True, exist_ok=True)
    fields = ['fragment_id','title','physiology_tags','lay_summary','guidance_status',
              'mathematics_status','model_ids','hypothesis_claim_ids','source_ids',
              'evidence_claim_ids','evidence_status','evidence_assessments','surface',
              'surface_rationale','reviewer','reviewed_at','relevance_status','relevance_parameters']
    rows = []
    for f in data['fragments']:
        p,m,h,e,r = (f[key] for key in ('physiology','mathematics','hypotheses','evidence','relevance'))
        rows.append(dict(fragment_id=f['id'],title=f['title'],physiology_tags=p['tags'],
                         lay_summary=p['lay_summary'],guidance_status=p['guidance_status'],
                         mathematics_status=m['status'],model_ids=m['model_ids'],
                         hypothesis_claim_ids=h['claim_ids'],source_ids=h['source_ids'],
                         evidence_claim_ids=e['claim_ids'],evidence_status=e['status'],
                         evidence_assessments=e['assessments'],surface=e['surface'],
                         surface_rationale=e['surface_rationale'],reviewer=e['reviewer'],
                         reviewed_at=e['reviewed_at'],relevance_status=r['status'],
                         relevance_parameters=r['parameters']))
    write_csv(destination/'fragments.csv',fields,rows)
    write_csv(destination/'community.csv',fields,[r for r in rows if r['surface']])
    write_csv(destination/'claims.csv',['id','text','kind','references','conditions','limits'],data['claims'])
    write_csv(destination/'sources.csv',['id','url','doi','title','year','review_status','review_note'],data['sources'])

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command',choices=['validate','export','query','audit'])
    parser.add_argument('--input',type=Path,default=ROOT/'data/kb.json')
    parser.add_argument('--output',type=Path,default=ROOT/'exports')
    parser.add_argument('--parameters', type=Path, default=ROOT/'data/parameter-space.json')
    parser.add_argument('--term', default='qb:redox')
    args = parser.parse_args()
    data = json.loads(args.input.read_text())
    validate(data)
    parameters = json.loads(args.parameters.read_text())
    tables = validate_parameter_space(parameters, data)
    print(f"Valid: {len(data['fragments'])} fragments, {len(data['claims'])} claims, {len(data['sources'])} sources")
    if args.command == 'export':
        export(data,args.output)
        rows=[]
        for q in parameters['quantities']:
            unit=tables['units'][q['unit']]
            exp=tables['experiments'][q['experiment_id']]
            rows.append({**q,'fragment_id':exp['fragment_id'],'value_si':None if q['value'] is None else q['value']*unit['to_si'],'si_dimension':unit['dimension'],'potential_reference':exp['potential_reference']})
        write_csv(args.output/'parameters.csv',['id','fragment_id','experiment_id','arm_id','term_id','role','value','unit','value_si','si_dimension','status','qualifier','uncertainty','potential_reference','references'],rows)
        write_csv(args.output/'comparisons.csv',list(parameters['comparisons'][0]) if parameters['comparisons'] else ['id'],parameters['comparisons'])
        write_csv(args.output/'translation.csv',list(parameters['translation'][0]) if parameters['translation'] else ['fragment_id'],parameters['translation'])
        (args.output/'audit.json').write_text(json.dumps(audit(parameters),indent=2)+'\n')
        print(f'Exported seven CSV views and audit.json to {args.output}')
    elif args.command == 'query':
        print(json.dumps({'term':args.term,'experiment_ids':query(parameters,args.term)},indent=2))
    elif args.command == 'audit':
        print(json.dumps(audit(parameters),indent=2))

if __name__ == '__main__':
    main()
