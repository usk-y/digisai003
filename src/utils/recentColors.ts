const RECENT_COLORS_KEY = 'signage_recent_colors';
const MAX_RECENT = 8;

export const getRecentColors = (): string[] => {
  try {
    const raw = localStorage.getItem(RECENT_COLORS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addRecentColor = (color: string) => {
  if (!color || typeof color !== 'string' || !color.startsWith('#')) return;
  try {
    const current = getRecentColors();
    const exists = current.some((c) => c.toLowerCase() === color.toLowerCase());
    if (exists) {
      // 既に「最近使った色」に含まれている場合は順番を保持（入れ替えない）
      return;
    }
    const updated = [color, ...current].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('recent_colors_updated'));
  } catch (e) {
    console.error(e);
  }
};
