import { Trimester, NutrientTarget } from './types';

// NIH ODS & CDC pregnancy DRIs for women 19-50y
// Sources:
// - NIH Office of Dietary Supplements, Pregnancy fact sheet
// - CDC Dietary Guidelines for Americans, 2020-2025

export function getTrimester(weeks: number): Trimester {
  if (weeks <= 13) return 1;
  if (weeks <= 26) return 2;
  return 3;
}

export function getTrimesterLabel(trimester: Trimester): string {
  const labels: Record<Trimester, string> = {
    1: 'First Trimester',
    2: 'Second Trimester',
    3: 'Third Trimester',
  };
  return labels[trimester];
}

export function getWeekRange(trimester: Trimester): string {
  const ranges: Record<Trimester, string> = {
    1: 'Weeks 1 – 13',
    2: 'Weeks 14 – 26',
    3: 'Weeks 27 – 40',
  };
  return ranges[trimester];
}

// Recommended daily amounts by trimester
const recommendations: Record<Trimester, NutrientTarget[]> = {
  1: [
    { name: 'Folate', key: 'folate', unit: 'mcg', target: 600, colorVar: '--nutrient-folate' },
    { name: 'Iron', key: 'iron', unit: 'mg', target: 27, colorVar: '--nutrient-iron' },
    { name: 'Calcium', key: 'calcium', unit: 'mg', target: 1000, colorVar: '--nutrient-calcium' },
    { name: 'Protein', key: 'protein', unit: 'g', target: 71, colorVar: '--nutrient-protein' },
    { name: 'DHA', key: 'dha', unit: 'mg', target: 200, colorVar: '--nutrient-dha' },
    { name: 'Vitamin D', key: 'vitaminD', unit: 'mcg', target: 15, colorVar: '--nutrient-vitaminD' },
    { name: 'Vitamin C', key: 'vitaminC', unit: 'mg', target: 85, colorVar: '--nutrient-vitaminC' },
    { name: 'Zinc', key: 'zinc', unit: 'mg', target: 11, colorVar: '--nutrient-zinc' },
    { name: 'Omega-3', key: 'omega3', unit: 'mg', target: 650, colorVar: '--nutrient-omega3' },
  ],
  2: [
    { name: 'Folate', key: 'folate', unit: 'mcg', target: 600, colorVar: '--nutrient-folate' },
    { name: 'Iron', key: 'iron', unit: 'mg', target: 27, colorVar: '--nutrient-iron' },
    { name: 'Calcium', key: 'calcium', unit: 'mg', target: 1000, colorVar: '--nutrient-calcium' },
    { name: 'Protein', key: 'protein', unit: 'g', target: 71, colorVar: '--nutrient-protein' },
    { name: 'DHA', key: 'dha', unit: 'mg', target: 300, colorVar: '--nutrient-dha' },
    { name: 'Vitamin D', key: 'vitaminD', unit: 'mcg', target: 15, colorVar: '--nutrient-vitaminD' },
    { name: 'Vitamin C', key: 'vitaminC', unit: 'mg', target: 85, colorVar: '--nutrient-vitaminC' },
    { name: 'Zinc', key: 'zinc', unit: 'mg', target: 11, colorVar: '--nutrient-zinc' },
    { name: 'Omega-3', key: 'omega3', unit: 'mg', target: 650, colorVar: '--nutrient-omega3' },
  ],
  3: [
    { name: 'Folate', key: 'folate', unit: 'mcg', target: 600, colorVar: '--nutrient-folate' },
    { name: 'Iron', key: 'iron', unit: 'mg', target: 27, colorVar: '--nutrient-iron' },
    { name: 'Calcium', key: 'calcium', unit: 'mg', target: 1000, colorVar: '--nutrient-calcium' },
    { name: 'Protein', key: 'protein', unit: 'g', target: 71, colorVar: '--nutrient-protein' },
    { name: 'DHA', key: 'dha', unit: 'mg', target: 300, colorVar: '--nutrient-dha' },
    { name: 'Vitamin D', key: 'vitaminD', unit: 'mcg', target: 15, colorVar: '--nutrient-vitaminD' },
    { name: 'Vitamin C', key: 'vitaminC', unit: 'mg', target: 85, colorVar: '--nutrient-vitaminC' },
    { name: 'Zinc', key: 'zinc', unit: 'mg', target: 11, colorVar: '--nutrient-zinc' },
    { name: 'Omega-3', key: 'omega3', unit: 'mg', target: 650, colorVar: '--nutrient-omega3' },
  ],
};

export function getRecommendations(trimester: Trimester): NutrientTarget[] {
  return recommendations[trimester];
}
