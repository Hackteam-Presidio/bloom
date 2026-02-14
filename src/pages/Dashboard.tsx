import { useState, useEffect, useMemo } from 'react';
import { NutrientRing } from '@/components/NutrientRing';
import { getProfile, getDailyLog, getTodayKey, getConsecutiveLowDays, updateFoodEntry, removeFoodEntry } from '@/lib/storage';
import { getTrimester, getTrimesterLabel, getWeekRange, getRecommendations } from '@/lib/recommendations';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, AlertTriangle } from 'lucide-react';
import type { UserProfile, DailyLog, NutrientKey, FoodEntry, NutrientTotals } from '@/lib/types';

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [log, setLog] = useState<DailyLog | null>(null);
  const [editingEntry, setEditingEntry] = useState<FoodEntry | null>(null);
  const [editName, setEditName] = useState('');
  const [editServing, setEditServing] = useState('');
  const [editNutrients, setEditNutrients] = useState<NutrientTotals>({ folate: 0, iron: 0, calcium: 0, protein: 0, dha: 0 });
  const navigate = useNavigate();

  const refreshLog = () => setLog(getDailyLog(getTodayKey()));

  useEffect(() => {
    const p = getProfile();
    if (!p) {
      navigate('/onboarding');
      return;
    }
    setProfile(p);
    refreshLog();
  }, [navigate]);

  const startEdit = (entry: FoodEntry) => {
    setEditingEntry(entry);
    setEditName(entry.name);
    setEditServing(entry.servingSize);
    setEditNutrients({ ...entry.nutrients });
  };

  const saveEdit = () => {
    if (!editingEntry) return;
    const updated = updateFoodEntry(getTodayKey(), editingEntry.id, {
      name: editName,
      servingSize: editServing,
      nutrients: { ...editNutrients },
    });
    setLog(updated);
    setEditingEntry(null);
  };

  const deleteEntry = (id: string) => {
    const updated = removeFoodEntry(getTodayKey(), id);
    setLog(updated);
    setEditingEntry(null);
  };

  if (!profile || !log) return null;

  const trimester = getTrimester(profile.gestationalAgeWeeks);
  const recommendations = getRecommendations(trimester);

  const colorMap: Record<NutrientKey, string> = {
    folate: 'hsl(var(--nutrient-folate))',
    iron: 'hsl(var(--nutrient-iron))',
    calcium: 'hsl(var(--nutrient-calcium))',
    protein: 'hsl(var(--nutrient-protein))',
    dha: 'hsl(var(--nutrient-dha))',
  };

  // Alerts for low nutrients
  const alerts = recommendations
    .map(r => {
      const days = getConsecutiveLowDays(r.key, r.target);
      return { ...r, lowDays: days };
    })
    .filter(r => r.lowDays >= 2);

  return (
    <div className="px-5 py-6 max-w-lg mx-auto animate-fade-in">
      {/* Week & Trimester */}
      <div className="mb-8">
        <p className="section-label mb-1">{getWeekRange(trimester)}</p>
        <h1 className="text-2xl font-bold text-foreground">
          Week {profile.gestationalAgeWeeks}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{getTrimesterLabel(trimester)}</p>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {alerts.map(a => (
            <div key={a.key} className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 px-4 py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--warning))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <p className="text-xs text-foreground">
                <span className="font-medium">{a.name}</span> has been below 50% for {a.lowDays} consecutive days
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Nutrient rings */}
      <div className="mb-6">
        <p className="section-label mb-4">Daily Progress</p>
        <div className="grid grid-cols-3 gap-4">
          {recommendations.map(r => {
            const current = log.totals[r.key];
            const pct = r.target > 0 ? (current / r.target) * 100 : 0;
            return (
              <NutrientRing
                key={r.key}
                percentage={pct}
                color={colorMap[r.key]}
                label={r.name}
                value={current.toFixed(r.key === 'protein' ? 0 : 1)}
                unit={r.unit}
                target={r.target}
                size={90}
                strokeWidth={5}
              />
            );
          })}
        </div>

        {/* Caffeine warning bar */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[0.65rem] font-mono uppercase tracking-wider text-muted-foreground">Caffeine Limit</span>
              <span className="text-[0.65rem] font-mono text-destructive">≤ 200mg/day</span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-destructive/10">
              <div className="h-full rounded-full bg-destructive/80 transition-all" style={{ width: '100%' }} />
            </div>
            <p className="text-[0.6rem] text-destructive/70 mt-1">Keep caffeine under 200mg — about 1 cup of coffee</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--destructive))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
      </div>

      {/* Today's entries */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="section-label">Today's Food Log</p>
          <button
            onClick={() => navigate('/log')}
            className="ghost-button text-xs px-3 py-1.5 rounded-md font-mono uppercase tracking-wider"
          >
            + Add Food
          </button>
        </div>
        {log.entries.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <p className="text-sm">No food logged yet today</p>
            <p className="text-xs mt-1">Tap "Add Food" to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {log.entries.map(entry => (
              editingEntry?.id === entry.id ? (
                <div key={entry.id} className="rounded-lg border border-primary/50 bg-card px-4 py-3 space-y-3 animate-slide-up">
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                  <input
                    value={editServing}
                    onChange={e => setEditServing(e.target.value)}
                    placeholder="Serving size"
                    className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    {(['protein', 'iron', 'folate', 'calcium', 'dha'] as const).map(key => (
                      <div key={key}>
                        <label className="text-[0.6rem] font-mono uppercase tracking-wider text-muted-foreground">
                          {key}
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={editNutrients[key] || ''}
                          onChange={e => setEditNutrients(prev => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }))}
                          className="w-full bg-background border border-border rounded-md px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="flex-1 bg-primary text-primary-foreground rounded-md py-1.5 text-xs font-mono uppercase tracking-wider">
                      Save
                    </button>
                    <button onClick={() => setEditingEntry(null)} className="flex-1 ghost-button rounded-md py-1.5 text-xs font-mono uppercase tracking-wider">
                      Cancel
                    </button>
                    <button onClick={() => deleteEntry(entry.id)} className="ghost-button rounded-md py-1.5 text-xs font-mono uppercase tracking-wider text-destructive border-destructive/30 hover:border-destructive">
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  key={entry.id}
                  onClick={() => startEdit(entry)}
                  className="w-full text-left flex items-center justify-between rounded-lg border border-border px-4 py-3 hover:border-primary transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{entry.name}</p>
                    <p className="text-xs text-muted-foreground">{entry.servingSize}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right text-xs text-muted-foreground space-y-0.5">
                      <p>{entry.nutrients.protein}g protein</p>
                      <p>{entry.nutrients.iron}mg iron</p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </div>
                </button>
              )
            ))}
          </div>
        )}
      </div>

      {/* Smart Tips */}
      <SmartTips totals={log.totals} recommendations={recommendations} trimester={trimester} />

      {/* Disclaimer */}
      <div className="mt-6 pt-4 border-t border-border">
        <p className="disclaimer-text">
          For informational use only. Nutrient recommendations from NIH Office of Dietary Supplements.
          This app is not a substitute for medical advice. Consult your healthcare provider.
        </p>
      </div>
    </div>
  );
}

