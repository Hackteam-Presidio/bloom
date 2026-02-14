export function BloomFlower({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Outer peach petals */}
      <ellipse cx="50" cy="28" rx="18" ry="22" fill="#f0b89a" transform="rotate(0 50 50)" />
      <ellipse cx="50" cy="28" rx="18" ry="22" fill="#f0b89a" transform="rotate(72 50 50)" />
      <ellipse cx="50" cy="28" rx="18" ry="22" fill="#f0b89a" transform="rotate(144 50 50)" />
      <ellipse cx="50" cy="28" rx="18" ry="22" fill="#f0b89a" transform="rotate(216 50 50)" />
      <ellipse cx="50" cy="28" rx="18" ry="22" fill="#f0b89a" transform="rotate(288 50 50)" />
      {/* Inner pink petals */}
      <ellipse cx="50" cy="35" rx="10" ry="14" fill="#f0c4e0" transform="rotate(0 50 50)" />
      <ellipse cx="50" cy="35" rx="10" ry="14" fill="#f0c4e0" transform="rotate(72 50 50)" />
      <ellipse cx="50" cy="35" rx="10" ry="14" fill="#f0c4e0" transform="rotate(144 50 50)" />
      <ellipse cx="50" cy="35" rx="10" ry="14" fill="#f0c4e0" transform="rotate(216 50 50)" />
      <ellipse cx="50" cy="35" rx="10" ry="14" fill="#f0c4e0" transform="rotate(288 50 50)" />
      {/* Center */}
      <circle cx="50" cy="50" r="8" fill="#d4854a" />
    </svg>
  );
}