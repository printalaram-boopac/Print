import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { TOPIC_PROMPTS } from '../constants';
import { logUserEvent } from '@/lib/analytics';

interface MagazineSetupPanelProps {
  relationshipName: string;
  setRelationshipName: (v: string) => void;
  selectedTopic: string | null;
  setSelectedTopic: (v: string | null) => void;
  isGenerating: boolean;
  handleGenerateMagazineContent: () => void;
}

export function MagazineSetupPanel({
  relationshipName,
  setRelationshipName,
  selectedTopic,
  setSelectedTopic,
  isGenerating,
  handleGenerateMagazineContent,
}: MagazineSetupPanelProps) {
  return (
    <div className="rounded-xl border border-luxury-gold/40 p-4 space-y-3" style={{ background: 'linear-gradient(135deg, #1a1410, #3D1E30 70%)' }}>
      <div className="flex items-center gap-2">
        <Wand2 className="w-4 h-4 text-luxury-gold" strokeWidth={2} />
        <h3 className="text-xs font-bold uppercase tracking-widest text-luxury-gold">Magazine Setup</h3>
      </div>
      <p className="text-[11px] text-gray-400">
        Every page below already has a ready-to-print design — titles, quotes and decorations included. You only add your photos. Optionally personalize it here first.
      </p>

      <div className="space-y-1.5">
        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Who is this for? (optional)</p>
        <input
          type="text"
          value={relationshipName}
          onChange={(e) => setRelationshipName(e.target.value)}
          placeholder="e.g. Mameri, Mom, Riya"
          className="w-full bg-luxury-dark border border-gold-200/40 rounded-lg px-3 py-2.5 text-xs text-luxury-accent placeholder:text-gray-500 focus:outline-none focus:border-luxury-gold transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Theme (optional — personalizes the quotes)</p>
        <div className="flex flex-wrap gap-1.5">
          {TOPIC_PROMPTS.map((t) => {
            const active = selectedTopic === t.label;
            return (
              <button
                key={t.label}
                type="button"
                onClick={() => {
                  const next = active ? null : t.label;
                  setSelectedTopic(next);
                  logUserEvent('CLICK_TOPIC_PROMPT', { topic: t.label });
                }}
                aria-pressed={active}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border transition-colors cursor-pointer ${
                  active
                    ? 'border-luxury-gold bg-luxury-gold/20 text-luxury-gold'
                    : 'border-gold-200/40 bg-luxury-dark text-[11px] text-gray-300 hover:border-luxury-gold hover:text-luxury-gold'
                }`}
              >
                <t.icon className="w-3.5 h-3.5 text-luxury-gold flex-shrink-0" strokeWidth={2} /> {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={handleGenerateMagazineContent}
        disabled={isGenerating}
        className="w-full flex items-center justify-center gap-1.5 px-4 py-3 rounded-lg bg-luxury-gold text-luxury-accent text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} /> Personalizing your magazine...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" strokeWidth={2} /> Personalize With AI (optional)
          </>
        )}
      </button>
      <p className="text-[10px] text-gray-500 text-center">
        Skip this and just add your photos below — the magazine already looks great with its built-in copy.
      </p>
    </div>
  );
}
