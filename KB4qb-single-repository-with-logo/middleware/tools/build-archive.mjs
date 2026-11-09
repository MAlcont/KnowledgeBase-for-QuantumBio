import fs from 'node:fs/promises';import path from 'node:path';import {validateBundle} from '../web/core.js';
const root=path.resolve(process.argv[2]||'archive');
const read=async p=>JSON.parse(await fs.readFile(path.join(root,p),'utf8'));
const kb=await read('data/kb.json');const parameter_space=await read('data/parameter-space.json');
const articles=[];for(const name of (await fs.readdir(path.join(root,'articles'))).sort())if(name.endsWith('.json'))articles.push(await read('articles/'+name));
const bundle=validateBundle({bundle_version:'1.0',archive_version:'0.4.0',kb,parameter_space,articles,surface_vocabulary:await read('data/surface-vocabulary.json')});
await fs.writeFile(path.join(root,'archive.json'),JSON.stringify(bundle,null,2)+'\n');console.log(`Built archive.json: ${kb.fragments.length} fragments, ${kb.sources.length} sources; no research values recalculated.`);
