// Leonida Platinum — views: checklist, guide pane, roadmap, missables, planner.
//
// Every view is built with DOM calls, never innerHTML, so a trophy name or a
// saved note can never break the page. A row's context (`ctx`) carries the
// saved state, the earned set, the spoiler flag and the callbacks that change
// state and re-render.
import { spoilerHides } from './filters.js';

export function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function gradeTag(grade) {
  return el('span', `tag grade-${grade}`, gradeLabel(grade));
}

// What each source is cited for, beside a trophy's guide: the official lists
// carry the name, description, grade and PSN count; PowerPyx carries the
// method; KeenGamer backs the one missable trophy; HowToVideoGame carries the
// hidden split.
function sourceNoteFor(key) {
  if (key === 'powerpyx') return 'method and roadmap.';
  if (key === 'keengamer') return 'missable check and save advice.';
  if (key === 'howtovideogame') return 'hidden split (27 visible / 28 hidden).';
  return 'name, description, grade and PSN count.';
}

export function renderHeaderCounts(countsEl, fillEl, textEl, trophies, earnedSet) {
  const total = trophies.length;
  const earned = earnedSet.size;
  const byGrade = {};
  for (const t of trophies) {
    byGrade[t.grade] = byGrade[t.grade] || { total: 0, earned: 0 };
    byGrade[t.grade].total += 1;
    if (earnedSet.has(t.name)) byGrade[t.grade].earned += 1;
  }
  countsEl.replaceChildren();
  for (const grade of ['platinum', 'gold', 'silver', 'bronze']) {
    const chip = el('span', 'count-chip');
    const b = el('b', null, `${byGrade[grade].earned}/${byGrade[grade].total}`);
    chip.append(b, document.createTextNode(` ${gradeLabel(grade)}`));
    countsEl.append(chip);
  }
  const missableTotal = trophies.filter((t) => t.missable).length;
  const missableEarned = trophies.filter((t) => t.missable && earnedSet.has(t.name)).length;
  const missChip = el('span', 'count-chip');
  const mb = el('b', null, `${missableEarned}/${missableTotal}`);
  missChip.append(mb, document.createTextNode(' missable watched'));
  countsEl.append(missChip);
  const hiddenTotal = trophies.filter((t) => t.hidden).length;
  const hiddenEarned = trophies.filter((t) => t.hidden && earnedSet.has(t.name)).length;
  const hidChip = el('span', 'count-chip');
  const hb = el('b', null, `${hiddenEarned}/${hiddenTotal}`);
  hidChip.append(hb, document.createTextNode(' hidden on PSN'));
  countsEl.append(hidChip);
  fillEl.style.width = `${total ? Math.round((earned / total) * 100) : 0}%`;
  textEl.textContent = `${earned} of ${total} earned — ${total ? Math.round((earned / total) * 100) : 0}% to platinum`;
}

function appendKindTags(tagsEl, trophy) {
  if (trophy.kind === 'story') tagsEl.append(el('span', 'tag', 'Story'));
  if (trophy.kind === 'collectible') tagsEl.append(el('span', 'tag', 'Collectible'));
  if (trophy.kind === 'activity') tagsEl.append(el('span', 'tag', 'Activity'));
  if (trophy.kind === 'stranger') tagsEl.append(el('span', 'tag', 'Stranger'));
  if (trophy.kind === 'money') tagsEl.append(el('span', 'tag', 'Money'));
}