// Nutrient boost suggestions keyed by nutrient
const boostFoods: Record<NutrientKey, string[]> = {
  dha: ['salmon', 'sardines', 'walnuts', 'chia seeds'],
  iron: ['spinach', 'lentils', 'fortified cereal', 'lean beef'],
  folate: ['lentils', 'asparagus', 'spinach', 'fortified cereal'],
  calcium: ['yogurt', 'tofu', 'sardines', 'kale'],
  protein: ['chicken breast', 'greek yogurt', 'lentils', 'eggs'],
};

// Nutrient interaction cautions
const nutrientConflicts: { condition: (t: NutrientTotals) => boolean; icon: 'caution'; text: string }[] = [
  {
    condition: (t) => t.iron > 15 && t.calcium > 500,
    icon: 'caution',
    text: 'High calcium can inhibit iron absorption. Try spacing calcium-rich and iron-rich foods apart by 2 hours.',
  },
  {
    condition: (t) => t.iron > 10 && t.dha < 50,
    icon: 'caution',
    text: "You're getting iron but low DHA today. Pair iron-rich meals with a DHA source like salmon or walnuts for balanced development.",
  },
  {
    condition: (t) => t.folate > 400 && t.iron < 5,
    icon: 'caution',
    text: 'Good folate intake, but iron is low. Folate and iron work together — add spinach or lentils which provide both.',
  },
];

interface SmartTipsProps {
  totals: NutrientTotals;
  recommendations: { name: string; key: NutrientKey; target: number; unit: string }[];
  trimester: number;
}

function SmartTips({ totals, recommendations, trimester }: SmartTipsProps) {
  const tips = useMemo(() => {
    const result: { type: 'boost' | 'caution'; text: string }[] = [];

    // Boost tips for low nutrients
    for (const r of recommendations) {
      const pct = r.target > 0 ? (totals[r.key] / r.target) * 100 : 100;
      if (pct < 50) {
        const foods = boostFoods[r.key];
        result.push({
          type: 'boost',
          text: `You can boost ${r.name} by eating more ${foods[0]}, ${foods[1]}, or ${foods[2]}.`,
        });
      }
    }

    // Nutrient conflict cautions
    for (const conflict of nutrientConflicts) {
      if (conflict.condition(totals)) {
        result.push({ type: 'caution', text: conflict.text });
      }
    }

    // Trimester-specific tip
    if (trimester === 1 && totals.folate < 300) {
      result.push({ type: 'boost', text: 'First trimester is critical for folate — try adding fortified cereal or lentils to reach 600mcg.' });
    }
    if (trimester >= 2 && totals.dha < 100) {
      result.push({ type: 'boost', text: `DHA needs increase in trimester ${trimester}. Salmon or a prenatal with DHA can help reach your target.` });
    }

    return result.slice(0, 4); // max 4 tips
  }, [totals, recommendations, trimester]);

  if (tips.length === 0) return null;

  return (
    <div className="mt-6">
      <p className="section-label mb-3">Tips for You</p>
      <div className="space-y-2">
        {tips.map((tip, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 rounded-lg border px-4 py-3 ${
              tip.type === 'caution'
                ? 'border-warning/30 bg-warning/5'
                : 'border-primary/20 bg-primary/5'
            }`}
          >
            {tip.type === 'caution' ? (
              <AlertTriangle size={15} className="mt-0.5 shrink-0 text-warning" />
            ) : (
              <Lightbulb size={15} className="mt-0.5 shrink-0 text-primary" />
            )}
            <p className="text-xs text-foreground leading-relaxed">{tip.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
