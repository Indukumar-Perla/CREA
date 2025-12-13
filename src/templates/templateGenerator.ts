import { AspectRatio, CreativeLayout, TemplateFamily, ColorPalette, AdvertisingCategory } from '../types';
import { generateContextualElements } from '../utils/elementGenerator';

const getCanvasDimensions = (ratio: AspectRatio): { width: number; height: number } => {
  switch (ratio) {
    case '1:1':
      return { width: 1080, height: 1080 };
    case '9:16':
      return { width: 1080, height: 1920 };
    case '1.91:1':
      return { width: 1200, height: 628 };
  }
};

const getTextureByCategory = (category: AdvertisingCategory): 'dots' | 'lines' | 'grid' | 'noise' | 'waves' | 'none' => {
  switch (category) {
    case 'product-based':
      return 'dots';
    case 'service-based':
      return 'lines';
    case 'brand-awareness':
      return 'grid';
    case 'lifestyle':
      return 'waves';
    default:
      return 'dots';
  }
};

const createCleanMinimalLayout = (
  ratio: AspectRatio,
  palette: ColorPalette,
  category: AdvertisingCategory,
  additionalText?: string
): Omit<CreativeLayout, 'ratio' | 'width' | 'height'> => {
  const { width, height } = getCanvasDimensions(ratio);
  const margin = width * 0.08;

  if (ratio === '1:1') {
    const layout: any = {
      template: 'clean-minimal',
      background: palette.background,
      backgroundTexture: getTextureByCategory(category),
      packshot: { x: width * 0.5, y: height * 0.4, width: width * 0.5, height: width * 0.5 },
      logo: { x: margin, y: margin, width: width * 0.15, height: width * 0.15 },
      headline: {
        x: margin,
        y: height * 0.75,
        width: width - margin * 2,
        height: 80,
        fontSize: 42,
        color: palette.accent,
      },
      cta: {
        x: margin,
        y: height * 0.88,
        width: width * 0.35,
        height: 50,
        fontSize: 24,
        color: '#FFFFFF',
      },
      decorations: [
        {
          type: 'circle',
          position: { x: width * 0.85, y: height * 0.15, width: width * 0.2, height: width * 0.2 },
          color: palette.secondary,
        },
      ],
    };

    if (additionalText) {
      layout.additionalText = {
        x: margin,
        y: height * 0.82,
        width: width - margin * 2,
        height: 40,
        fontSize: 22,
        color: palette.primary,
        text: additionalText,
      };
    }

    return layout;
  } else if (ratio === '9:16') {
    const layout: any = {
      template: 'clean-minimal',
      background: palette.background,
      backgroundTexture: getTextureByCategory(category),
      packshot: { x: width * 0.5, y: height * 0.35, width: width * 0.7, height: width * 0.7 },
      logo: { x: margin, y: margin, width: width * 0.2, height: width * 0.2 },
      headline: {
        x: margin,
        y: height * 0.6,
        width: width - margin * 2,
        height: 100,
        fontSize: 48,
        color: palette.accent,
      },
      cta: {
        x: margin,
        y: height * 0.85,
        width: width * 0.4,
        height: 60,
        fontSize: 28,
        color: '#FFFFFF',
      },
      decorations: [
        {
          type: 'rectangle',
          position: { x: width * 0.1, y: height * 0.75, width: width * 0.8, height: 4 },
          color: palette.primary,
        },
      ],
    };

    if (additionalText) {
      layout.additionalText = {
        x: margin,
        y: height * 0.72,
        width: width - margin * 2,
        height: 50,
        fontSize: 26,
        color: palette.primary,
        text: additionalText,
      };
    }

    return layout;
  } else {
    const layout: any = {
      template: 'clean-minimal',
      background: palette.background,
      backgroundTexture: getTextureByCategory(category),
      packshot: { x: width * 0.75, y: height * 0.5, width: height * 0.6, height: height * 0.6 },
      logo: { x: margin, y: margin, width: height * 0.15, height: height * 0.15 },
      headline: {
        x: margin,
        y: height * 0.35,
        width: width * 0.45,
        height: 70,
        fontSize: 38,
        color: palette.accent,
      },
      cta: {
        x: margin,
        y: height * 0.65,
        width: width * 0.25,
        height: 50,
        fontSize: 24,
        color: '#FFFFFF',
      },
      decorations: [
        {
          type: 'line',
          position: { x: margin, y: height * 0.58, width: width * 0.35, height: 3 },
          color: palette.primary,
        },
      ],
    };

    if (additionalText) {
      layout.additionalText = {
        x: margin,
        y: height * 0.5,
        width: width * 0.45,
        height: 35,
        fontSize: 20,
        color: palette.primary,
        text: additionalText,
      };
    }

    return layout;
  }
};

