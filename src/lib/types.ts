export interface UserProfile {
  gestationalAgeWeeks: number;
  dueDate?: string;
  name?: string;
}

export type Trimester = 1 | 2 | 3;

export interface NutrientTarget {
  name: string;
  key: NutrientKey;
  unit: string;
  target: number;
  colorVar: string;
}

export type NutrientKey = 'folate' | 'iron' | 'calcium' | 'protein' | 'dha';

export interface NutrientTotals {
  folate: number;
  iron: number;
  calcium: number;
  protein: number;
  dha: number;
}

export interface FoodEntry {
  id: string;
  name: string;
  servingSize: string;
  nutrients: NutrientTotals;
  timestamp: string;
}

export interface DailyLog {
  date: string;
  entries: FoodEntry[];
  totals: NutrientTotals;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
