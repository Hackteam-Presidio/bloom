import { getProfile, getDailyLog, getTodayKey } from '@/lib/storage';
import { getTrimester, getRecommendations } from '@/lib/recommendations';
import type { NutrientKey } from '@/lib/types';

const nutrientDescriptions: Record<NutrientKey, { why: string; source: string }> = {
  folate: { why: 'Prevents neural tube defects. Critical in first trimester for spinal cord and brain formation.', source: 'Lentils, spinach, asparagus, fortified cereals' },
  iron: { why: 'Supports increased blood volume (up to 50% more) and prevents iron-deficiency anemia.', source: 'Red meat, spinach, lentils, fortified cereals' },
  calcium: { why: "Builds baby's bones and teeth. If intake is low, your body pulls calcium from your own bones.", source: 'Dairy, tofu, sardines, kale' },
  protein: { why: 'Supports fetal tissue growth including the brain, especially in 2nd and 3rd trimesters.', source: 'Eggs, chicken, Greek yogurt, lentils' },
  dha: { why: 'Essential omega-3 for brain and retinal development. Needs increase as pregnancy progresses.', source: 'Salmon, sardines, walnuts, chia seeds' },
  vitaminD: { why: 'Aids calcium absorption and supports immune function. Deficiency linked to preeclampsia risk.', source: 'Salmon, fortified milk, eggs, sunlight exposure' },
  vitaminC: { why: 'Boosts iron absorption and supports collagen formation for skin, cartilage, and blood vessels.', source: 'Oranges, strawberries, broccoli, bell peppers' },
  zinc: { why: 'Supports cell division and immune function. Critical for rapid fetal growth.', source: 'Lean beef, pumpkin seeds, lentils, yogurt' },
  omega3: { why: 'Reduces inflammation and supports cardiovascular health for both mother and baby.', source: 'Salmon, chia seeds, walnuts, sardines' },
};

export default function Resources() {
  const profile = getProfile();
  const trimester = profile ? getTrimester(profile.gestationalAgeWeeks) : 1;
  const targets = getRecommendations(trimester);
  const log = getDailyLog(getTodayKey());

  const colorMap: Record<NutrientKey, string> = {
    folate: 'hsl(var(--nutrient-folate))',
    iron: 'hsl(var(--nutrient-iron))',
    calcium: 'hsl(var(--nutrient-calcium))',
    protein: 'hsl(var(--nutrient-protein))',
    dha: 'hsl(var(--nutrient-dha))',
    vitaminD: 'hsl(var(--nutrient-vitaminD))',
    vitaminC: 'hsl(var(--nutrient-vitaminC))',
    zinc: 'hsl(var(--nutrient-zinc))',
    omega3: 'hsl(var(--nutrient-omega3))',
  };

  const safetyGuide = [
    // ... keep existing code
    {
      title: 'Foods to Avoid',
      items: [
        { food: 'Raw fish & sushi', reason: 'Risk of listeria and parasites', alt: 'Cooked fish, shrimp, or salmon' },
        { food: 'Raw or undercooked eggs', reason: 'Risk of salmonella', alt: 'Fully cooked eggs' },
        { food: 'Unpasteurized dairy', reason: 'Risk of listeria', alt: 'Pasteurized milk and cheese' },
        { food: 'Deli meats (cold)', reason: 'Risk of listeria', alt: 'Heated deli meats (steaming hot)' },
        { food: 'High-mercury fish', reason: 'Mercury affects fetal brain development', alt: 'Salmon, sardines, tilapia' },
        { food: 'Raw sprouts', reason: 'Risk of E. coli and salmonella', alt: 'Cooked sprouts' },
      ],
    },
    {
      title: 'Beverages to Limit',
      items: [
        { food: 'Caffeine', reason: 'Limit to 200mg/day (about 1 cup coffee)', alt: 'Decaf, herbal tea (check safety)' },
        { food: 'Alcohol', reason: 'No safe amount during pregnancy', alt: 'Sparkling water, mocktails' },
        { food: 'Herbal teas (some)', reason: 'Some herbs may trigger contractions', alt: 'Ginger tea, peppermint tea (safe in moderation)' },
      ],
    },
  ];

  return (
    <div className="px-5 py-6 max-w-lg mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground mb-1">Resources</h1>
      <p className="text-sm text-muted-foreground mb-6">Your nutrient goals and food safety guidance</p>

      {/* Nutrient Goals */}
      <div className="mb-8">
        <p className="section-label mb-3">Your Daily Nutrient Goals</p>
        <p className="text-xs text-muted-foreground mb-4">
          Targets for {profile ? `week ${profile.gestationalAgeWeeks}` : 'your pregnancy'} based on NIH and CDC recommendations.
        </p>
        <div className="space-y-2">
          {targets.map(t => {
            const desc = nutrientDescriptions[t.key];
            const current = (log?.totals?.[t.key] ?? 0) as number;
            const pct = Math.min(Math.round((current / t.target) * 100), 100);
            return (
              <div key={t.key} className="rounded-lg border border-border px-4 py-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <span className="text-xs font-serif text-muted-foreground">
                    <span style={{ color: colorMap[t.key] }}>{current.toFixed(t.key === 'protein' ? 0 : 1)}</span>
                    {' / '}{t.target}{t.unit}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: colorMap[t.key] }}
                  />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc.why}</p>
                <p className="text-xs text-muted-foreground mt-1.5">
                  <span className="font-medium text-foreground/70">Best sources:</span> {desc.source}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {safetyGuide.map(section => (
        <div key={section.title} className="mb-6">
          <p className="section-label mb-3">{section.title}</p>
          <div className="space-y-2">
            {section.items.map(item => (
              <div key={item.food} className="rounded-lg border border-border px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.food}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.reason}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <p className="text-xs text-primary">Try instead: {item.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}


      {/* Sources */}
      <div className="border-t border-border pt-4">
        <p className="section-label mb-2">Sources & Attribution</p>
        <div className="space-y-1">
          <a href="https://ods.od.nih.gov/factsheets/list-all/" target="_blank" rel="noopener noreferrer" className="block text-xs text-primary hover:underline">
            NIH Office of Dietary Supplements
          </a>
          <a href="https://www.cdc.gov/food-safety/foods-linked-to-illness/people-at-risk-pregnant-women.html" target="_blank" rel="noopener noreferrer" className="block text-xs text-primary hover:underline">
            CDC Safer Food Choices for Pregnant Women
          </a>
        </div>
        <p className="disclaimer-text mt-3">
          For informational use only. This app is not a substitute for medical advice.
        </p>
      </div>
    </div>
  );
}