const createBoldDynamicLayout = (
  ratio: AspectRatio,
  palette: ColorPalette,
  category: AdvertisingCategory,
  additionalText?: string
): Omit<CreativeLayout, 'ratio' | 'width' | 'height'> => {
  const { width, height } = getCanvasDimensions(ratio);
  const margin = width * 0.06;

  if (ratio === '1:1') {
    const layout: any = {
      template: 'bold-dynamic',
      background: palette.primary,
      backgroundTexture: getTextureByCategory(category),
      packshot: { x: width * 0.65, y: height * 0.55, width: width * 0.55, height: width * 0.55 },
      logo: { x: margin, y: height - margin - width * 0.12, width: width * 0.12, height: width * 0.12 },
      headline: {
        x: margin,
        y: margin + 20,
        width: width * 0.5,
        height: 90,
        fontSize: 46,
        color: '#FFFFFF',
      },
      cta: {
        x: margin,
        y: height * 0.45,
        width: width * 0.35,
        height: 55,
        fontSize: 26,
        color: palette.background,
      },
      decorations: [
        {
          type: 'rectangle',
          position: { x: 0, y: height * 0.7, width: width * 0.45, height: height * 0.3 },
          color: palette.accent,
          rotation: -10,
        },
        {
          type: 'circle',
          position: { x: width * 0.1, y: height * 0.4, width: width * 0.15, height: width * 0.15 },
          color: palette.secondary,
        },
      ],
    };

    if (additionalText) {
      layout.additionalText = {
        x: margin,
        y: margin + 120,
        width: width * 0.5,
        height: 50,
        fontSize: 24,
        color: '#FFFFFF',
        text: additionalText,
      };
    }

    return layout;
  } else if (ratio === '9:16') {
    const layout: any = {
      template: 'bold-dynamic',
      background: palette.primary,
      backgroundTexture: getTextureByCategory(category),
      packshot: { x: width * 0.5, y: height * 0.6, width: width * 0.75, height: width * 0.75 },
      logo: { x: width - margin - width * 0.18, y: margin, width: width * 0.18, height: width * 0.18 },
      headline: {
        x: margin,
        y: height * 0.15,
        width: width - margin * 2,
        height: 110,
        fontSize: 52,
        color: '#FFFFFF',
      },
      cta: {
        x: margin,
        y: height * 0.88,
        width: width * 0.45,
        height: 65,
        fontSize: 30,
        color: palette.background,
      },
      decorations: [
        {
          type: 'rectangle',
          position: { x: width * 0.7, y: height * 0.3, width: width * 0.25, height: height * 0.15 },
          color: palette.secondary,
          rotation: 15,
        },
      ],
    };

    if (additionalText) {
      layout.additionalText = {
        x: margin,
        y: height * 0.28,
        width: width - margin * 2,
        height: 60,
        fontSize: 28,
        color: '#FFFFFF',
        text: additionalText,
      };
    }

    return layout;
  } else {
    const layout: any = {
      template: 'bold-dynamic',
      background: palette.primary,
      backgroundTexture: getTextureByCategory(category),
      packshot: { x: width * 0.7, y: height * 0.5, width: height * 0.7, height: height * 0.7 },
      logo: { x: width - margin - height * 0.13, y: margin, width: height * 0.13, height: height * 0.13 },
      headline: {
        x: margin,
        y: height * 0.25,
        width: width * 0.4,
        height: 80,
        fontSize: 42,
        color: '#FFFFFF',
      },
      cta: {
        x: margin,
        y: height * 0.6,
        width: width * 0.28,
        height: 55,
        fontSize: 26,
        color: palette.background,
      },
      decorations: [
        {
          type: 'circle',
          position: { x: width * 0.15, y: height * 0.15, width: height * 0.2, height: height * 0.2 },
          color: palette.secondary,
        },
      ],
    };

    if (additionalText) {
      layout.additionalText = {
        x: margin,
        y: height * 0.42,
        width: width * 0.4,
        height: 45,
        fontSize: 22,
        color: '#FFFFFF',
        text: additionalText,
      };
    }

    return layout;
  }
};

