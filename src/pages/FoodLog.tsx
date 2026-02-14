import { useState, useEffect } from 'react';
import { searchFoods, getFoodCategories, getFoodsByCategory, FoodItem } from '@/lib/foodDatabase';
import { addFoodEntry, getTodayKey, getProfile } from '@/lib/storage';
import { useNavigate } from 'react-router-dom';
import { NutrientTotals } from '@/lib/types';

export default function FoodLog() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualServing, setManualServing] = useState('');
  const [manualNutrients, setManualNutrients] = useState<NutrientTotals>({ folate: 0, iron: 0, calcium: 0, protein: 0, dha: 0 });
  const [addedMessage, setAddedMessage] = useState('');
  const navigate = useNavigate();
  const categories = getFoodCategories();

  useEffect(() => {
    if (!getProfile()) navigate('/onboarding');
  }, [navigate]);

  useEffect(() => {
    if (query.trim()) {
      setResults(searchFoods(query));
      setSelectedCategory(null);
    } else if (selectedCategory) {
      setResults(getFoodsByCategory(selectedCategory));
    } else {
      setResults([]);
    }
  }, [query, selectedCategory]);

  const handleAdd = (food: FoodItem) => {
    addFoodEntry(getTodayKey(), {
      id: crypto.randomUUID(),
      name: food.name,
      servingSize: food.servingSize,
      nutrients: { ...food.nutrients },
      timestamp: new Date().toISOString(),
    });
    setAddedMessage(`Added ${food.name}`);
    setTimeout(() => setAddedMessage(''), 2000);
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;
    addFoodEntry(getTodayKey(), {
      id: crypto.randomUUID(),
      name: manualName.trim(),
      servingSize: manualServing.trim() || '1 serving',
      nutrients: { ...manualNutrients },
      timestamp: new Date().toISOString(),
    });
    setAddedMessage(`Added ${manualName}`);
    setManualName('');
    setManualServing('');
    setManualNutrients({ folate: 0, iron: 0, calcium: 0, protein: 0, dha: 0 });
    setShowManual(false);
    setTimeout(() => setAddedMessage(''), 2000);
  };

  return (
    <div className="px-5 py-6 max-w-lg mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground mb-1">Log Food</h1>
      <p className="text-sm text-muted-foreground mb-6">Search or add food manually</p>

      {/* Success message */}
      {addedMessage && (
        <div className="mb-4 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 text-xs text-primary font-medium animate-slide-up">
          {addedMessage}
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search foods..."
          className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Tabs: Categories + Manual */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        <button
          onClick={() => setShowManual(!showManual)}
          className={`shrink-0 text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-md border transition-colors ${
            showManual ? 'bg-primary text-primary-foreground border-primary' : 'ghost-button'
          }`}
        >
          Manual Entry
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => { setSelectedCategory(cat === selectedCategory ? null : cat); setQuery(''); setShowManual(false); }}
            className={`shrink-0 text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-md border transition-colors ${
              selectedCategory === cat ? 'bg-primary text-primary-foreground border-primary' : 'ghost-button'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Manual entry form */}
      {showManual && (
        <form onSubmit={handleManualAdd} className="mb-6 space-y-3 border border-border rounded-lg p-4 animate-slide-up">
          <p className="section-label">Manual Food Entry</p>
          <input
            type="text"
            value={manualName}
            onChange={e => setManualName(e.target.value)}
            placeholder="Food name"
            required
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
          <input
            type="text"
            value={manualServing}
            onChange={e => setManualServing(e.target.value)}
            placeholder="Serving size (e.g. 1 cup)"
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
          <div className="grid grid-cols-2 gap-2">
            {(['protein', 'iron', 'folate', 'calcium', 'dha'] as const).map(key => (
              <div key={key}>
                <label className="text-[0.6rem] font-mono uppercase tracking-wider text-muted-foreground">
                  {key} ({key === 'protein' ? 'g' : key === 'folate' ? 'mcg' : 'mg'})
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={manualNutrients[key] || ''}
                  onChange={e => setManualNutrients(prev => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }))}
                  className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground rounded-md py-2 text-xs font-medium uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Add Entry
          </button>
        </form>
      )}

      {/* Results */}
      {!showManual && results.length > 0 && (
        <div className="space-y-2">
          {results.map(food => (
            <button
              key={food.id}
              onClick={() => handleAdd(food)}
              className="w-full text-left flex items-center justify-between rounded-lg border border-border px-4 py-3 hover:border-primary transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{food.name}</p>
                <p className="text-xs text-muted-foreground">{food.servingSize}</p>
              </div>
              <div className="text-right text-xs text-muted-foreground space-y-0.5">
                <p>{food.nutrients.protein}g prot</p>
                <p>{food.nutrients.iron}mg iron</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {!showManual && query && results.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          <p className="text-sm">No foods found</p>
          <p className="text-xs mt-1">Try a different search or use manual entry</p>
        </div>
      )}

      {!showManual && !query && !selectedCategory && (
        <div className="text-center py-10 text-muted-foreground">
          <p className="text-sm">Search for a food or browse categories</p>
        </div>
      )}
    </div>
  );
}
