// Leonida Platinum — boot: load the trophy data, wire the toolbar, tabs and detail pane.
import { loadSavedProgress, saveProgress, toggleEarned, setCounter, setNote, exportProgressFile, parseImportedProgress, freshProgress } from './store.js';
import { visibleTrophies } from './filters.js';
import { renderHeaderCounts, renderChecklist, renderGuidePane, renderRoadmap, renderMissables, renderPlanner, renderSourcesNote } from './views.js';

const DATA_URL = 'data/trophies.json';
const FALLBACK_SELECTED_ID = 17; // The Shootist: a silver with a PSN count, a full guide and sources.

const progress = loadSavedProgress();
const activeFilters = { kind: 'all', grade: 'all', query: '' };
let selectedId = FALLBACK_SELECTED_ID;
let guideData = null;

const $ = (id) => document.getElementById(id);
const listEl = $('trophyList');
const metaEl = $('listMeta');
const emptyEl = $('emptyNote');
const detailPane = $('detailPane');

function earnedNames() {
  return new Set(progress.earned);
}

function renderAll() {
  if (!guideData) return;
  const earned = earnedNames();
  renderHeaderCounts($('counts'), $('progressFill'), $('progressText'), guideData.trophies, earned);
  const shown = visibleTrophies(guideData.trophies, { ...activeFilters, hideEarned: progress.hideEarned }, earned);
  renderChecklist(listEl, metaEl, emptyEl, shown, checklistContext(earned));
  const selected = guideData.trophies.find((t) => t.id === selectedId) || guideData.trophies[0];
  renderGuidePane(detailPane, selected, guideData, detailContext());
  renderRoadmap($('roadmapList'), $('stageBars'), guideData.roadmap, guideData.trophies, earned);
  renderMissables($('missableList'), guideData.trophies, checklistContext(earned));
  renderPlanner($('plannerList'), $('kindBars'), guideData.trophies, earned, checklistContext(earned));
  $('missableNote').textContent = guideData.missableNote;
  window.__shotReady = true;
}

function checklistContext(earned) {
  return {
    state: progress,
    earnedSet: earned,
    spoilerOn: progress.spoiler,
    selectedId,
    total: guideData.trophies.length,
    kind: activeFilters.kind,
    onToggle: (name) => { toggleEarned(progress, name); renderAll(); },
    onSelect: (id) => { selectedId = id; renderAll(); },
    onCount: (id, value) => { setCounter(progress, id, value); renderAll(); },
  };
}

function detailContext() {
  return {
    state: progress,
    earnedSet: earnedNames(),
    spoilerOn: progress.spoiler,
    onCount: (id, value) => { setCounter(progress, id, value); renderAll(); },
    onNote: (id, text) => { setNote(progress, id, text); },
  };
}

const VIEW_NAMES = ['checklist', 'roadmap', 'missables', 'planner'];

function showView(name) {
  for (const view of VIEW_NAMES) {
    $(`view-${view}`).hidden = view !== name;
    document.querySelector(`.tab[data-view="${view}"]`).classList.toggle('active', view === name);
  }
  if (location.hash !== `#/${name}`) history.replaceState(null, '', `#/${name}`);
}

function viewFromHash() {
  const name = location.hash.replace('#/', '');
  return VIEW_NAMES.includes(name) ? name : 'checklist';
}

async function boot() {
  const response = await fetch(DATA_URL);
  guideData = await response.json();
  renderSourcesNote($('sourcesNote'), guideData.sources);

  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => showView(tab.dataset.view));
  });
  document.querySelectorAll('#kindChips .chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      activeFilters.kind = chip.dataset.kind;
      document.querySelectorAll('#kindChips .chip').forEach((c) => c.classList.toggle('active', c === chip));
      renderAll();
    });
  });
  $('grade').addEventListener('change', (event) => {
    activeFilters.grade = event.target.value;
    renderAll();
  });
  $('search').addEventListener('input', (event) => {
    activeFilters.query = event.target.value.trim();
    renderAll();
  });
  $('spoiler').checked = progress.spoiler;
  $('spoiler').addEventListener('change', (event) => {
    progress.spoiler = event.target.checked;
    saveProgress(progress);
    renderAll();
  });
  $('hideEarned').checked = progress.hideEarned;
  $('hideEarned').addEventListener('change', (event) => {
    progress.hideEarned = event.target.checked;
    saveProgress(progress);
    renderAll();
  });
  $('exportBtn').addEventListener('click', () => exportProgressFile(progress));
  $('importFile').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const next = parseImportedProgress(await file.text());
      Object.assign(progress, next);
      saveProgress(progress);
      $('spoiler').checked = progress.spoiler;
      $('hideEarned').checked = progress.hideEarned;
      renderAll();
    } catch {
      alert('That file is not a Leonida Platinum progress export.');
    }
    event.target.value = '';
  });
  $('resetBtn').addEventListener('click', () => {
    if (!confirm('Reset all earned trophies, counters and notes?')) return;
    Object.assign(progress, freshProgress());
    saveProgress(progress);
    $('spoiler').checked = progress.spoiler;
    $('hideEarned').checked = progress.hideEarned;
    renderAll();
  });
  window.addEventListener('hashchange', () => showView(viewFromHash()));
  showView(viewFromHash());
  renderAll();
}

boot();
