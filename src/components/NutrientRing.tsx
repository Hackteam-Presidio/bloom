interface NutrientRingProps {
  percentage: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  label: string;
  value: string;
  unit: string;
  target: number;
}

export function NutrientRing({ percentage, color, size = 100, strokeWidth = 6, label, value, unit, target }: NutrientRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const capped = Math.min(percentage, 100);
  const offset = circumference - (capped / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-semibold text-foreground">{Math.round(percentage)}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="section-label">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {value} / {target} {unit}
        </p>
      </div>
    </div>
  );
}
