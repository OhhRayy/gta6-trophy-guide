// Leonida Platinum — saved progress: localStorage, export and import.
export const STORAGE_KEY = 'leonida-platinum-v1';

export function loadSavedProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshProgress();
    const parsed = JSON.parse(raw);
    return {
      earned: Array.isArray(parsed.earned) ? parsed.earned : [],
      counts: parsed.counts && typeof parsed.counts === 'object' ? parsed.counts : {},
      notes: parsed.notes && typeof parsed.notes === 'object' ? parsed.notes : {},
      spoiler: parsed.spoiler !== false,
      hideEarned: parsed.hideEarned === true,
    };
  } catch {
    return freshProgress();
  }
}

export function freshProgress() {
  return { earned: [], counts: {}, notes: {}, spoiler: true, hideEarned: false };
}

export function saveProgress(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function toggleEarned(state, trophyName) {
  const earned = new Set(state.earned);
  if (earned.has(trophyName)) earned.delete(trophyName);
  else earned.add(trophyName);
  state.earned = [...earned];
  saveProgress(state);
  return state;
}

export function setCounter(state, trophyId, value) {
  const n = Math.max(0, Math.floor(Number(value) || 0));
  state.counts[String(trophyId)] = n;
  saveProgress(state);
  return n;
}

export function setNote(state, trophyId, text) {
  state.notes[String(trophyId)] = String(text);
  saveProgress(state);
}

export function exportProgressFile(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'leonida-platinum-progress.json';
  link.click();
  URL.revokeObjectURL(url);
}

export function parseImportedProgress(text) {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object') throw new Error('not an object');
  const next = freshProgress();
  if (Array.isArray(parsed.earned)) next.earned = parsed.earned.filter((n) => typeof n === 'string');
  if (parsed.counts && typeof parsed.counts === 'object') next.counts = parsed.counts;
  if (parsed.notes && typeof parsed.notes === 'object') next.notes = parsed.notes;
  if (typeof parsed.spoiler === 'boolean') next.spoiler = parsed.spoiler;
  if (typeof parsed.hideEarned === 'boolean') next.hideEarned = parsed.hideEarned;
  return next;
}
