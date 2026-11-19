// Leonida Platinum — saved progress: localStorage, export and import.
//
// One shape, everywhere: { earned: string[], counts: {id: n}, notes: {id: text},
// spoiler: boolean, hideEarned: boolean }. Earned trophies are tracked by name,
// counters and notes by trophy id. A corrupt or foreign value falls back to a
// fresh, empty state instead of breaking the page.
export const STORAGE_KEY = 'leonida-platinum-v1';

export function freshProgress() {
  return { earned: [], counts: {}, notes: {}, spoiler: true, hideEarned: false };
}

export function loadSavedProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshProgress();
    const saved = JSON.parse(raw);
    return {
      earned: Array.isArray(saved.earned) ? saved.earned : [],
      counts: saved.counts && typeof saved.counts === 'object' ? saved.counts : {},
      notes: saved.notes && typeof saved.notes === 'object' ? saved.notes : {},
      spoiler: saved.spoiler !== false,
      hideEarned: saved.hideEarned === true,
    };
  } catch {
    return freshProgress();
  }
}

export function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function toggleEarned(progress, trophyName) {
  const earned = new Set(progress.earned);
  if (earned.has(trophyName)) earned.delete(trophyName);
  else earned.add(trophyName);
  progress.earned = [...earned];
  saveProgress(progress);
  return progress;
}

export function setCounter(progress, trophyId, value) {
  const n = Math.max(0, Math.floor(Number(value) || 0));
  progress.counts[String(trophyId)] = n;
  saveProgress(progress);
  return n;
}

export function setNote(progress, trophyId, text) {
  progress.notes[String(trophyId)] = String(text);
  saveProgress(progress);
}

export function exportProgressFile(progress) {
  const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
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
