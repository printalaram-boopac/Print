import { memo, useEffect, useRef, type CSSProperties } from 'react';
import type { TextElement } from '../../types';
import { fontStack } from '../../fonts';

interface TextElementViewProps {
  element: TextElement;
  /** True while the user is editing this text box inline on the canvas. */
  editable?: boolean;
  /** Called with the new content when inline editing ends. */
  onCommit?: (content: string) => void;
  /** Called when the user presses Escape while editing. */
  onCancel?: () => void;
}

/** Styles shared by the static and editable renderings, so text never shifts. */
function textStyle(element: TextElement): CSSProperties {
  return {
    fontFamily: fontStack(element.fontFamily),
    fontSize: element.fontSize,
    fontWeight: element.fontWeight,
    fontStyle: element.fontStyle,
    color: element.color,
    textAlign: element.textAlign,
    lineHeight: element.lineHeight,
    letterSpacing: element.letterSpacing,
    textTransform: element.textTransform,
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
    width: '100%',
    height: '100%',
    margin: 0,
    outline: 'none',
  };
}

/**
 * Renders a text element. The same component is used by the editor canvas,
 * page thumbnails, the reader preview and the exporter, which is what keeps
 * typography identical across all four.
 */
function TextElementViewBase({ element, editable, onCommit, onCancel }: TextElementViewProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Seed the editable node once per editing session and place the caret at the
  // end. React must not own the DOM text while contentEditable is active or the
  // caret jumps on every keystroke.
  useEffect(() => {
    if (!editable || !ref.current) return;
    const node = ref.current;
    node.textContent = element.content;
    node.focus();
    const range = document.createRange();
    range.selectNodeContents(node);
    range.collapse(false);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    // Intentionally keyed only on `editable` — re-seeding on content change
    // would fight the user's typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editable]);

  if (editable) {
    return (
      <div
        ref={ref}
        role="textbox"
        tabIndex={0}
        aria-label="Edit text"
        contentEditable
        suppressContentEditableWarning
        style={textStyle(element)}
        onBlur={(e) => onCommit?.(e.currentTarget.textContent ?? '')}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === 'Escape') {
            e.preventDefault();
            onCancel?.();
          }
          // Enter inserts a line break; Ctrl/Cmd+Enter finishes editing.
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            onCommit?.(e.currentTarget.textContent ?? '');
          }
        }}
        onPointerDown={(e) => e.stopPropagation()}
      />
    );
  }

  return <div style={textStyle(element)}>{element.content}</div>;
}

export const TextElementView = memo(TextElementViewBase);
