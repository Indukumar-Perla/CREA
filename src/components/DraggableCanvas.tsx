import { useState, useRef, useEffect } from 'react';
import { CreativeLayout } from '../types';
import { renderCreative } from '../utils/creativeRenderer';

interface DraggableCanvasProps {
  layout: CreativeLayout;
  packshotDataUrl: string;
  logoDataUrl: string;
  headline: string;
  cta: string;
  onLayoutChange: (newLayout: CreativeLayout) => void;
}

interface DragState {
  isDragging: boolean;
  elementType: string | null;
  elementIndex: number | null;
  startX: number;
  startY: number;
  startPos: { x: number; y: number } | null;
  isResizing: boolean;
}

export const DraggableCanvas = ({
  layout,
  packshotDataUrl,
  logoDataUrl,
  headline,
  cta,
  onLayoutChange,
}: DraggableCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    elementType: null,
    elementIndex: null,
    startX: 0,
    startY: 0,
    startPos: null,
    isResizing: false,
  });
  const [scale, setScale] = useState(1);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    renderCanvas();
  }, [layout, preview]);

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [layout]);

  const updateCanvasSize = () => {
    if (containerRef.current) {
      const width = containerRef.current.clientWidth;
      const maxHeight = 600;
      const scaleFactor = width / layout.width;
      const scaledHeight = layout.height * scaleFactor;

      setScale(Math.min(scaleFactor, maxHeight / layout.height));
    }
  };

  const renderCanvas = async () => {
    const dataUrl = await renderCreative(layout, packshotDataUrl, logoDataUrl, headline, cta);
    setPreview(dataUrl);
  };

  const getMousePos = (e: React.MouseEvent): { x: number; y: number } => {
    if (!canvasRef.current) return { x: 0, y: 0 };

    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale,
    };
  };

  const getElementAtPos = (
    x: number,
    y: number
  ): { type: string; index?: number } | null => {
    const elements = [
      { type: 'packshot', pos: layout.packshot },
      { type: 'logo', pos: layout.logo },
      { type: 'headline', pos: layout.headline },
      { type: 'cta', pos: layout.cta },
    ];

    for (const elem of elements) {
      const pos = elem.pos;
      const left = pos.x - pos.width / 2;
      const top = pos.y - pos.height / 2;
      const right = left + pos.width;
      const bottom = top + pos.height;

      if (x >= left && x <= right && y >= top && y <= bottom) {
        return { type: elem.type };
      }
    }

    for (let i = 0; i < layout.decorations.length; i++) {
      const deco = layout.decorations[i];
      const pos = deco.position;
      const left = pos.x - pos.width / 2;
      const top = pos.y - pos.height / 2;
      const right = left + pos.width;
      const bottom = top + pos.height;

      if (x >= left && x <= right && y >= top && y <= bottom) {
        return { type: 'decoration', index: i };
      }
    }

    return null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getMousePos(e);
    const element = getElementAtPos(pos.x, pos.y);

    if (element) {
      setDragState({
        isDragging: true,
        elementType: element.type,
        elementIndex: element.index ?? null,
        startX: pos.x,
        startY: pos.y,
        startPos:
          element.type === 'decoration'
            ? { ...layout.decorations[element.index!].position }
            : element.type === 'packshot'
              ? { ...layout.packshot }
              : element.type === 'logo'
                ? { ...layout.logo }
                : element.type === 'headline'
                  ? { ...layout.headline }
                  : { ...layout.cta },
        isResizing: e.shiftKey,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState.isDragging || !dragState.startPos) return;

    const pos = getMousePos(e);
    const deltaX = pos.x - dragState.startX;
    const deltaY = pos.y - dragState.startY;

    const newLayout = { ...layout };

    if (dragState.elementType === 'decoration' && dragState.elementIndex !== null) {
      const deco = { ...newLayout.decorations[dragState.elementIndex] };
      deco.position = {
        ...deco.position,
        x: Math.max(
          deco.position.width / 2,
          Math.min(layout.width - deco.position.width / 2, dragState.startPos.x + deltaX)
        ),
        y: Math.max(
          deco.position.height / 2,
          Math.min(layout.height - deco.position.height / 2, dragState.startPos.y + deltaY)
        ),
      };

      if (dragState.isResizing) {
        deco.position.width = Math.max(20, dragState.startPos.width + deltaX);
        deco.position.height = Math.max(20, dragState.startPos.height + deltaY);
      }

      newLayout.decorations[dragState.elementIndex] = deco;
    } else if (dragState.elementType === 'packshot') {
      newLayout.packshot = {
        ...newLayout.packshot,
        x: Math.max(
          newLayout.packshot.width / 2,
          Math.min(layout.width - newLayout.packshot.width / 2, dragState.startPos.x + deltaX)
        ),
        y: Math.max(
          newLayout.packshot.height / 2,
          Math.min(layout.height - newLayout.packshot.height / 2, dragState.startPos.y + deltaY)
        ),
      };

      if (dragState.isResizing) {
        newLayout.packshot.width = Math.max(50, dragState.startPos.width + deltaX);
        newLayout.packshot.height = Math.max(50, dragState.startPos.height + deltaY);
      }
    } else if (dragState.elementType === 'logo') {
      newLayout.logo = {
        ...newLayout.logo,
        x: Math.max(
          newLayout.logo.width / 2,
          Math.min(layout.width - newLayout.logo.width / 2, dragState.startPos.x + deltaX)
        ),
        y: Math.max(
          newLayout.logo.height / 2,
          Math.min(layout.height - newLayout.logo.height / 2, dragState.startPos.y + deltaY)
        ),
      };

      if (dragState.isResizing) {
        newLayout.logo.width = Math.max(30, dragState.startPos.width + deltaX);
        newLayout.logo.height = Math.max(30, dragState.startPos.height + deltaY);
      }
    } else if (dragState.elementType === 'headline') {
      newLayout.headline = {
        ...newLayout.headline,
        x: dragState.startPos.x + deltaX,
        y: dragState.startPos.y + deltaY,
      };

      if (dragState.isResizing) {
        newLayout.headline.fontSize = Math.max(14, dragState.startPos.fontSize + deltaX / 5);
      }
    } else if (dragState.elementType === 'cta') {
      newLayout.cta = {
        ...newLayout.cta,
        x: dragState.startPos.x + deltaX,
        y: dragState.startPos.y + deltaY,
      };

      if (dragState.isResizing) {
        newLayout.cta.fontSize = Math.max(12, dragState.startPos.fontSize + deltaX / 5);
      }
    }

    onLayoutChange(newLayout);
  };

  const handleMouseUp = () => {
    setDragState({
      isDragging: false,
      elementType: null,
      elementIndex: null,
      startX: 0,
      startY: 0,
      startPos: null,
      isResizing: false,
    });
  };

  return (
    <div ref={containerRef} className="relative bg-white rounded-lg overflow-auto">
      <div className="p-4">
        <img
          ref={canvasRef}
          src={preview}
          alt="Canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="cursor-move max-w-full h-auto mx-auto rounded"
          style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
        />
      </div>
      <div className="absolute bottom-4 right-4 bg-gray-800 text-white text-xs px-2 py-1 rounded">
        Drag to move · Shift+Drag to resize
      </div>
    </div>
  );
};
