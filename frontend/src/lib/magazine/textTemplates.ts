import type { NarrativeBeat, PageType } from './types';

// These are only seed/placeholder defaults shown in editable fields — the user can
// freely overwrite every string. Pure interpolation, not generation.

export function defaultTitleFor(pageType: PageType, relationshipTerm: string, recipientName: string): string {
  const who = relationshipTerm || recipientName;
  if (pageType === 'cover') return who ? `For My ${who}` : 'For You';
  if (pageType === 'closing') return who ? `Thank You, ${who}` : 'Thank You';
  if (pageType === 'letter') return who ? `Dear ${who}` : 'Dear You';
  return who ? `To ${who}` : 'To You';
}

export function defaultQuoteFor(narrativeBeat: NarrativeBeat, relationshipTerm: string): string {
  const term = relationshipTerm.trim();
  switch (narrativeBeat) {
    case 'connection':
      return term
        ? `Every moment with you, ${term}, became a memory worth keeping.`
        : 'Every moment together became a memory worth keeping.';
    case 'peak':
      return term
        ? `These are the days we'll talk about forever, ${term}.`
        : "These are the days we'll talk about forever.";
    case 'reflection':
      return term
        ? `Dear ${term}, thinking back on everything we've shared, I'm reminded how lucky I am to have you in my life. Every memory on these pages is a piece of a story I'll treasure forever.`
        : "Thinking back on everything we've shared, I'm reminded how lucky I am to have you in my life. Every memory on these pages is a piece of a story I'll treasure forever.";
    case 'milestone':
      return term ? `Look how far we've come, ${term}.` : "Look how far we've come.";
    case 'closing':
      return term ? `Thank you for everything, ${term}.` : 'Thank you for everything.';
    default:
      return '';
  }
}

export function defaultCaptionFor(narrativeBeat: NarrativeBeat, relationshipTerm: string): string {
  const term = relationshipTerm.trim();
  switch (narrativeBeat) {
    case 'peak':
      return term ? `Celebrating with ${term}.` : 'Celebrating together.';
    case 'milestone':
      return term ? `A chapter in our story with ${term}.` : 'A chapter in our story.';
    default:
      return term ? `A moment with ${term}.` : 'A moment together.';
  }
}

export function chapterLabelFor(index: number): string {
  return `Chapter ${index}`;
}
