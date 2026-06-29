import type { ReadingResult, HistoryStore } from '../types';

const HISTORY_KEY = 'tarot_results_history';
const MAX_HISTORY = 5;

export function loadHistory(): HistoryStore {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistory(history: HistoryStore): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // Ignore storage errors
  }
}

export function addToHistory(result: ReadingResult): HistoryStore {
  const history = loadHistory();
  const newHistory = [result, ...history].slice(0, MAX_HISTORY);
  saveHistory(newHistory);
  return newHistory;
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}