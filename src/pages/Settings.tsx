import { useState, useEffect } from 'react';
import { getProfile, saveProfile } from '@/lib/storage';
import { getTrimester, getTrimesterLabel } from '@/lib/recommendations';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const [weeks, setWeeks] = useState('');
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const p = getProfile();
    if (!p) { navigate('/onboarding'); return; }
    setWeeks(String(p.gestationalAgeWeeks));
    setName(p.name || '');
  }, [navigate]);

  const handleSave = () => {
    const w = parseInt(weeks);
    if (w < 1 || w > 42 || isNaN(w)) return;
    saveProfile({ gestationalAgeWeeks: w, name: name.trim() || undefined });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const w = parseInt(weeks);
  const trimester = !isNaN(w) && w >= 1 && w <= 42 ? getTrimester(w) : null;

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
