export type AspectRatio = '1:1' | '9:16' | '1.91:1';

export type TemplateFamily = 'clean-minimal' | 'bold-dynamic' | 'premium-soft';

export type AdvertisingCategory = 'product-based' | 'service-based' | 'brand-awareness' | 'lifestyle';

export interface CreativeInputs {
  packshot: File | null;
  logo: File | null;
  decorativeElements: File[];
  headline: string;
  cta: string;
  additionalText: string;
  primaryColor: string;
  secondaryColor: string;
  selectedRatios: AspectRatio[];
  advertisingCategory: AdvertisingCategory;
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
  backgroundTexture?: 'dots' | 'lines' | 'grid' | 'noise' | 'waves' | 'none';
  packshot: ElementPosition & { isDraggable?: boolean };
  logo: ElementPosition & { isDraggable?: boolean };
  headline: ElementPosition & { fontSize: number; color: string; isDraggable?: boolean };
  cta: ElementPosition & { fontSize: number; color: string; isDraggable?: boolean };
  additionalText?: ElementPosition & { fontSize: number; color: string; isDraggable?: boolean; text: string };
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
