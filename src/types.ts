export type AspectRatio = '1:1' | '9:16' | '1.91:1';

export type TemplateFamily = 'clean-minimal' | 'bold-dynamic' | 'premium-soft';

export interface CreativeInputs {
  packshot: File | null;
  logo: File | null;
  decorativeElements: File[];
  headline: string;
  cta: string;
  brandColor: string;
  selectedRatios: AspectRatio[];
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

export interface ElementPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CreativeLayout {
  ratio: AspectRatio;
  width: number;
  height: number;
  template: TemplateFamily;
  background: string;
  packshot: ElementPosition & { isDraggable?: boolean };
  logo: ElementPosition & { isDraggable?: boolean };
  headline: ElementPosition & { fontSize: number; color: string; isDraggable?: boolean };
  cta: ElementPosition & { fontSize: number; color: string; isDraggable?: boolean };
  decorations: Array<{
    type: 'circle' | 'rectangle' | 'line' | 'emoji' | 'image';
    position: ElementPosition & { isDraggable?: boolean };
    color: string;
    rotation?: number;
    content?: string;
    imageDataUrl?: string;
    opacity?: number;
  }>;
}

export interface GeneratedCreative {
  ratio: AspectRatio;
  layout: CreativeLayout;
  dataUrl: string;
}

export interface EditorState {
  creatives: GeneratedCreative[];
  selectedRatioIndex: number;
  isEditing: boolean;
  brandColor: string;
  colorPalette: ColorPalette;
}
