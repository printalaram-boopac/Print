import { FOLD_STEPS } from '../constants';

export function FoldInstructions() {
  return (
    <div className="glass-card-gold rounded-xl p-6 md:p-10 space-y-8">
      <h2 className="text-2xl md:text-3xl font-display font-bold text-luxury-accent">
        Instructions: How to Fold Your Mini Magazine
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
        {FOLD_STEPS.map((step, i) => (
          <div key={i} className="space-y-1.5">
            <h3 className="text-sm font-display font-semibold text-luxury-gold">Step {i + 1}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
