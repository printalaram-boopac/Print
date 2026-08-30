import { type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import type { MagazineElement, MagazinePage, PageBackground } from '../../types';
import { ImageElementView } from './ImageElementView';
import { ShapeElementView } from './ShapeElementView';
import { TextElementView } from './TextElementView';

function backgroundStyle(background: PageBackground): CSSProperties {
  switch (background.type) {
    case 'gradient':
      return { background: `linear-gradient(${background.angle}deg, ${background.from}, ${background.to})` };
    case 'image':
      return {
        backgroundColor: background.color,
        backgroundImage: `url(${background.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    case 'color':
    default:
      return { backgroundColor: background.color };
  }
}

export interface PageRendererProps {
  page: MagazinePage;
  /** Document width in document units. */
  width: number;
  /** Document height in document units. */
  height: number;
  /**
   * Visual scale. Element coordinates are never touched — the whole page
   * surface is transformed, so a design looks identical at any size.
   */
  scale: number;
  /**
   * Extra props merged onto each element's positioned box. The editor uses this
   * to attach selection and drag handlers directly to the element geometry,
   * without adding wrapper nodes that could shift the layout.
   */
  elementProps?: (element: MagazineElement) => HTMLAttributes<HTMLDivElement> | undefined;
  /** Element currently being edited inline; rendered as a contentEditable. */
  editingTextId?: string | null;
  onTextCommit?: (elementId: string, content: string) => void;
  onTextCancel?: () => void;
  /** Rendered inside the scaled surface — selection outlines, guides, handles. */
  overlay?: ReactNode;
  /** Suppresses empty-frame labels for previews and exports. */
  showPlaceholderLabels?: boolean;
  className?: string;
  /** Applied to the outer, already-scaled box. */
  style?: CSSProperties;
  /** Forwarded to the page surface so the exporter can capture this node. */
  surfaceRef?: (node: HTMLDivElement | null) => void;
}

/**
 * The single source of truth for how a magazine page looks.
 *
 * Used by the editor canvas, page thumbnails, the reader preview and the
 * PDF/PNG exporter. Because all four render through this component, a saved
 * design is guaranteed to look the same in every context.
 */
export default function PageRenderer({
  page,
  width,
  height,
  scale,
  elementProps,
  editingTextId,
  onTextCommit,
  onTextCancel,
  overlay,
  showPlaceholderLabels = true,
  className,
  style,
  surfaceRef,
}: PageRendererProps) {
  const ordered = [...page.elements].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      className={className}
      style={{
        width: width * scale,
        height: height * scale,
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
        ...style,
      }}
    >
      <div
        ref={surfaceRef}
        data-page-surface="true"
        style={{
          width,
          height,
          position: 'absolute',
          top: 0,
          left: 0,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          overflow: 'hidden',
          ...backgroundStyle(page.background),
        }}
      >
        {ordered.map((element) => {
          let view: ReactNode;
          if (element.type === 'text') {
            view = (
              <TextElementView
                element={element}
                editable={editingTextId === element.id}
                onCommit={(content) => onTextCommit?.(element.id, content)}
                onCancel={onTextCancel}
              />
            );
          } else if (element.type === 'image') {
            view = <ImageElementView element={element} showPlaceholderLabel={showPlaceholderLabels} />;
          } else {
            view = <ShapeElementView element={element} />;
          }

          const extra = elementProps?.(element);

          return (
            <div
              key={element.id}
              data-element-id={element.id}
              {...extra}
              style={{
                position: 'absolute',
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
                opacity: element.opacity,
                zIndex: element.zIndex,
                ...extra?.style,
              }}
            >
              {view}
            </div>
          );
        })}

        {overlay}
      </div>
    </div>
  );
}
