import { useState, useRef, useEffect } from 'react';
import { CreativeLayout } from '../types';
import { renderCreative } from '../utils/creativeRenderer';

interface DraggableCanvasProps {
  layout: CreativeLayout;
  packshotDataUrl: string;
  logoDataUrl: string;
  headline: string;
  cta: string;
  additionalText?: string;
  onLayoutChange: (newLayout: CreativeLayout) => void;
}

interface DragState {
  isDragging: boolean;
  elementType: string | null;
  elementIndex: number | null;
  startX: number;
  startY: number;
  startPos: any;
  isResizing: boolean;
  resizeHandle: string | null;
}

export const DraggableCanvas = ({
  layout,
  packshotDataUrl,
  logoDataUrl,
  headline,
  cta,
  additionalText,
  onLayoutChange,
}: DraggableCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    elementType: null,
    elementIndex: null,
    startX: 0,
    startY: 0,
    startPos: null,
    isResizing: false,
    resizeHandle: null,
  });
  const [scale, setScale] = useState(1);
  const [preview, setPreview] = useState('');
  const [hoveredElement, setHoveredElement] = useState<{ type: string; index?: number } | null>(null);

  useEffect(() => {
    renderCanvas();
  }, [layout]);

  useEffect(() => {
    drawOverlay();
  }, [preview, hoveredElement, dragState, scale]);

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
    const dataUrl = await renderCreative(layout, packshotDataUrl, logoDataUrl, headline, cta, additionalText);
    setPreview(dataUrl);
  };

  const drawOverlay = () => {
    if (!overlayRef.current || !preview) return;

    const canvas = overlayRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = layout.width;
    canvas.height = layout.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const elementToDraw = hoveredElement ||
      (dragState.isDragging ? { type: dragState.elementType, index: dragState.elementIndex } : null);

    if (!elementToDraw) return;

    let bounds: { x: number; y: number; width: number; height: number } | null = null;

    if (elementToDraw.type === 'packshot') {
      bounds = {
        x: layout.packshot.x - layout.packshot.width / 2,
        y: layout.packshot.y - layout.packshot.height / 2,
        width: layout.packshot.width,
        height: layout.packshot.height,
      };
    } else if (elementToDraw.type === 'logo') {
      bounds = {
        x: layout.logo.x,
        y: layout.logo.y,
        width: layout.logo.width,
        height: layout.logo.height,
      };
    } else if (elementToDraw.type === 'headline') {
      bounds = {
        x: layout.headline.x,
        y: layout.headline.y,
        width: layout.headline.width,
        height: layout.headline.height,
      };
    } else if (elementToDraw.type === 'cta') {
      bounds = {
        x: layout.cta.x,
        y: layout.cta.y,
        width: layout.cta.width,
        height: layout.cta.height,
      };
    } else if (elementToDraw.type === 'additionalText' && layout.additionalText) {
      bounds = {
        x: layout.additionalText.x,
        y: layout.additionalText.y,
        width: layout.additionalText.width,
        height: layout.additionalText.height,
      };
    } else if (elementToDraw.type === 'decoration' && elementToDraw.index !== undefined) {
      const deco = layout.decorations[elementToDraw.index];
      bounds = {
        x: deco.position.x - deco.position.width / 2,
        y: deco.position.y - deco.position.height / 2,
        width: deco.position.width,
        height: deco.position.height,
      };
    }

    if (bounds) {
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);

      const handleSize = 8;
      ctx.fillStyle = '#3B82F6';
      ctx.setLineDash([]);

      const handles = [
        { x: bounds.x, y: bounds.y },
        { x: bounds.x + bounds.width, y: bounds.y },
        { x: bounds.x, y: bounds.y + bounds.height },
        { x: bounds.x + bounds.width, y: bounds.y + bounds.height },
      ];

      handles.forEach((handle) => {
        ctx.fillRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize);
      });
    }
  };

  const getMousePos = (e: React.MouseEvent): { x: number; y: number } => {
    if (!overlayRef.current) return { x: 0, y: 0 };
    const rect = overlayRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale,
    };
  };

  const getResizeHandleAtPos = (
    x: number,
    y: number,
    bounds: { x: number; y: number; width: number; height: number }
  ): string | null => {
    const handleSize = 12;
    const handles = [
      { name: 'top-left', x: bounds.x, y: bounds.y },
      { name: 'top-right', x: bounds.x + bounds.width, y: bounds.y },
      { name: 'bottom-left', x: bounds.x, y: bounds.y + bounds.height },
      { name: 'bottom-right', x: bounds.x + bounds.width, y: bounds.y + bounds.height },
    ];

    for (const handle of handles) {
      if (
        x >= handle.x - handleSize / 2 &&
        x <= handle.x + handleSize / 2 &&
        y >= handle.y - handleSize / 2 &&
        y <= handle.y + handleSize / 2
      ) {
        return handle.name;
      }
    }
    return null;
  };

  const getElementAtPos = (
    x: number,
    y: number
  ): { type: string; index?: number; handle?: string } | null => {
    const elements = [
      { type: 'packshot', pos: { x: layout.packshot.x - layout.packshot.width / 2, y: layout.packshot.y - layout.packshot.height / 2, width: layout.packshot.width, height: layout.packshot.height } },
      { type: 'logo', pos: { x: layout.logo.x, y: layout.logo.y, width: layout.logo.width, height: layout.logo.height } },
      { type: 'headline', pos: { x: layout.headline.x, y: layout.headline.y, width: layout.headline.width, height: layout.headline.height } },
      { type: 'cta', pos: { x: layout.cta.x, y: layout.cta.y, width: layout.cta.width, height: layout.cta.height } },
    ];

    if (layout.additionalText) {
      elements.push({
        type: 'additionalText',
        pos: { x: layout.additionalText.x, y: layout.additionalText.y, width: layout.additionalText.width, height: layout.additionalText.height },
      });
    }

    for (const elem of elements) {
      const handle = getResizeHandleAtPos(x, y, elem.pos);
      if (handle) {
        return { type: elem.type, handle };
      }
      if (
        x >= elem.pos.x &&
        x <= elem.pos.x + elem.pos.width &&
        y >= elem.pos.y &&
        y <= elem.pos.y + elem.pos.height
      ) {
        return { type: elem.type };
      }
    }

    for (let i = 0; i < layout.decorations.length; i++) {
      const deco = layout.decorations[i];
      const pos = {
        x: deco.position.x - deco.position.width / 2,
        y: deco.position.y - deco.position.height / 2,
        width: deco.position.width,
        height: deco.position.height,
      };

      const handle = getResizeHandleAtPos(x, y, pos);
      if (handle) {
        return { type: 'decoration', index: i, handle };
      }

      if (x >= pos.x && x <= pos.x + pos.width && y >= pos.y && y <= pos.y + pos.height) {
        return { type: 'decoration', index: i };
      }
    }

    return null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getMousePos(e);
    const element = getElementAtPos(pos.x, pos.y);

    if (element) {
      let startPos = null;
      if (element.type === 'decoration' && element.index !== undefined) {
        startPos = { ...layout.decorations[element.index].position };
      } else if (element.type === 'packshot') {
        startPos = { ...layout.packshot };
      } else if (element.type === 'logo') {
        startPos = { ...layout.logo };
      } else if (element.type === 'headline') {
        startPos = { ...layout.headline };
      } else if (element.type === 'cta') {
        startPos = { ...layout.cta };
      } else if (element.type === 'additionalText' && layout.additionalText) {
        startPos = { ...layout.additionalText };
      }

      setDragState({
        isDragging: true,
        elementType: element.type,
        elementIndex: element.index ?? null,
        startX: pos.x,
        startY: pos.y,
        startPos,
        isResizing: !!element.handle,
        resizeHandle: element.handle || null,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const pos = getMousePos(e);

    if (!dragState.isDragging) {
      const element = getElementAtPos(pos.x, pos.y);
      setHoveredElement(element);
      return;
    }

    if (!dragState.startPos) return;

    const deltaX = pos.x - dragState.startX;
    const deltaY = pos.y - dragState.startY;
    const newLayout = { ...layout };

    if (dragState.isResizing && dragState.resizeHandle) {
      if (dragState.elementType === 'packshot') {
        const newWidth = Math.max(50, dragState.startPos.width + deltaX);
        const newHeight = Math.max(50, dragState.startPos.height + deltaY);
        newLayout.packshot = { ...newLayout.packshot, width: newWidth, height: newHeight };
      } else if (dragState.elementType === 'logo') {
        const newWidth = Math.max(30, dragState.startPos.width + deltaX);
        const newHeight = Math.max(30, dragState.startPos.height + deltaY);
        newLayout.logo = { ...newLayout.logo, width: newWidth, height: newHeight };
      } else if (dragState.elementType === 'decoration' && dragState.elementIndex !== null) {
        const deco = { ...newLayout.decorations[dragState.elementIndex] };
        deco.position.width = Math.max(20, dragState.startPos.width + deltaX);
        deco.position.height = Math.max(20, dragState.startPos.height + deltaY);
        newLayout.decorations[dragState.elementIndex] = deco;
      }
    } else {
      if (dragState.elementType === 'decoration' && dragState.elementIndex !== null) {
        const deco = { ...newLayout.decorations[dragState.elementIndex] };
        deco.position = {
          ...deco.position,
          x: Math.max(deco.position.width / 2, Math.min(layout.width - deco.position.width / 2, dragState.startPos.x + deltaX)),
          y: Math.max(deco.position.height / 2, Math.min(layout.height - deco.position.height / 2, dragState.startPos.y + deltaY)),
        };
        newLayout.decorations[dragState.elementIndex] = deco;
      } else if (dragState.elementType === 'packshot') {
        const centerX = dragState.startPos.x + dragState.startPos.width / 2 + deltaX;
        const centerY = dragState.startPos.y + dragState.startPos.height / 2 + deltaY;
        newLayout.packshot = { ...newLayout.packshot, x: centerX, y: centerY };
      } else if (dragState.elementType === 'logo') {
        newLayout.logo = { ...newLayout.logo, x: dragState.startPos.x + deltaX, y: dragState.startPos.y + deltaY };
      } else if (dragState.elementType === 'headline') {
        newLayout.headline = { ...newLayout.headline, x: dragState.startPos.x + deltaX, y: dragState.startPos.y + deltaY };
      } else if (dragState.elementType === 'cta') {
        newLayout.cta = { ...newLayout.cta, x: dragState.startPos.x + deltaX, y: dragState.startPos.y + deltaY };
      } else if (dragState.elementType === 'additionalText' && layout.additionalText) {
        newLayout.additionalText = { ...newLayout.additionalText, x: dragState.startPos.x + deltaX, y: dragState.startPos.y + deltaY };
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
      resizeHandle: null,
    });
  };

  const handleMouseLeave = () => {
    setHoveredElement(null);
    if (dragState.isDragging) {
      handleMouseUp();
    }
  };

  return (
    <div ref={containerRef} className="relative bg-white rounded-lg overflow-hidden">
      <div className="p-4 relative">
        <div className="relative inline-block">
          {preview && (
            <img
              src={preview}
              alt="Canvas"
              className="max-w-full h-auto rounded"
              style={{ width: layout.width * scale, height: layout.height * scale }}
            />
          )}
          <canvas
            ref={overlayRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className="absolute top-0 left-0 cursor-move"
            style={{ width: layout.width * scale, height: layout.height * scale }}
          />
        </div>
      </div>
      <div className="absolute bottom-4 right-4 bg-gray-800 text-white text-xs px-2 py-1 rounded">
        Drag to move · Drag corner handles to resize
      </div>
    </div>
  );
};
