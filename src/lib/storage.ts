import { UserProfile, DailyLog, FoodEntry, NutrientTotals } from './types';

const PROFILE_KEY = 'bloom_profile';
const LOGS_KEY = 'bloom_logs';

const emptyTotals: NutrientTotals = { folate: 0, iron: 0, calcium: 0, protein: 0, dha: 0 };

export function getProfile(): UserProfile | null {
  const data = localStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : null;
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

function getAllLogs(): Record<string, DailyLog> {
  const data = localStorage.getItem(LOGS_KEY);
  return data ? JSON.parse(data) : {};
}

function saveAllLogs(logs: Record<string, DailyLog>): void {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

export function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDailyLog(date: string): DailyLog {
  const logs = getAllLogs();
  return logs[date] || { date, entries: [], totals: { ...emptyTotals } };
}

export function addFoodEntry(date: string, entry: FoodEntry): DailyLog {
  const logs = getAllLogs();
  const log = logs[date] || { date, entries: [], totals: { ...emptyTotals } };
  log.entries.push(entry);
  log.totals = recalcTotals(log.entries);
  logs[date] = log;
  saveAllLogs(logs);
  return log;
}

export function removeFoodEntry(date: string, entryId: string): DailyLog {
  const logs = getAllLogs();
  const log = logs[date] || { date, entries: [], totals: { ...emptyTotals } };
  log.entries = log.entries.filter(e => e.id !== entryId);
  log.totals = recalcTotals(log.entries);
  logs[date] = log;
  saveAllLogs(logs);
  return log;
}

export function updateFoodEntry(date: string, entryId: string, updated: Partial<FoodEntry>): DailyLog {
  const logs = getAllLogs();
  const log = logs[date] || { date, entries: [], totals: { ...emptyTotals } };
  log.entries = log.entries.map(e => e.id === entryId ? { ...e, ...updated } : e);
  log.totals = recalcTotals(log.entries);
  logs[date] = log;
  saveAllLogs(logs);
  return log;
}

function recalcTotals(entries: FoodEntry[]): NutrientTotals {
  return entries.reduce(
    (acc, e) => ({
      folate: acc.folate + e.nutrients.folate,
      iron: acc.iron + e.nutrients.iron,
      calcium: acc.calcium + e.nutrients.calcium,
      protein: acc.protein + e.nutrients.protein,
      dha: acc.dha + e.nutrients.dha,
    }),
    { ...emptyTotals }
  );
}

// Check consecutive low days
export function getConsecutiveLowDays(nutrientKey: keyof NutrientTotals, target: number, days: number = 3): number {
  const logs = getAllLogs();
  let count = 0;
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const log = logs[key];
    if (log && log.totals[nutrientKey] < target * 0.5) {
      count++;
    } else {
      break;
    }
  }
  return count;
}
