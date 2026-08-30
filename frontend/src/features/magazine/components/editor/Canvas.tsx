import { useCallback } from 'react';
import { RotateCw } from 'lucide-react';
import type { Guide, MagazineElement, MagazinePage } from '../../types';
import { useElementGestures, type ResizeHandle } from '../../hooks/useElementGestures';
import type { ElementPatch } from '../../hooks/useMagazineEditor';
import PageRenderer from '../shared/PageRenderer';

const HANDLES: { handle: ResizeHandle; className: string; cursor: string }[] = [
  { handle: 'nw', className: 'left-0 top-0 -translate-x-1/2 -translate-y-1/2', cursor: 'nwse-resize' },
  { handle: 'n', className: 'left-1/2 top-0 -translate-x-1/2 -translate-y-1/2', cursor: 'ns-resize' },
  { handle: 'ne', className: 'right-0 top-0 translate-x-1/2 -translate-y-1/2', cursor: 'nesw-resize' },
  { handle: 'e', className: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2', cursor: 'ew-resize' },
  { handle: 'se', className: 'right-0 bottom-0 translate-x-1/2 translate-y-1/2', cursor: 'nwse-resize' },
  { handle: 's', className: 'left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2', cursor: 'ns-resize' },
  { handle: 'sw', className: 'left-0 bottom-0 -translate-x-1/2 translate-y-1/2', cursor: 'nesw-resize' },
  { handle: 'w', className: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2', cursor: 'ew-resize' },
];

interface CanvasProps {
  page: MagazinePage;
  docWidth: number;
  docHeight: number;
  scale: number;
  selectedElementId: string | null;
  editingTextId: string | null;
  onSelect: (elementId: string | null) => void;
  onStartTextEdit: (elementId: string) => void;
  onTextCommit: (elementId: string, content: string) => void;
  onTextCancel: () => void;
  onBeginGesture: () => void;
  onUpdateElement: (elementId: string, patch: ElementPatch, history: 'skip') => void;
}

/**
 * The editable page surface.
 *
 * Elements are painted by the shared `PageRenderer`, so what the user drags is
 * literally what the preview and the export produce. This component adds only
 * the interaction layer: hit targets, the selection frame, resize and rotate
 * handles, and alignment guides.
 */
export default function Canvas({
  page,
  docWidth,
  docHeight,
  scale,
  selectedElementId,
  editingTextId,
  onSelect,
  onStartTextEdit,
  onTextCommit,
  onTextCancel,
  onBeginGesture,
  onUpdateElement,
}: CanvasProps) {
  const { startMove, startResize, startRotate, guides } = useElementGestures({
    docWidth,
    docHeight,
    scale,
    onBegin: onBeginGesture,
    onUpdate: onUpdateElement,
  });

  const selected = page.elements.find((el) => el.id === selectedElementId);

  const elementProps = useCallback(
    (element: MagazineElement) => {
      // Locked elements render but never intercept the pointer, and the text
      // box being edited must keep its caret behaviour.
      if (element.locked || editingTextId === element.id) {
        return { style: { cursor: element.locked ? 'default' : 'text' } };
      }

      return {
        style: { cursor: 'move' as const },
        onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
          if (e.button !== 0) return;
          onSelect(element.id);
          startMove(e, element);
        },
        onDoubleClick: (e: React.MouseEvent<HTMLDivElement>) => {
          if (element.type !== 'text') return;
          e.stopPropagation();
          onStartTextEdit(element.id);
        },
      };
    },
    [editingTextId, onSelect, onStartTextEdit, startMove],
  );

  return (
    <div
      className="relative bg-white shadow-[0_18px_60px_rgba(61,30,48,0.14)]"
      onPointerDown={() => onSelect(null)}
    >
      <PageRenderer
        page={page}
        width={docWidth}
        height={docHeight}
        scale={scale}
        elementProps={elementProps}
        editingTextId={editingTextId}
        onTextCommit={onTextCommit}
        onTextCancel={onTextCancel}
        overlay={
          <>
            <GuideLines guides={guides} docWidth={docWidth} docHeight={docHeight} scale={scale} />
            {selected && !editingTextId && (
              <SelectionFrame
                element={selected}
                scale={scale}
                onResizeStart={startResize}
                onRotateStart={startRotate}
              />
            )}
          </>
        }
      />
    </div>
  );
}

function GuideLines({
  guides,
  docWidth,
  docHeight,
  scale,
}: {
  guides: Guide[];
  docWidth: number;
  docHeight: number;
  scale: number;
}) {
  if (guides.length === 0) return null;

  return (
    <>
      {guides.map((guide) => (
        <div
          key={`${guide.axis}-${guide.at}`}
          style={{
            position: 'absolute',
            background: '#C5A059',
            pointerEvents: 'none',
            zIndex: 9998,
            ...(guide.axis === 'x'
              ? { left: guide.at, top: 0, width: Math.max(1 / scale, 0.5), height: docHeight }
              : { top: guide.at, left: 0, height: Math.max(1 / scale, 0.5), width: docWidth }),
          }}
        />
      ))}
    </>
  );
}

function SelectionFrame({
  element,
  scale,
  onResizeStart,
  onRotateStart,
}: {
  element: MagazineElement;
  scale: number;
  onResizeStart: (e: React.PointerEvent, element: MagazineElement, handle: ResizeHandle) => void;
  onRotateStart: (e: React.PointerEvent, element: MagazineElement) => void;
}) {
  // Sizes are divided by the scale so handles stay the same physical size on
  // screen whether the canvas is at 25% or 200%.
  const border = 1.5 / scale;
  const handleSize = 10 / scale;
  const rotateOffset = 32 / scale;

  return (
    <div
      style={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
        outline: `${border}px solid #C5A059`,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      {HANDLES.map(({ handle, className, cursor }) => (
        <div
          key={handle}
          role="presentation"
          onPointerDown={(e) => {
            e.stopPropagation();
            onResizeStart(e, element, handle);
          }}
          className={`absolute ${className}`}
          style={{
            width: handleSize,
            height: handleSize,
            background: '#FFFFFF',
            border: `${border}px solid #C5A059`,
            borderRadius: handleSize / 4,
            cursor,
            pointerEvents: 'auto',
            boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
          }}
        />
      ))}

      <div
        role="presentation"
        title="Drag to rotate — hold Shift to snap to 15°"
        onPointerDown={(e) => {
          e.stopPropagation();
          onRotateStart(e, element);
        }}
        className="absolute left-1/2 flex items-center justify-center"
        style={{
          top: -rotateOffset,
          width: handleSize * 1.8,
          height: handleSize * 1.8,
          marginLeft: -handleSize * 0.9,
          background: '#C5A059',
          borderRadius: '50%',
          cursor: 'grab',
          pointerEvents: 'auto',
          color: '#fff',
        }}
      >
        <RotateCw style={{ width: handleSize, height: handleSize }} />
      </div>
    </div>
  );
}