const createPremiumSoftLayout = (
  ratio: AspectRatio,
  palette: ColorPalette,
  category: AdvertisingCategory,
  additionalText?: string
): Omit<CreativeLayout, 'ratio' | 'width' | 'height'> => {
  const { width, height } = getCanvasDimensions(ratio);
  const margin = width * 0.1;

  if (ratio === '1:1') {
    const layout: any = {
      template: 'premium-soft',
      background: palette.background,
      backgroundTexture: getTextureByCategory(category),
      packshot: { x: width * 0.5, y: height * 0.45, width: width * 0.5, height: width * 0.5 },
      logo: { x: width - margin - width * 0.14, y: margin, width: width * 0.14, height: width * 0.14 },
      headline: {
        x: margin,
        y: height * 0.72,
        width: width - margin * 2,
        height: 75,
        fontSize: 40,
        color: palette.accent,
      },
      cta: {
        x: width * 0.5 - width * 0.18,
        y: height * 0.9,
        width: width * 0.36,
        height: 50,
        fontSize: 24,
        color: '#FFFFFF',
      },
      decorations: [
        {
          type: 'circle',
          position: { x: width * 0.15, y: height * 0.2, width: width * 0.25, height: width * 0.25 },
          color: palette.secondary,
        },
      ],
    };

    if (additionalText) {
      layout.additionalText = {
        x: margin,
        y: height * 0.82,
        width: width - margin * 2,
        height: 40,
        fontSize: 22,
        color: palette.primary,
        text: additionalText,
      };
    }

    return layout;
  } else if (ratio === '9:16') {
    const layout: any = {
      template: 'premium-soft',
      background: palette.background,
      backgroundTexture: getTextureByCategory(category),
      packshot: { x: width * 0.5, y: height * 0.4, width: width * 0.65, height: width * 0.65 },
      logo: { x: width * 0.5 - width * 0.1, y: margin, width: width * 0.2, height: width * 0.2 },
      headline: {
        x: margin,
        y: height * 0.65,
        width: width - margin * 2,
        height: 95,
        fontSize: 46,
        color: palette.accent,
      },
      cta: {
        x: width * 0.5 - width * 0.2,
        y: height * 0.88,
        width: width * 0.4,
        height: 60,
        fontSize: 28,
        color: '#FFFFFF',
      },
      decorations: [
        {
          type: 'circle',
          position: { x: width * 0.85, y: height * 0.25, width: width * 0.2, height: width * 0.2 },
          color: palette.secondary,
        },
      ],
    };

    if (additionalText) {
      layout.additionalText = {
        x: margin,
        y: height * 0.75,
        width: width - margin * 2,
        height: 50,
        fontSize: 26,
        color: palette.primary,
        text: additionalText,
      };
    }

    return layout;
  } else {
    const layout: any = {
      template: 'premium-soft',
      background: palette.background,
      backgroundTexture: getTextureByCategory(category),
      packshot: { x: width * 0.28, y: height * 0.5, width: height * 0.65, height: height * 0.65 },
      logo: { x: width - margin - height * 0.12, y: height - margin - height * 0.12, width: height * 0.12, height: height * 0.12 },
      headline: {
        x: width * 0.5,
        y: height * 0.3,
        width: width * 0.42,
        height: 75,
        fontSize: 40,
        color: palette.accent,
      },
      cta: {
        x: width * 0.5 + (width * 0.42 - width * 0.25) / 2,
        y: height * 0.65,
        width: width * 0.25,
        height: 50,
        fontSize: 24,
        color: '#FFFFFF',
      },
      decorations: [
        {
          type: 'rectangle',
          position: { x: width * 0.52, y: height * 0.58, width: width * 0.35, height: 2 },
          color: palette.primary,
        },
      ],
    };

    if (additionalText) {
      layout.additionalText = {
        x: width * 0.5,
        y: height * 0.47,
        width: width * 0.42,
        height: 35,
        fontSize: 20,
        color: palette.primary,
        text: additionalText,
      };
    }

    return layout;
  }
};

