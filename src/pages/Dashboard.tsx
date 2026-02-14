import { useState, useEffect } from 'react';
import { NutrientRing } from '@/components/NutrientRing';
import { getProfile, getDailyLog, getTodayKey, getConsecutiveLowDays } from '@/lib/storage';
import { getTrimester, getTrimesterLabel, getWeekRange, getRecommendations } from '@/lib/recommendations';
import { useNavigate } from 'react-router-dom';
import type { UserProfile, DailyLog, NutrientKey } from '@/lib/types';

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [log, setLog] = useState<DailyLog | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const p = getProfile();
    if (!p) {
      navigate('/onboarding');
      return;
    }
    setProfile(p);
    setLog(getDailyLog(getTodayKey()));
  }, [navigate]);

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
              <div key={entry.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">{entry.servingSize}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{entry.nutrients.protein}g protein</p>
                  <p className="text-xs text-muted-foreground">{entry.nutrients.iron}mg iron</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="mt-8 pt-4 border-t border-border">
        <p className="disclaimer-text">
          For informational use only. Nutrient recommendations from NIH Office of Dietary Supplements.
          This app is not a substitute for medical advice. Consult your healthcare provider.
        </p>
      </div>
    </div>
  );
}