function trophyRow(trophy, ctx) {
  const { earnedSet, spoilerOn, selectedId, onToggle, onSelect } = ctx;
  const li = el('li', 'trophy-item');
  if (earnedSet.has(trophy.name)) li.classList.add('earned');
  if (selectedId === trophy.id) li.classList.add('selected');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earnedSet.has(trophy.name);
  box.setAttribute('aria-label', `Mark ${trophy.name} earned`);
  box.addEventListener('click', (event) => event.stopPropagation());
  box.addEventListener('change', () => onToggle(trophy.name));
  const body = el('div');
  const hidden = spoilerHides(trophy, spoilerOn, earnedSet);
  if (hidden) {
    body.append(el('div', 'trophy-name', 'Hidden story trophy'));
    body.append(el('div', 'trophy-desc spoiler-mask', 'Spoiler-free mode hides this story trophy until you earn it. Tick it off to reveal it.'));
  } else {
    body.append(el('div', 'trophy-name', trophy.name));
    body.append(el('div', 'trophy-desc', trophy.description));
  }
  const tags = el('div', 'trophy-tags');
  tags.append(gradeTag(trophy.grade));
  if (trophy.missable) tags.append(el('span', 'tag missable', 'Missable — do it in Chapter 1'));
  if (trophy.hidden) tags.append(el('span', 'tag hidden', 'Hidden'));
  appendKindTags(tags, trophy);
  if (trophy.target) tags.append(el('span', 'tag', `PSN target: ${trophy.target.toLocaleString('en-US')} ${trophy.targetLabel || ''}`.trim()));
  body.append(tags);
  const side = el('div');
  if (trophy.target) {
    const count = ctx.state.counts[String(trophy.id)] || 0;
    const line = el('div', 'counter-line');
    line.append(document.createTextNode(`${count.toLocaleString('en-US')} / ${trophy.target.toLocaleString('en-US')} `));
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.max = String(trophy.target);
    input.value = String(count);
    input.setAttribute('aria-label', `Progress toward ${trophy.name}`);
    input.addEventListener('click', (event) => event.stopPropagation());
    input.addEventListener('change', () => ctx.onCount(trophy.id, input.value));
    line.append(input);
    side.append(line);
  }
  side.append(el('div', 'counter-line', `Stage ${trophy.stage} · Difficulty ${trophy.difficulty}/5 · ${trophy.time}`));
  li.append(box, body, side);
  li.addEventListener('click', () => onSelect(trophy.id));
  return li;
}

export function renderChecklist(listEl, metaEl, emptyEl, shown, ctx) {
  listEl.replaceChildren();
  for (const t of shown) listEl.append(trophyRow(t, ctx));
  const earnedShown = shown.filter((t) => ctx.earnedSet.has(t.name)).length;
  metaEl.textContent = `Showing ${shown.length} of ${ctx.total} trophies — ${earnedShown} earned in this view. Click a trophy to open its guide.`;
  if (shown.length === 0) {
    emptyEl.hidden = false;
    emptyEl.textContent = ctx.kind === 'online'
      ? 'No online trophies: the official list of 55 has no trophy that needs online play, so this filter is empty by design.'
      : 'No trophies match these filters. Clear the search or pick another kind or grade.';
  } else {
    emptyEl.hidden = true;
  }
}

export function renderGuidePane(pane, trophy, data, ctx) {
  const { earnedSet, spoilerOn, state } = ctx;
  pane.replaceChildren();
  if (!trophy) {
    pane.append(el('h2', null, 'Pick a trophy'));
    pane.append(el('p', null, 'Click any trophy in the list to open its guide, steps, difficulty, sources and your own notes.'));
    return;
  }
  const hidden = spoilerHides(trophy, spoilerOn, earnedSet);
  pane.append(el('h2', null, hidden ? 'Hidden story trophy' : trophy.name));
  const grades = el('div', 'detail-grade');
  grades.append(gradeTag(trophy.grade));
  if (trophy.missable) grades.append(el('span', 'tag missable', 'Missable — do it in Chapter 1'));
  if (trophy.hidden) grades.append(el('span', 'tag hidden', 'Hidden on PSN'));
  grades.append(el('span', 'tag', `Roadmap stage ${trophy.stage}`));
  pane.append(grades);
  pane.append(el('p', 'detail-desc', hidden ? 'Spoiler-free mode hides this story trophy until you earn it.' : trophy.description));
  pane.append(el('h3', null, 'Guide'));
  pane.append(el('p', null, hidden ? 'Earn this story trophy to reveal its guide.' : trophy.guide));
  if (!hidden) {
    pane.append(el('h3', null, 'Steps'));
    const steps = el('ol', 'detail-steps');
    for (const step of trophy.steps) steps.append(el('li', null, step));
    pane.append(steps);
    pane.append(el('h3', null, 'Sources'));
    const list = el('ul', 'source-list');
    for (const key of trophy.sources || []) {
      const src = data.sources[key];
      if (!src) continue;
      const item = el('li');
      const link = document.createElement('a');
      link.href = src.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = src.name;
      item.append(link, document.createTextNode(` — ${sourceNoteFor(key)}`));
      list.append(item);
    }
    const own = el('li');
    own.textContent = 'Guide text: written in our own words from the sources above — a source is cited, never copied.';
    list.append(own);
    pane.append(list);
    pane.append(el('p', 'detail-meta', `Difficulty ${trophy.difficulty}/5 · ${trophy.time} · Difficulty and time are our estimates unless a source is named.`));
    if (trophy.target) {
      const box = el('div', 'counter-box');
      box.append(document.createTextNode(`Your progress: `));
      const input = document.createElement('input');
      input.type = 'number';
      input.min = '0';
      input.max = String(trophy.target);
      input.value = String(state.counts[String(trophy.id)] || 0);
      input.setAttribute('aria-label', `Progress toward ${trophy.name}`);
      input.addEventListener('change', () => ctx.onCount(trophy.id, input.value));
      box.append(input, document.createTextNode(` / ${trophy.target.toLocaleString('en-US')} ${trophy.targetLabel || ''}`.trim()));
      pane.append(box);
    }
    pane.append(el('h3', null, 'Your notes'));
    const notes = document.createElement('textarea');
    notes.className = 'note-box';
    notes.placeholder = 'Where did you find it? What worked?';
    notes.value = state.notes[String(trophy.id)] || '';
    notes.addEventListener('change', () => ctx.onNote(trophy.id, notes.value));
    pane.append(notes);
  }
}