export const generateLayout = (
  ratio: AspectRatio,
  template: TemplateFamily,
  palette: ColorPalette,
  headline: string = '',
  decorativeImageUrls: string[] = [],
  category: AdvertisingCategory = 'product-based',
  additionalText?: string
): CreativeLayout => {
  const { width, height } = getCanvasDimensions(ratio);

  let layout;
  switch (template) {
    case 'clean-minimal':
      layout = createCleanMinimalLayout(ratio, palette, category, additionalText);
      break;
    case 'bold-dynamic':
      layout = createBoldDynamicLayout(ratio, palette, category, additionalText);
      break;
    case 'premium-soft':
      layout = createPremiumSoftLayout(ratio, palette, category, additionalText);
      break;
  }

  const baseLayout = {
    ratio,
    width,
    height,
    ...layout,
  };

  const contextualElements = generateContextualElements(headline, palette);
  const existingDecorations = baseLayout.decorations || [];

  const emojiDecorations = contextualElements.map((elem, idx) => ({
    type: 'emoji' as const,
    position: {
      x: width * (0.7 + (idx % 2) * 0.15),
      y: height * (0.15 + (idx % 3) * 0.25),
      width: Math.min(width, height) * 0.06,
      height: Math.min(width, height) * 0.06,
      isDraggable: true,
    },
    color: elem.color,
    content: elem.content,
  }));

  const imageDecorations = decorativeImageUrls.map((imageUrl, idx) => {
    const positions = [
      { x: width * 0.08, y: height * 0.1, w: width * 0.12, h: width * 0.12 },
      { x: width * 0.85, y: height * 0.15, w: width * 0.15, h: width * 0.15 },
      { x: width * 0.1, y: height * 0.75, w: width * 0.1, h: width * 0.1 },
      { x: width * 0.82, y: height * 0.7, w: width * 0.14, h: width * 0.14 },
    ];

    const pos = positions[idx % positions.length];

    return {
      type: 'image' as const,
      position: {
        x: pos.x,
        y: pos.y,
        width: pos.w,
        height: pos.h,
        isDraggable: true,
      },
      color: '#FFFFFF',
      imageDataUrl: imageUrl,
      opacity: 0.85,
    };
  });

  const combinedDecorations = [
    ...existingDecorations,
    ...emojiDecorations,
    ...imageDecorations,
  ];

  return {
    ...baseLayout,
    packshot: { ...baseLayout.packshot, isDraggable: true },
    logo: { ...baseLayout.logo, isDraggable: true },
    headline: { ...baseLayout.headline, isDraggable: true },
    cta: { ...baseLayout.cta, isDraggable: true },
    ...(baseLayout.additionalText && { additionalText: { ...baseLayout.additionalText, isDraggable: true } }),
    decorations: combinedDecorations,
  };
};

export const templateNames: Record<TemplateFamily, string> = {
  'clean-minimal': 'Clean Minimal',
  'bold-dynamic': 'Bold Dynamic',
  'premium-soft': 'Premium Soft',
};
