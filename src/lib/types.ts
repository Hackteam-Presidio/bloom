export const DIETARY_RESTRICTIONS = [
  'Vegetarian',
  'Vegan',
  'Pescatarian',
  'Gluten-Free',
  'Dairy-Free',
  'Halal',
  'Kosher',
  'Low-Sodium',
  'Keto',
] as const;

export const COMMON_ALLERGIES = [
  'Peanuts',
  'Tree Nuts',
  'Shellfish',
  'Fish',
  'Eggs',
  'Milk',
  'Soy',
  'Wheat',
  'Sesame',
] as const;

export type DietaryRestriction = typeof DIETARY_RESTRICTIONS[number];
export type Allergy = typeof COMMON_ALLERGIES[number];

export interface UserProfile {
  gestationalAgeWeeks: number;
  dueDate?: string;
  lastMenstrualDate?: string;
  /** ISO date when the profile was set — used to auto-advance weeks */
  profileSetDate?: string;
  /** The gestational age at the time profileSetDate was recorded */
  gestationalAgeAtSet?: number;
  name?: string;
  dietaryRestrictions?: DietaryRestriction[];
  allergies?: Allergy[];
}

export type Trimester = 1 | 2 | 3;

export interface NutrientTarget {
  name: string;
  key: NutrientKey;
  unit: string;
  target: number;
  colorVar: string;
}

export type NutrientKey = 'folate' | 'iron' | 'calcium' | 'protein' | 'dha' | 'vitaminD' | 'vitaminC' | 'zinc' | 'omega3';

export interface NutrientTotals {
  folate: number;
  iron: number;
  calcium: number;
  protein: number;
  dha: number;
  vitaminD?: number;
  vitaminC?: number;
  zinc?: number;
  omega3?: number;
  caffeine?: number;
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
