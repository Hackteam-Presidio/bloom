export function BloomFlower({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Outer peach/salmon petals */}
      <ellipse cx="50" cy="28" rx="18" ry="22" fill="hsl(20, 75%, 78%)" transform="rotate(0 50 50)" />
      <ellipse cx="50" cy="28" rx="18" ry="22" fill="hsl(20, 75%, 78%)" transform="rotate(72 50 50)" />
      <ellipse cx="50" cy="28" rx="18" ry="22" fill="hsl(20, 75%, 78%)" transform="rotate(144 50 50)" />
      <ellipse cx="50" cy="28" rx="18" ry="22" fill="hsl(20, 75%, 78%)" transform="rotate(216 50 50)" />
      <ellipse cx="50" cy="28" rx="18" ry="22" fill="hsl(20, 75%, 78%)" transform="rotate(288 50 50)" />
      {/* Inner pink petals */}
      <ellipse cx="50" cy="35" rx="10" ry="14" fill="hsl(320, 60%, 85%)" transform="rotate(0 50 50)" />
      <ellipse cx="50" cy="35" rx="10" ry="14" fill="hsl(320, 60%, 85%)" transform="rotate(72 50 50)" />
      <ellipse cx="50" cy="35" rx="10" ry="14" fill="hsl(320, 60%, 85%)" transform="rotate(144 50 50)" />
      <ellipse cx="50" cy="35" rx="10" ry="14" fill="hsl(320, 60%, 85%)" transform="rotate(216 50 50)" />
      <ellipse cx="50" cy="35" rx="10" ry="14" fill="hsl(320, 60%, 85%)" transform="rotate(288 50 50)" />
      {/* Center - warm orange */}
      <circle cx="50" cy="50" r="8" fill="hsl(25, 80%, 55%)" />
    </svg>
  );
}