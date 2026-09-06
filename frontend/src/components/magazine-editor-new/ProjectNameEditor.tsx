import { useState } from 'react';

interface ProjectNameEditorProps {
  name: string;
  onRename: (name: string) => void;
}

/** Click-to-edit project name (Step 11 §2) — Enter saves, Escape cancels,
 * blur saves if the result is non-empty. */
export default function ProjectNameEditor({ name, onRename }: ProjectNameEditorProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);

  const commit = () => {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed && trimmed !== name) onRename(trimmed);
    else setDraft(name);
  };

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); commit(); }
          if (e.key === 'Escape') { setDraft(name); setEditing(false); }
        }}
        onFocus={(e) => e.target.select()}
        className="text-[13px] font-medium text-[#1C2024] bg-[#F5F5F3] rounded-md px-2 py-1 border border-[#B8895A] focus:outline-none w-44"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => { setDraft(name); setEditing(true); }}
      title="Click to rename"
      className="text-[13px] font-medium text-[#1C2024] hover:bg-[#F5F5F3] rounded-md px-2 py-1 -mx-2 cursor-pointer truncate max-w-[200px]"
    >
      {name}
    </button>
  );
}
