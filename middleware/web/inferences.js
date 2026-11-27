import {safeURL} from './core.js';

const element = id => document.getElementById(id);
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => (
  {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]
));
const link = (url, label) => {
  const href = safeURL(url);
  return href ? `<a href="${escape(href)}" target="_blank" rel="noopener noreferrer">${escape(label)}</a>` : '';
};
const pageSize = 25;
const levels = [1, 2, 3];
const filters = {
  process: element('quest-process'),
  anatomy: element('quest-anatomy'),
  evidence: element('quest-evidence'),
  entity: element('quest-entity'),
};
const facets = {
  process: record => record.context?.process,
  anatomy: record => record.context?.compartment,
  evidence: record => record.accuracy?.judgment,
};
const nodes = record => [record.biomiv?.from, record.biomiv?.to].filter(node => node?.id);
const coherence = record => Number.isInteger(record.coherence?.total)
  ? `${record.coherence.total}/3` : 'Unscored';
const voteKey = vote => `${vote.accuracy},${vote.coherence}`;
const scoredVote = vote => levels.includes(vote.accuracy) && levels.includes(vote.coherence);
const votes = record => (record.vocabulary?.node_votes ?? []).filter(scoredVote);
const questKey = record => record.quest_id || record.quest || record.question || record.id;

let records = [];
let entityNames = new Map();
let visibleGroups = [];
let voteFilter = '';
let selectedId = '';
let page = 0;
let loadRevision = 0;

function readLedger(text) {
  const ids = new Set();
  const ledger = [];
  for (const [index, line] of text.split(/\r?\n/).entries()) {
    if (!line.trim()) continue;
    try {
      const record = JSON.parse(line);
      if (typeof record?.id !== 'string' || !record.id.trim() || ids.has(record.id)) {
        throw Error('Each inference needs a unique ID.');
      }
      if (record.vocabulary?.node_votes != null && !Array.isArray(record.vocabulary.node_votes)) {
        throw Error('Node votes must be an array.');
      }
      if (record.accuracy?.references != null && !Array.isArray(record.accuracy.references)) {
        throw Error('Accuracy references must be an array.');
      }
      ids.add(record.id);
      ledger.push({
        ...record,
        searchable: JSON.stringify(record).toLowerCase(),
      });
    } catch (error) {
      throw Error(`Line ${index + 1}: ${error.message}`);
    }
  }
  return ledger.reverse();
}

function populate(select, values, firstLabel) {
  const sorted = [...values].sort(([, a], [, b]) => a.localeCompare(b));
  select.replaceChildren(new Option(firstLabel, ''), ...sorted.map(([value, label]) => new Option(label, value)));
}

function loadLedger(text, label) {
  records = readLedger(text);
  entityNames = new Map(records.flatMap(record => nodes(record).map(node => [node.id, node.label || node.id])));
  for (const [name, getValue] of Object.entries(facets)) {
    const values = new Set(records.map(getValue).filter(Boolean));
    populate(filters[name], [...values].map(value => [value, value]), `All ${name === 'process' ? 'processes' : name}`);
  }
  populate(filters.entity, entityNames, 'Entity from selected quest');
  voteFilter = '';
  selectedId = '';
  page = 0;
  element('quest-search').value = '';
  element('hive-content').hidden = false;
  element('hive-error').hidden = true;
  element('hive-status').textContent = `${records.length.toLocaleString()} ${records.length === 1 ? 'inference' : 'inferences'} · ${label}`;
  render();
}

function scopedVotes(record) {
  const entity = filters.entity.value;
  return votes(record).filter(vote => !entity || vote.id === entity);
}

function groupQuests(visible) {
  const groups = new Map();
  for (const record of visible) {
    const key = questKey(record);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(record);
  }
  return [...groups.values()];
}

