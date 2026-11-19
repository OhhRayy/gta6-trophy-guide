// Leonida Platinum — filters: kind, grade, search, spoiler and hide-earned.
export const KIND_LABELS = {
  all: 'All 55',
  story: 'Story',
  missable: 'Missable',
  collectible: 'Collectibles',
  activity: 'Activities',
  online: 'Online',
};

export function kindMatches(trophy, kind) {
  if (kind === 'all') return true;
  if (kind === 'missable') return trophy.missable === true;
  if (kind === 'online') return false; // The official list has no online trophies.
  return Array.isArray(trophy.kinds) && trophy.kinds.includes(kind);
}

export function trophyMatches(trophy, filters, earnedSet) {
  if (!kindMatches(trophy, filters.kind)) return false;
  if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
  if (filters.hideEarned && earnedSet.has(trophy.name)) return false;
  if (filters.query) {
    const hay = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
    if (!hay.includes(filters.query.toLowerCase())) return false;
  }
  return true;
}

export function visibleTrophies(trophies, filters, earnedSet) {
  return trophies.filter((t) => trophyMatches(t, filters, earnedSet));
}

// A story trophy the player has not earned yet stays hidden while spoilers are on.
export function spoilerHides(trophy, spoilerOn, earnedSet) {
  return spoilerOn && trophy.kind === 'story' && !earnedSet.has(trophy.name);
}

export function nextUpTrophies(trophies, earnedSet, limit) {
  return trophies
    .filter((t) => !earnedSet.has(t.name))
    .sort((a, b) => a.stage - b.stage || a.difficulty - b.difficulty || a.id - b.id)
    .slice(0, limit);
}
