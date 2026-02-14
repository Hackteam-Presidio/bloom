import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProfile } from '@/lib/storage';
import { DietAllergySelector } from '@/components/DietAllergySelector';
import { BloomFlower } from '@/components/BloomFlower';
import type { DietaryRestriction, Allergy } from '@/lib/types';

type InputMethod = 'dueDate' | 'lmp' | 'weeks';

export default function Onboarding() {
  const [method, setMethod] = useState<InputMethod>('dueDate');
  const [dueDate, setDueDate] = useState('');
  const [lmpDate, setLmpDate] = useState('');
  const [weeks, setWeeks] = useState('');
  const [name, setName] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<DietaryRestriction[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const navigate = useNavigate();

  const computeWeeksFromDue = (due: string) => {
    const d = new Date(due);
    const today = new Date();
    const diffMs = d.getTime() - today.getTime();
    const weeksLeft = diffMs / (1000 * 60 * 60 * 24 * 7);
    return Math.round(40 - weeksLeft);
  };

  const computeWeeksFromLmp = (lmp: string) => {
    const d = new Date(lmp);
    const today = new Date();
    const diffMs = today.getTime() - d.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7)) + 1;
  };

  const isValid = () => {
    if (method === 'dueDate') return !!dueDate;
    if (method === 'lmp') return !!lmpDate;
    const w = parseInt(weeks);
    return !isNaN(w) && w >= 1 && w <= 42;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];

    if (method === 'dueDate') {
      const w = computeWeeksFromDue(dueDate);
      if (w < 1 || w > 42) return;
      saveProfile({
        gestationalAgeWeeks: w,
        dueDate,
        name: name.trim() || undefined,
        dietaryRestrictions: dietaryRestrictions.length > 0 ? dietaryRestrictions : undefined,
        allergies: allergies.length > 0 ? allergies : undefined,
      });
    } else if (method === 'lmp') {
      const w = computeWeeksFromLmp(lmpDate);
      if (w < 1 || w > 42) return;
      saveProfile({
        gestationalAgeWeeks: w,
        lastMenstrualDate: lmpDate,
        name: name.trim() || undefined,
        dietaryRestrictions: dietaryRestrictions.length > 0 ? dietaryRestrictions : undefined,
        allergies: allergies.length > 0 ? allergies : undefined,
      });
    } else {
      const w = parseInt(weeks);
      if (w < 1 || w > 42 || isNaN(w)) return;
      saveProfile({
        gestationalAgeWeeks: w,
        profileSetDate: today,
        gestationalAgeAtSet: w,
        name: name.trim() || undefined,
        dietaryRestrictions: dietaryRestrictions.length > 0 ? dietaryRestrictions : undefined,
        allergies: allergies.length > 0 ? allergies : undefined,
      });
    }
    navigate('/');
  };

  const methods: { value: InputMethod; label: string }[] = [
    { value: 'dueDate', label: 'Due Date' },
    { value: 'lmp', label: 'Last Period' },
    { value: 'weeks', label: 'Weeks' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 animate-fade-in">
      <div className="w-full max-w-sm">
        {/* Logo & Brand */}
        <div className="flex flex-col items-center mb-10">
          <BloomFlower className="w-16 h-16 mb-3" />
          <h1 className="text-2xl font-display font-semibold text-foreground tracking-tight">
            <span style={{ fontFamily: 'Nunito, sans-serif' }}>Bloom</span>
          </h1>
          <p className="text-xs text-muted-foreground font-serif mt-1 tracking-wide">
            Your pregnancy nutrition companion
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="section-label block mb-2">Your Name (optional)</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Method selector */}
          <div>
            <label className="section-label block mb-2">How would you like to enter your pregnancy stage?</label>
            <div className="flex gap-2">
              {methods.map(m => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMethod(m.value)}
                  className={`flex-1 text-xs font-serif font-medium py-2.5 rounded-lg border transition-colors ${
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

          {/* Conditional input */}
          {method === 'dueDate' && (
            <div>
              <label className="section-label block mb-2">Estimated Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                required
                className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <p className="text-xs text-muted-foreground mt-2 font-serif">
                Your week will automatically update each week
              </p>
            </div>
          )}

          {method === 'lmp' && (
            <div>
              <label className="section-label block mb-2">First Day of Last Menstrual Period</label>
              <input
                type="date"
                value={lmpDate}
                onChange={e => setLmpDate(e.target.value)}
                required
                className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <p className="text-xs text-muted-foreground mt-2 font-serif">
                Your week will automatically update each week
              </p>
            </div>
          )}

          {method === 'weeks' && (
            <div>
              <label className="section-label block mb-2">Gestational Age (weeks)</label>
              <input
                type="number"
                value={weeks}
                onChange={e => setWeeks(e.target.value)}
                placeholder="e.g. 12"
                min={1}
                max={42}
                required
                className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <p className="text-xs text-muted-foreground mt-2 font-serif">
                Your week will automatically advance over time
              </p>
            </div>
          )}

          <DietAllergySelector
            dietaryRestrictions={dietaryRestrictions}
            allergies={allergies}
            onRestrictionsChange={setDietaryRestrictions}
            onAllergiesChange={setAllergies}
          />

          <button
            type="submit"
            disabled={!isValid()}
            className="w-full bg-primary text-primary-foreground rounded-lg py-3.5 text-sm font-display font-semibold tracking-wide hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            Get Started
          </button>
        </form>

        <p className="disclaimer-text mt-8 text-center">
          This app provides general nutrition information based on NIH and CDC guidelines.
          It is not a substitute for professional medical advice.
        </p>
      </div>
    </div>
  );
}
