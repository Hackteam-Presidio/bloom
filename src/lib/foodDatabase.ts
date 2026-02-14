import { NutrientTotals } from './types';

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  servingSize: string;
  nutrients: NutrientTotals;
}

// Curated food database with pregnancy-relevant nutrients
// Values sourced from USDA FoodData Central
export const foodDatabase: FoodItem[] = [
  // Proteins
  { id: 'f1', name: 'Grilled Chicken Breast', category: 'Protein', servingSize: '100g', nutrients: { folate: 6, iron: 1.1, calcium: 15, protein: 31, dha: 0 } },
  { id: 'f2', name: 'Cooked Salmon', category: 'Protein', servingSize: '100g', nutrients: { folate: 25, iron: 0.8, calcium: 12, protein: 25, dha: 1200 } },
  { id: 'f3', name: 'Hard-Boiled Egg', category: 'Protein', servingSize: '1 large', nutrients: { folate: 22, iron: 0.6, calcium: 25, protein: 6.3, dha: 40 } },
  { id: 'f4', name: 'Cooked Lentils', category: 'Protein', servingSize: '1 cup', nutrients: { folate: 358, iron: 6.6, calcium: 38, protein: 18, dha: 0 } },
  { id: 'f5', name: 'Greek Yogurt', category: 'Protein', servingSize: '1 cup', nutrients: { folate: 18, iron: 0.1, calcium: 230, protein: 20, dha: 0 } },
  { id: 'f6', name: 'Tofu (firm)', category: 'Protein', servingSize: '100g', nutrients: { folate: 15, iron: 5.4, calcium: 350, protein: 8, dha: 0 } },
  { id: 'f7', name: 'Lean Ground Beef', category: 'Protein', servingSize: '100g', nutrients: { folate: 8, iron: 2.6, calcium: 18, protein: 26, dha: 0 } },
  { id: 'f8', name: 'Sardines (canned)', category: 'Protein', servingSize: '100g', nutrients: { folate: 10, iron: 2.9, calcium: 382, protein: 25, dha: 740 } },

  // Vegetables
  { id: 'f9', name: 'Cooked Spinach', category: 'Vegetable', servingSize: '1 cup', nutrients: { folate: 263, iron: 6.4, calcium: 245, protein: 5.3, dha: 0 } },
  { id: 'f10', name: 'Broccoli', category: 'Vegetable', servingSize: '1 cup', nutrients: { folate: 168, iron: 1.0, calcium: 62, protein: 3.7, dha: 0 } },
  { id: 'f11', name: 'Sweet Potato', category: 'Vegetable', servingSize: '1 medium', nutrients: { folate: 6, iron: 0.7, calcium: 38, protein: 2, dha: 0 } },
  { id: 'f12', name: 'Kale (cooked)', category: 'Vegetable', servingSize: '1 cup', nutrients: { folate: 17, iron: 1.2, calcium: 94, protein: 2.5, dha: 0 } },
  { id: 'f13', name: 'Asparagus', category: 'Vegetable', servingSize: '1 cup', nutrients: { folate: 268, iron: 2.9, calcium: 41, protein: 4.3, dha: 0 } },
  { id: 'f14', name: 'Avocado', category: 'Vegetable', servingSize: '1 medium', nutrients: { folate: 163, iron: 1.1, calcium: 24, protein: 4, dha: 0 } },

  // Grains
  { id: 'f15', name: 'Fortified Cereal', category: 'Grain', servingSize: '1 cup', nutrients: { folate: 400, iron: 18, calcium: 100, protein: 3, dha: 0 } },
  { id: 'f16', name: 'Brown Rice', category: 'Grain', servingSize: '1 cup cooked', nutrients: { folate: 8, iron: 0.8, calcium: 20, protein: 5, dha: 0 } },
  { id: 'f17', name: 'Whole Wheat Bread', category: 'Grain', servingSize: '1 slice', nutrients: { folate: 30, iron: 1.0, calcium: 30, protein: 3.6, dha: 0 } },
  { id: 'f18', name: 'Oatmeal', category: 'Grain', servingSize: '1 cup cooked', nutrients: { folate: 14, iron: 2.1, calcium: 21, protein: 5.9, dha: 0 } },

  // Dairy & Calcium
  { id: 'f19', name: 'Whole Milk', category: 'Dairy', servingSize: '1 cup', nutrients: { folate: 12, iron: 0.1, calcium: 276, protein: 8, dha: 0 } },
  { id: 'f20', name: 'Cheddar Cheese', category: 'Dairy', servingSize: '30g', nutrients: { folate: 5, iron: 0.2, calcium: 200, protein: 7, dha: 0 } },
  { id: 'f21', name: 'Cottage Cheese', category: 'Dairy', servingSize: '1 cup', nutrients: { folate: 27, iron: 0.3, calcium: 138, protein: 28, dha: 0 } },

  // Fruits
  { id: 'f22', name: 'Orange', category: 'Fruit', servingSize: '1 medium', nutrients: { folate: 48, iron: 0.1, calcium: 52, protein: 1.2, dha: 0 } },
  { id: 'f23', name: 'Banana', category: 'Fruit', servingSize: '1 medium', nutrients: { folate: 24, iron: 0.3, calcium: 6, protein: 1.3, dha: 0 } },
  { id: 'f24', name: 'Strawberries', category: 'Fruit', servingSize: '1 cup', nutrients: { folate: 40, iron: 0.7, calcium: 27, protein: 1.1, dha: 0 } },
  { id: 'f25', name: 'Mango', category: 'Fruit', servingSize: '1 cup', nutrients: { folate: 71, iron: 0.3, calcium: 18, protein: 1.4, dha: 0 } },

  // Nuts & Seeds
  { id: 'f26', name: 'Almonds', category: 'Nuts & Seeds', servingSize: '30g', nutrients: { folate: 14, iron: 1.1, calcium: 76, protein: 6, dha: 0 } },
  { id: 'f27', name: 'Chia Seeds', category: 'Nuts & Seeds', servingSize: '2 tbsp', nutrients: { folate: 4, iron: 1.2, calcium: 90, protein: 3, dha: 0 } },
  { id: 'f28', name: 'Walnuts', category: 'Nuts & Seeds', servingSize: '30g', nutrients: { folate: 28, iron: 0.8, calcium: 28, protein: 4.3, dha: 50 } },
  { id: 'f29', name: 'Sunflower Seeds', category: 'Nuts & Seeds', servingSize: '30g', nutrients: { folate: 67, iron: 1.8, calcium: 20, protein: 5.5, dha: 0 } },

  // Supplements (common prenatal vitamins as reference)
  { id: 'f30', name: 'Prenatal Vitamin', category: 'Supplement', servingSize: '1 tablet', nutrients: { folate: 800, iron: 27, calcium: 200, protein: 0, dha: 200 } },
];

export function searchFoods(query: string): FoodItem[] {
  const lower = query.toLowerCase().trim();
  if (!lower) return [];
  return foodDatabase.filter(f =>
    f.name.toLowerCase().includes(lower) ||
    f.category.toLowerCase().includes(lower)
  );
}

export function getFoodCategories(): string[] {
  return [...new Set(foodDatabase.map(f => f.category))];
}

export function getFoodsByCategory(category: string): FoodItem[] {
  return foodDatabase.filter(f => f.category === category);
}
