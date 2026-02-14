export default function Resources() {
  const safetyGuide = [
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
      <p className="text-sm text-muted-foreground mb-6">CDC-based food safety guidance for pregnancy</p>

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

      {/* Key nutrients explanation */}
      <div className="mb-6">
        <p className="section-label mb-3">Why These Nutrients Matter</p>
        <div className="space-y-2">
          {[
            { name: 'Folate', why: 'Prevents neural tube defects. Critical in first trimester.', source: 'Lentils, spinach, fortified cereals' },
            { name: 'Iron', why: 'Supports increased blood volume and prevents anemia.', source: 'Red meat, spinach, fortified cereals' },
            { name: 'Calcium', why: 'Builds baby\'s bones and teeth.', source: 'Dairy, tofu, sardines, kale' },
            { name: 'Protein', why: 'Supports fetal tissue growth, especially in 2nd and 3rd trimesters.', source: 'Eggs, chicken, Greek yogurt, lentils' },
            { name: 'DHA (Omega-3)', why: 'Supports brain and eye development.', source: 'Salmon, sardines, walnuts, chia seeds' },
          ].map(n => (
            <div key={n.name} className="rounded-lg border border-border px-4 py-3">
              <p className="text-sm font-medium text-foreground">{n.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{n.why}</p>
              <p className="text-xs text-muted-foreground mt-1">Sources: {n.source}</p>
            </div>
          ))}
        </div>
      </div>

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
