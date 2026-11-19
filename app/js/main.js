// Leonida Platinum — boot: load the trophy data, wire the toolbar, tabs and detail pane.
import { loadSavedProgress, saveProgress, toggleEarned, setCounter, setNote, exportProgressFile, parseImportedProgress, freshProgress } from './store.js';
import { visibleTrophies } from './filters.js';
import { renderHeaderCounts, renderChecklist, renderGuidePane, renderRoadmap, renderMissables, renderPlanner, renderSourcesNote } from './views.js';

const DATA_URL = 'data/trophies.json';
const DEFAULT_SELECTED_ID = 17; // The Shootist: a silver with a PSN count, a full guide and sources.

const state = loadSavedProgress();
const filters = { kind: 'all', grade: 'all', query: '' };
let selectedId = DEFAULT_SELECTED_ID;
let data = null;

const $ = (id) => document.getElementById(id);
const listEl = $('trophyList');
const metaEl = $('listMeta');
const emptyEl = $('emptyNote');
const detailPane = $('detailPane');

function earnedSet() {
  return new Set(state.earned);
}

function renderAll() {
  if (!data) return;
  const earned = earnedSet();
  renderHeaderCounts($('counts'), $('progressFill'), $('progressText'), data.trophies, earned);
  const shown = visibleTrophies(data.trophies, { ...filters, hideEarned: state.hideEarned }, earned);
  renderChecklist(listEl, metaEl, emptyEl, shown, checklistContext(earned));
  const selected = data.trophies.find((t) => t.id === selectedId) || data.trophies[0];
  renderGuidePane(detailPane, selected, data, detailContext());
  renderRoadmap($('roadmapList'), $('stageBars'), data.roadmap, data.trophies, earned);
  renderMissables($('missableList'), data.trophies, checklistContext(earned));
  renderPlanner($('plannerList'), $('kindBars'), data.trophies, earned, checklistContext(earned));
  $('missableNote').textContent = data.missableNote;
  window.__shotReady = true;
}

function checklistContext(earned) {
  return {
    state,
    earnedSet: earned,
    spoilerOn: state.spoiler,
    selectedId,
    total: data.trophies.length,
    kind: filters.kind,
    onToggle: (name) => { toggleEarned(state, name); renderAll(); },
    onSelect: (id) => { selectedId = id; renderAll(); },
    onCount: (id, value) => { setCounter(state, id, value); renderAll(); },
  };
}

function detailContext() {
  return {
    state,
    earnedSet: earnedSet(),
    spoilerOn: state.spoiler,
    onCount: (id, value) => { setCounter(state, id, value); renderAll(); },
    onNote: (id, text) => { setNote(state, id, text); },
  };
}

function showView(name) {
  for (const view of ['checklist', 'roadmap', 'missables', 'planner']) {
    $(`view-${view}`).hidden = view !== name;
    document.querySelector(`.tab[data-view="${view}"]`).classList.toggle('active', view === name);
  }
  if (location.hash !== `#/${name}`) history.replaceState(null, '', `#/${name}`);
}

function viewFromHash() {
  const name = location.hash.replace('#/', '');
  return ['checklist', 'roadmap', 'missables', 'planner'].includes(name) ? name : 'checklist';
}

async function boot() {
  const response = await fetch(DATA_URL);
  data = await response.json();
  renderSourcesNote($('sourcesNote'), data.sources);

  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => showView(tab.dataset.view));
  });
  document.querySelectorAll('#kindChips .chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      filters.kind = chip.dataset.kind;
      document.querySelectorAll('#kindChips .chip').forEach((c) => c.classList.toggle('active', c === chip));
      renderAll();
    });
  });
  $('grade').addEventListener('change', (event) => {
    filters.grade = event.target.value;
    renderAll();
  });
  $('search').addEventListener('input', (event) => {
    filters.query = event.target.value.trim();
    renderAll();
  });
  $('spoiler').checked = state.spoiler;
  $('spoiler').addEventListener('change', (event) => {
    state.spoiler = event.target.checked;
    saveProgress(state);
    renderAll();
  });
  $('hideEarned').checked = state.hideEarned;
  $('hideEarned').addEventListener('change', (event) => {
    state.hideEarned = event.target.checked;
    saveProgress(state);
    renderAll();
  });
  $('exportBtn').addEventListener('click', () => exportProgressFile(state));
  $('importFile').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const next = parseImportedProgress(await file.text());
      Object.assign(state, next);
      saveProgress(state);
      $('spoiler').checked = state.spoiler;
      $('hideEarned').checked = state.hideEarned;
      renderAll();
    } catch {
      alert('That file is not a Leonida Platinum progress export.');
    }
    event.target.value = '';
  });
  $('resetBtn').addEventListener('click', () => {
    if (!confirm('Reset all earned trophies, counters and notes?')) return;
    Object.assign(state, freshProgress());
    saveProgress(state);
    $('spoiler').checked = state.spoiler;
    $('hideEarned').checked = state.hideEarned;
    renderAll();
  });
  window.addEventListener('hashchange', () => showView(viewFromHash()));
  showView(viewFromHash());
  renderAll();
}

boot();
