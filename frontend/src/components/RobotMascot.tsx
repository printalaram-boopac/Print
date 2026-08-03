interface RobotMascotProps {
  className?: string;
}

// A custom friendly robot mascot (not a generic icon) — antenna glows, eyes
// blink on a loop, used to give the AI features a distinct, attention-grabbing
// visual identity rather than a plain lucide Bot icon.
export default function RobotMascot({ className = 'w-8 h-8' }: RobotMascotProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Antenna */}
      <line x1="32" y1="6" x2="32" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="5" r="3.5" fill="currentColor" className="robot-antenna-glow" />

      {/* Ears */}
      <rect x="4" y="26" width="6" height="12" rx="3" fill="currentColor" opacity="0.85" />
      <rect x="54" y="26" width="6" height="12" rx="3" fill="currentColor" opacity="0.85" />

      {/* Head */}
      <rect x="12" y="14" width="40" height="34" rx="12" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.12" />

      {/* Eyes */}
      <g className="robot-eyes">
        <circle cx="24" cy="31" r="4.5" fill="currentColor" />
        <circle cx="40" cy="31" r="4.5" fill="currentColor" />
      </g>

      {/* Smile */}
      <path d="M24 40c2.5 2.6 13.5 2.6 16 0" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
