import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProfile } from '@/lib/storage';

export default function Onboarding() {
  const [weeks, setWeeks] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseInt(weeks);
    if (w < 1 || w > 42 || isNaN(w)) return;
    saveProfile({ gestationalAgeWeeks: w, name: name.trim() || undefined });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 animate-fade-in">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22c6-3 10-9.5 10-13A10 10 0 0 0 2 9c0 3.5 4 10 10 13z" />
              <path d="M12 22c-6-3-10-9.5-10-13" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Bloom</h1>
            <p className="text-xs text-muted-foreground">Your pregnancy nutrition companion</p>
          </div>
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
            <p className="text-xs text-muted-foreground mt-2">
              Enter your current week of pregnancy (1 – 42)
            </p>
          </div>

          <button
            type="submit"
            disabled={!weeks || parseInt(weeks) < 1 || parseInt(weeks) > 42}
            className="w-full bg-primary text-primary-foreground rounded-lg py-3 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
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
