export function ToggleButton({ active, onClick, children, label }: { active: boolean; onClick: () => void; children: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
        active ? 'bg-luxury-gold border-luxury-gold text-luxury-accent' : 'bg-luxury-dark border-gold-200/40 text-gray-400 hover:border-luxury-gold/60'
      }`}
    >
      {children}
    </button>
  );
}
