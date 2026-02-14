import { DIETARY_RESTRICTIONS, COMMON_ALLERGIES, DietaryRestriction, Allergy } from '@/lib/types';

interface Props {
  dietaryRestrictions: DietaryRestriction[];
  allergies: Allergy[];
  onRestrictionsChange: (v: DietaryRestriction[]) => void;
  onAllergiesChange: (v: Allergy[]) => void;
}

export function DietAllergySelector({ dietaryRestrictions, allergies, onRestrictionsChange, onAllergiesChange }: Props) {
  const toggleRestriction = (r: DietaryRestriction) => {
    onRestrictionsChange(
      dietaryRestrictions.includes(r)
        ? dietaryRestrictions.filter(x => x !== r)
        : [...dietaryRestrictions, r]
    );
  };

  const toggleAllergy = (a: Allergy) => {
    onAllergiesChange(
      allergies.includes(a)
        ? allergies.filter(x => x !== a)
        : [...allergies, a]
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="section-label block mb-2">Dietary Restrictions</label>
        <p className="text-xs text-muted-foreground mb-3">Select all that apply</p>
        <div className="flex flex-wrap gap-2">
          {DIETARY_RESTRICTIONS.map(r => (
            <button
              key={r}
              type="button"
              onClick={() => toggleRestriction(r)}
              className={`text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-md border transition-colors ${
                dietaryRestrictions.includes(r)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'ghost-button'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="section-label block mb-2">Allergies</label>
        <p className="text-xs text-muted-foreground mb-3">Select all that apply</p>
        <div className="flex flex-wrap gap-2">
          {COMMON_ALLERGIES.map(a => (
            <button
              key={a}
              type="button"
              onClick={() => toggleAllergy(a)}
              className={`text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-md border transition-colors ${
                allergies.includes(a)
                  ? 'bg-destructive/90 text-destructive-foreground border-destructive'
                  : 'ghost-button'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