function progressBarRow(label, earned, total) {
  const row = el('div', 'stage-bar-row');
  row.append(el('span', null, label));
  const bar = el('div', 'stage-bar');
  const fill = el('div');
  fill.style.width = `${total ? Math.round((earned / total) * 100) : 0}%`;
  bar.append(fill);
  row.append(bar);
  row.append(el('span', null, `${earned}/${total}`));
  return row;
}

export function renderRoadmap(listEl, barsEl, roadmap, trophies, earnedSet) {
  listEl.replaceChildren();
  for (const stage of roadmap) {
    const members = trophies.filter((t) => t.stage === stage.stage);
    const earned = members.filter((t) => earnedSet.has(t.name)).length;
    const li = el('li');
    li.append(el('h3', null, stage.title));
    li.append(el('p', null, stage.body));
    li.append(el('p', 'stage-count', `${earned}/${members.length} earned in this stage`));
    listEl.append(li);
  }
  barsEl.replaceChildren();
  for (const stage of roadmap) {
    const members = trophies.filter((t) => t.stage === stage.stage);
    const earned = members.filter((t) => earnedSet.has(t.name)).length;
    barsEl.append(progressBarRow(stage.title, earned, members.length));
  }
}

export function renderMissables(listEl, trophies, ctx) {
  listEl.replaceChildren();
  const missable = trophies.filter((t) => t.missable);
  for (const t of missable) listEl.append(trophyRow(t, ctx));
}

export function renderPlanner(listEl, barsEl, trophies, earnedSet, ctx) {
  listEl.replaceChildren();
  // Spoiler-free mode hides story trophies everywhere, planner included:
  // skip the hidden ones so the list shows real next steps, not masked rows.
  const next = trophies
    .filter((t) => !earnedSet.has(t.name))
    .filter((t) => !spoilerHides(t, ctx.spoilerOn, earnedSet))
    .sort((a, b) => a.stage - b.stage || a.difficulty - b.difficulty || a.id - b.id)
    .slice(0, 8);
  for (const t of next) listEl.append(trophyRow(t, ctx));
  barsEl.replaceChildren();
  const kinds = [
    ['Story', (t) => t.kind === 'story'],
    ['Strangers', (t) => t.kind === 'stranger'],
    ['Activities', (t) => t.kind === 'activity'],
    ['Collectibles', (t) => t.kind === 'collectible'],
    ['Challenges', (t) => t.kind === 'challenge'],
    ['Money', (t) => t.kind === 'money'],
  ];
  for (const [label, test] of kinds) {
    const members = trophies.filter(test);
    const earned = members.filter((t) => earnedSet.has(t.name)).length;
    barsEl.append(progressBarRow(label, earned, members.length));
  }
}

export function renderSourcesNote(noteEl, sources) {
  noteEl.replaceChildren();
  noteEl.append(document.createTextNode('Sources for every name, description, grade and PSN count: '));
  const keys = Object.keys(sources);
  keys.forEach((key, i) => {
    const link = document.createElement('a');
    link.href = sources[key].url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = sources[key].name;
    noteEl.append(link);
    if (i < keys.length - 1) noteEl.append(document.createTextNode(', '));
  });
  noteEl.append(document.createTextNode(' (names, descriptions and grades checked 20 November 2026; methods from PowerPyx, missable check from KeenGamer, hidden split from HowToVideoGame).'));
}
