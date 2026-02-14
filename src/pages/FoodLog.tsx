import { useState, useEffect, useRef } from 'react';
import { searchFoods, getFoodCategories, getFoodsByCategory, FoodItem } from '@/lib/foodDatabase';
import { addFoodEntry, getTodayKey, getProfile } from '@/lib/storage';
import { useNavigate } from 'react-router-dom';
import { NutrientTotals } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

export default function FoodLog() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualServing, setManualServing] = useState('');
  const [manualNutrients, setManualNutrients] = useState<NutrientTotals>({ folate: 0, iron: 0, calcium: 0, protein: 0, dha: 0 });
  const [addedMessage, setAddedMessage] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [photoAnalyzing, setPhotoAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const showSuccess = (name: string) => {
    setAddedMessage(`Added ${name}`);
    setTimeout(() => setAddedMessage(''), 2000);
  };

  const handleAddWithQuantity = () => {
    if (!selectedFood) return;
    const q = quantity;
    addFoodEntry(getTodayKey(), {
      id: crypto.randomUUID(),
      name: selectedFood.name + (q !== 1 ? ` ×${q}` : ''),
      servingSize: q !== 1 ? `${q} × ${selectedFood.servingSize}` : selectedFood.servingSize,
      nutrients: {
        folate: Math.round(selectedFood.nutrients.folate * q * 10) / 10,
        iron: Math.round(selectedFood.nutrients.iron * q * 10) / 10,
        calcium: Math.round(selectedFood.nutrients.calcium * q * 10) / 10,
        protein: Math.round(selectedFood.nutrients.protein * q * 10) / 10,
        dha: Math.round(selectedFood.nutrients.dha * q * 10) / 10,
      },
      timestamp: new Date().toISOString(),
    });
    showSuccess(selectedFood.name);
    setSelectedFood(null);
    setQuantity(1);
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
    showSuccess(manualName);
    setManualName('');
    setManualServing('');
    setManualNutrients({ folate: 0, iron: 0, calcium: 0, protein: 0, dha: 0 });
    setShowManual(false);
  };

  const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoAnalyzing(true);
    try {
      const base64 = await fileToBase64(file);
      const { data, error } = await supabase.functions.invoke('analyze-food-photo', {
        body: { imageBase64: base64 },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      addFoodEntry(getTodayKey(), {
        id: crypto.randomUUID(),
        name: data.name,
        servingSize: data.servingSize,
        nutrients: {
          folate: data.nutrients.folate || 0,
          iron: data.nutrients.iron || 0,
          calcium: data.nutrients.calcium || 0,
          protein: data.nutrients.protein || 0,
          dha: data.nutrients.dha || 0,
        },
        timestamp: new Date().toISOString(),
      });
      showSuccess(data.name);
    } catch (err) {
      console.error('Photo analysis failed:', err);
      setAddedMessage('Could not identify food. Try manual entry.');
      setTimeout(() => setAddedMessage(''), 3000);
    } finally {
      setPhotoAnalyzing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="px-5 py-6 max-w-lg mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground mb-1">Log Food</h1>
      <p className="text-sm text-muted-foreground mb-6">Search, snap a photo, or add manually</p>

      {/* Success / error message */}
      {addedMessage && (
        <div className={`mb-4 rounded-lg border px-4 py-2.5 text-xs font-medium animate-slide-up ${
          addedMessage.startsWith('Could not') 
            ? 'border-destructive/30 bg-destructive/5 text-destructive' 
            : 'border-primary/30 bg-primary/5 text-primary'
        }`}>
          {addedMessage}
        </div>
      )}

      {/* Search + Photo button */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedFood(null); }}
            placeholder="Search foods..."
            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={photoAnalyzing}
          className="shrink-0 flex items-center justify-center w-12 h-12 rounded-lg border border-border bg-card hover:border-primary transition-colors disabled:opacity-50"
          title="Take a photo to log food"
        >
          {photoAnalyzing ? (
            <svg className="animate-spin h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoCapture}
          className="hidden"
        />
      </div>

      {/* Tabs: Categories + Manual */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        <button
          onClick={() => { setShowManual(!showManual); setSelectedFood(null); }}
          className={`shrink-0 text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-md border transition-colors ${
            showManual ? 'bg-primary text-primary-foreground border-primary' : 'ghost-button'
          }`}
        >
          Manual Entry
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => { setSelectedCategory(cat === selectedCategory ? null : cat); setQuery(''); setShowManual(false); setSelectedFood(null); }}
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
          <input type="text" value={manualName} onChange={e => setManualName(e.target.value)} placeholder="Food name" required className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
          <input type="text" value={manualServing} onChange={e => setManualServing(e.target.value)} placeholder="Serving size (e.g. 1 cup)" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
          <div className="grid grid-cols-2 gap-2">
            {(['protein', 'iron', 'folate', 'calcium', 'dha'] as const).map(key => (
              <div key={key}>
                <label className="text-[0.6rem] font-mono uppercase tracking-wider text-muted-foreground">
                  {key} ({key === 'protein' ? 'g' : key === 'folate' ? 'mcg' : 'mg'})
                </label>
                <input type="number" step="0.1" min="0" value={manualNutrients[key] || ''} onChange={e => setManualNutrients(prev => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }))} className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary" />
              </div>
            ))}
          </div>
          <button type="submit" className="w-full bg-primary text-primary-foreground rounded-md py-2 text-xs font-medium uppercase tracking-wider hover:opacity-90 transition-opacity">
            Add Entry
          </button>
        </form>
      )}

      {/* Quantity selector for selected food */}
      {selectedFood && (
        <div className="mb-4 border border-primary/50 rounded-lg p-4 animate-slide-up bg-card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-foreground">{selectedFood.name}</p>
              <p className="text-xs text-muted-foreground">{selectedFood.servingSize}</p>
            </div>
            <button onClick={() => { setSelectedFood(null); setQuantity(1); }} className="text-muted-foreground hover:text-foreground">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Quantity controls */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Qty</span>
            <div className="flex items-center gap-0 border border-border rounded-md overflow-hidden">
              <button
                onClick={() => setQuantity(q => Math.max(0.5, q - 0.5))}
                className="px-3 py-1.5 text-sm text-foreground hover:bg-muted transition-colors"
              >−</button>
              <span className="px-4 py-1.5 text-sm font-medium text-foreground bg-background min-w-[3rem] text-center border-x border-border">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(q => q + 0.5)}
                className="px-3 py-1.5 text-sm text-foreground hover:bg-muted transition-colors"
              >+</button>
            </div>
            <span className="text-xs text-muted-foreground">× {selectedFood.servingSize}</span>
          </div>

          {/* Scaled nutrients preview */}
          <div className="grid grid-cols-5 gap-1 mb-3">
            {(['protein', 'iron', 'folate', 'calcium', 'dha'] as const).map(key => (
              <div key={key} className="text-center">
                <p className="text-[0.6rem] font-mono uppercase tracking-wider text-muted-foreground">{key}</p>
                <p className="text-xs font-medium text-foreground">
                  {(selectedFood.nutrients[key] * quantity).toFixed(key === 'protein' ? 0 : 1)}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddWithQuantity}
            className="w-full bg-primary text-primary-foreground rounded-md py-2 text-xs font-medium uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Add to Log
          </button>
        </div>
      )}

      {/* Results */}
      {!showManual && !selectedFood && results.length > 0 && (
        <div className="space-y-2">
          {results.map(food => (
            <button
              key={food.id}
              onClick={() => { setSelectedFood(food); setQuantity(1); }}
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

      {!showManual && !selectedFood && query && results.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          <p className="text-sm">No foods found</p>
          <p className="text-xs mt-1">Try a different search or use manual entry</p>
        </div>
      )}

      {!showManual && !selectedFood && !query && !selectedCategory && (
        <div className="text-center py-10 text-muted-foreground">
          <p className="text-sm">Search for a food or snap a photo</p>
        </div>
      )}
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