function renderMatrix(scope) {
  const counts = new Map();
  let unscored = 0;
  for (const record of scope) {
    const scored = scopedVotes(record);
    if (!scored.length) unscored++;
    for (const vote of scored) {
      const key = voteKey(vote);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  const activeVote = document.activeElement?.dataset.vote;
  element('vote-rows').innerHTML = levels.map(accuracy => {
    const cells = levels.map(level => {
      const key = `${accuracy},${level}`;
      const count = counts.get(key) ?? 0;
      return `<td><button type="button" data-vote="${key}" data-populated="${count > 0}" aria-label="Accuracy ${accuracy}, coherence ${level}: ${count} votes" aria-pressed="${voteFilter === key}">${count}</button></td>`;
    }).join('');
    return `<tr><th scope="row">${accuracy}</th>${cells}</tr>`;
  }).join('');
  if (activeVote) element('vote-rows').querySelector(`[data-vote="${activeVote}"]`)?.focus();
  const unscoredButton = element('vote-unscored');
  unscoredButton.textContent = `Unscored inferences · ${unscored}`;
  unscoredButton.setAttribute('aria-pressed', voteFilter === 'unscored');
  element('vote-clear').hidden = !voteFilter;
}

function renderTable(groups, selected) {
  const pages = Math.max(1, Math.ceil(groups.length / pageSize));
  const rows = groups.slice(page * pageSize, (page + 1) * pageSize);
  element('quest-count').textContent = `${groups.length.toLocaleString()} ${groups.length === 1 ? 'quest' : 'quests'}`;
  element('quest-rows').innerHTML = rows.map(group => {
    const record = group.find(item => item.id === selected?.id) ?? group[0];
    const title = record.quest || record.question || record.id;
    const term = record.vocabulary?.term;
    return `<tr><td><button class="hive-quest" type="button" data-record="${escape(record.id)}" aria-pressed="${record.id === selected?.id}">${escape(title)}</button>
      ${term ? `<small>${escape(term)}</small>` : ''}
      ${group.length > 1 ? `<small>${group.length} inferences</small>` : ''}</td>
      <td>${escape(record.context?.compartment || 'Unspecified')}</td>
      <td>${coherence(record)}</td></tr>`;
  }).join('') || '<tr><td colspan="3">No quests match these filters.</td></tr>';
  element('quest-pagination').hidden = pages === 1;
  element('quest-page').textContent = `Page ${page + 1} of ${pages}`;
  element('quest-prev').disabled = page === 0;
  element('quest-next').disabled = page + 1 === pages;
  const filter = element('vote-filter');
  filter.hidden = !voteFilter;
  const [accuracy, level] = voteFilter.split(',');
  filter.textContent = voteFilter === 'unscored' ? 'Showing unscored inferences' : `Showing node votes at accuracy ${accuracy}, coherence ${level}`;
}

function renderDetail(record, group) {
  const detail = element('quest-detail');
  detail.hidden = !record;
  if (!record) return;
  const {biomiv, vocabulary, accuracy, explanation} = record;
  const edge = biomiv?.edge;
  const source = link(biomiv?.url || explanation?.source_url, 'Live Biomiv lookup');
  const references = (accuracy?.references ?? []).map(reference => {
    const anchor = link(reference.url, reference.role || reference.url);
    return anchor ? `<li>${anchor}${reference.live_verified === false ? ' · Live verification unavailable' : ''}</li>` : '';
  }).join('');
  const nodeVotes = votes(record).map(vote => {
    const matching = voteKey(vote) === voteFilter && (!filters.entity.value || vote.id === filters.entity.value);
    return `<li${matching ? ' class="hive-highlight"' : ''}><strong>${escape(entityNames.get(vote.id) || vote.id)}</strong>
      <span class="hive-meta"> · Accuracy ${vote.accuracy}, coherence ${vote.coherence}</span>
      ${vote.reason ? `<p>${escape(vote.reason)}</p>` : ''}</li>`;
  }).join('');
  detail.innerHTML = `
    <h2 id="selected-title" tabindex="-1">${escape(vocabulary?.term || record.quest || record.id)}</h2>
    ${group.length > 1 ? `<label>Inference <select id="quest-version">${group.map(item =>
      `<option value="${escape(item.id)}"${item === record ? ' selected' : ''}>${escape(item.lookup_date || 'Undated')} · ${escape(item.vocabulary?.term || item.id)}</option>`
    ).join('')}</select></label>` : ''}
    ${record.question ? `<p class="hive-meta">Original question · ${escape(record.question)}</p>` : ''}
    ${vocabulary?.equation ? `<p class="hive-equation">${escape(vocabulary.equation)}</p>` : ''}
    ${explanation?.text ? `<p>${escape(explanation.text)}</p>` : ''}
    ${vocabulary?.scope ? `<p class="hive-meta">${escape(vocabulary.scope)}</p>` : ''}
    <dl class="hive-evidence">
      <dt>Biomiv evidence</dt>
      <dd>${edge ? `${escape(biomiv.from?.label || edge.from)} ${escape(edge.says || edge.relation)} ${escape(biomiv.to?.label || edge.to)}<small>${escape([edge.source, edge.ref].filter(Boolean).join(' · '))}</small>`
        : escape(biomiv?.status ? `Lookup status: ${biomiv.status}` : 'No lookup recorded')}</dd>
      <dt>Quest context</dt>
      <dd>${escape([record.context?.species, record.context?.compartment, record.context?.process].filter(Boolean).join(' · ') || 'Unspecified')}</dd>
      <dt>Accuracy</dt>
      <dd>${escape(accuracy?.judgment || 'Unscored')}${accuracy?.reason ? `<small>${escape(accuracy.reason)}</small>` : ''}</dd>
      <dt>Pair coherence</dt>
      <dd>${coherence(record)}${record.coherence?.reason ? `<small>${escape(record.coherence.reason)}</small>` : ''}</dd>
    </dl>
    ${nodeVotes ? `<h3>Node votes and reasons</h3><ul class="hive-reasons">${nodeVotes}</ul>` : ''}
    ${source || references ? `<h3>Sources</h3><ul class="hive-reasons">${source ? `<li>${source}</li>` : ''}${references}</ul>` : ''}
    ${biomiv ? `<details><summary>Recorded Biomiv JSON</summary><pre>${escape(JSON.stringify(biomiv, null, 2))}</pre></details>` : ''}`;
}

function renderNetwork(visible, selected) {
  const focus = filters.entity.value || nodes(selected ?? {})[0]?.id;
  const container = element('network-edges');
  if (!focus) {
    container.innerHTML = '<p class="hive-meta">Choose an entity to see its connections.</p>';
    return;
  }
  const focusName = entityNames.get(focus) || focus;
  const edges = visible.filter(record => record.biomiv?.edge && nodes(record).some(node => node.id === focus));
  container.innerHTML = `<p class="hive-hub">${escape(focusName)}</p>
    <p class="hive-meta">${edges.length.toLocaleString()} ${edges.length === 1 ? 'connection' : 'connections'} in this view</p>
    <ul class="hive-edges">${edges.map(record => {
      const {edge, from, to} = record.biomiv;
      return `<li><button type="button" data-record="${escape(record.id)}">
        <span>${escape(from?.label || edge.from)}</span>
        <span class="hive-edge-relation">${escape(edge.says || edge.relation)} →</span>
        <span>${escape(to?.label || edge.to)}</span>
        <small>${escape([edge.source, edge.ref].filter(Boolean).join(' · '))}</small>
      </button></li>`;
    }).join('')}</ul>`;
}

function render() {
  const terms = element('quest-search').value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const scope = records.filter(record =>
    terms.every(term => record.searchable.includes(term)) &&
    Object.entries(facets).every(([name, getValue]) => !filters[name].value || getValue(record) === filters[name].value) &&
    (!filters.entity.value || nodes(record).some(node => node.id === filters.entity.value))
  );
  const visible = scope.filter(record => {
    if (!voteFilter) return true;
    const scored = scopedVotes(record);
    return voteFilter === 'unscored' ? !scored.length : scored.some(vote => voteKey(vote) === voteFilter);
  });
  const groups = groupQuests(visible);
  visibleGroups = groups;
  page = Math.min(page, Math.max(0, Math.ceil(groups.length / pageSize) - 1));
  const pageGroups = groups.slice(page * pageSize, (page + 1) * pageSize);
  const group = pageGroups.find(items => items.some(record => record.id === selectedId)) ?? pageGroups[0];
  const selected = group?.find(record => record.id === selectedId) ?? group?.[0];
  selectedId = selected?.id ?? '';
  renderMatrix(scope);
  renderTable(groups, selected);
  renderDetail(selected, group);
  renderNetwork(visible, selected);
}

function selectRecord(id) {
  const index = visibleGroups.findIndex(group => group.some(record => record.id === id));
  if (index < 0) return;
  page = Math.floor(index / pageSize);
  selectedId = id;
  render();
  element('selected-title')?.focus();
}

function resetPage() {
  page = 0;
  render();
}

element('quest-search').addEventListener('input', resetPage);
Object.values(filters).forEach(select => select.addEventListener('change', resetPage));
element('quest-prev').addEventListener('click', () => { page--; render(); });
element('quest-next').addEventListener('click', () => { page++; render(); });
element('quest-detail').addEventListener('change', event => {
  if (event.target.id === 'quest-version') selectRecord(event.target.value);
});
for (const id of ['quest-rows', 'network-edges']) {
  element(id).addEventListener('click', event => {
    const record = event.target.closest('[data-record]');
    if (record) selectRecord(record.dataset.record);
  });
}

function setVote(value) {
  voteFilter = voteFilter === value ? '' : value;
  resetPage();
}

element('vote-rows').addEventListener('click', event => {
  const cell = event.target.closest('[data-vote]');
  if (cell) setVote(cell.dataset.vote);
});
element('vote-unscored').addEventListener('click', () => setVote('unscored'));
element('vote-clear').addEventListener('click', () => {
  setVote('');
  element('vote-unscored').focus();
});

function showError(message) {
  element('hive-error').textContent = message;
  element('hive-error').hidden = false;
  if (element('hive-content').hidden) element('hive-status').textContent = '';
}

element('ledger-file').addEventListener('change', async event => {
  const file = event.target.files[0];
  if (!file) return;
  const revision = ++loadRevision;
  event.target.value = '';
  try {
    const text = await file.text();
    if (revision === loadRevision) loadLedger(text, file.name);
  } catch (error) {
    if (revision === loadRevision) showError(error.message);
  }
});

try {
  const revision = loadRevision;
  const response = await fetch('./inferences.jsonl');
  if (!response.ok) throw Error('The bundled vocabulary is unavailable. Open an inferences.jsonl file to browse it.');
  const text = await response.text();
  if (revision === loadRevision) loadLedger(text, 'Hive vocabulary');
} catch (error) {
  if (loadRevision === 0) showError(error.message);
}
