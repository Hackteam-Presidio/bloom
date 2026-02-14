import { useState, useEffect } from 'react';
import { getProfile, saveProfile } from '@/lib/storage';
import { getTrimester, getTrimesterLabel } from '@/lib/recommendations';
import { useNavigate } from 'react-router-dom';
import { DietAllergySelector } from '@/components/DietAllergySelector';
import type { DietaryRestriction, Allergy } from '@/lib/types';

type InputMethod = 'dueDate' | 'lmp' | 'weeks';

export default function Settings() {
  const [method, setMethod] = useState<InputMethod>('weeks');
  const [dueDate, setDueDate] = useState('');
  const [lmpDate, setLmpDate] = useState('');
  const [weeks, setWeeks] = useState('');
  const [name, setName] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<DietaryRestriction[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const p = getProfile();
    if (!p) { navigate('/onboarding'); return; }
    setWeeks(String(p.gestationalAgeWeeks));
    setName(p.name || '');
    setDietaryRestrictions(p.dietaryRestrictions || []);
    setAllergies(p.allergies || []);
    if (p.dueDate) { setMethod('dueDate'); setDueDate(p.dueDate); }
    else if (p.lastMenstrualDate) { setMethod('lmp'); setLmpDate(p.lastMenstrualDate); }
    else { setMethod('weeks'); }
  }, [navigate]);

  const handleSave = () => {
    const today = new Date().toISOString().split('T')[0];
    const base = {
      name: name.trim() || undefined,
      dietaryRestrictions: dietaryRestrictions.length > 0 ? dietaryRestrictions : undefined,
      allergies: allergies.length > 0 ? allergies : undefined,
    };

    if (method === 'dueDate' && dueDate) {
      const d = new Date(dueDate);
      const now = new Date();
      const weeksLeft = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 7);
      const w = Math.max(1, Math.min(42, Math.round(40 - weeksLeft)));
      saveProfile({ ...base, gestationalAgeWeeks: w, dueDate });
    } else if (method === 'lmp' && lmpDate) {
      const d = new Date(lmpDate);
      const now = new Date();
      const w = Math.max(1, Math.min(42, Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1));
      saveProfile({ ...base, gestationalAgeWeeks: w, lastMenstrualDate: lmpDate });
    } else {
      const w = parseInt(weeks);
      if (w < 1 || w > 42 || isNaN(w)) return;
      saveProfile({ ...base, gestationalAgeWeeks: w, profileSetDate: today, gestationalAgeAtSet: w });
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const profile = getProfile();
  const currentWeek = profile?.gestationalAgeWeeks ?? parseInt(weeks);
  const trimester = !isNaN(currentWeek) && currentWeek >= 1 && currentWeek <= 42 ? getTrimester(currentWeek) : null;

  const methods: { value: InputMethod; label: string }[] = [
    { value: 'dueDate', label: 'Due Date' },
    { value: 'lmp', label: 'Last Period' },
    { value: 'weeks', label: 'Weeks' },
  ];

  return (
    <div className="px-5 py-6 max-w-lg mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

      {saved && (
        <div className="mb-4 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 text-xs text-primary font-medium animate-slide-up">
          Settings saved
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="section-label block mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Current computed week (read-only) */}
        {profile && (method === 'dueDate' || method === 'lmp') && (
          <div className="rounded-lg border border-border bg-card/50 px-4 py-3">
            <p className="section-label mb-1">Current Week</p>
            <p className="text-lg font-bold text-foreground">Week {profile.gestationalAgeWeeks}</p>
            {trimester && <p className="text-xs text-muted-foreground">{getTrimesterLabel(trimester)} · updates automatically</p>}
          </div>
        )}

        {/* Method selector */}
        <div>
          <label className="section-label block mb-2">Pregnancy date method</label>
          <div className="flex gap-2">
            {methods.map(m => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMethod(m.value)}
                className={`flex-1 text-xs font-medium py-2 rounded-lg border transition-colors ${
                  method === m.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground border-border hover:border-primary/50'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {method === 'dueDate' && (
          <div>
            <label className="section-label block mb-2">Estimated Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        )}

        {method === 'lmp' && (
          <div>
            <label className="section-label block mb-2">First Day of Last Menstrual Period</label>
            <input
              type="date"
              value={lmpDate}
              onChange={e => setLmpDate(e.target.value)}
              className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        )}

        {method === 'weeks' && (
          <div>
            <label className="section-label block mb-2">Gestational Age (weeks)</label>
            <input
              type="number"
              value={weeks}
              onChange={e => setWeeks(e.target.value)}
              min={1}
              max={42}
              className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            {trimester && (
              <p className="text-xs text-muted-foreground mt-2">
                {getTrimesterLabel(trimester)}
              </p>
            )}
          </div>
        )}

        <DietAllergySelector
          dietaryRestrictions={dietaryRestrictions}
          allergies={allergies}
          onRestrictionsChange={setDietaryRestrictions}
          onAllergiesChange={setAllergies}
        />

        <button
          onClick={handleSave}
          className="w-full bg-primary text-primary-foreground rounded-lg py-3 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Save Changes
        </button>
      </div>

      <div className="mt-10 border-t border-border pt-6">
        <p className="section-label mb-3">About</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Bloom is a pregnancy nutrition companion that helps you track your daily nutrient intake
          against stage-specific recommendations from the NIH Office of Dietary Supplements and
          food safety guidance from the CDC.
        </p>
        <p className="disclaimer-text mt-3">
          This app is for informational use only and is not a substitute for professional medical advice.
          Always consult your healthcare provider about your nutritional needs during pregnancy.
        </p>
      </div>
    </div>
  );
}
