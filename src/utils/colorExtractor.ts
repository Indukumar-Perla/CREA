import { ColorPalette } from '../types';

export const extractDominantColors = async (
  imageFile: File
): Promise<string[]> => {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(['#3B82F6']);
          return;
        }

        const size = 50;
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);

        const imageData = ctx.getImageData(0, 0, size, size);
        const pixels = imageData.data;
        const colorMap: { [key: string]: number } = {};

        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];

          if (a < 128) continue;

          const brightness = (r + g + b) / 3;
          if (brightness > 250 || brightness < 20) continue;

          const roundedR = Math.round(r / 10) * 10;
          const roundedG = Math.round(g / 10) * 10;
          const roundedB = Math.round(b / 10) * 10;
          const key = `${roundedR},${roundedG},${roundedB}`;

          colorMap[key] = (colorMap[key] || 0) + 1;
        }

        const sortedColors = Object.entries(colorMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([rgb]) => {
            const [r, g, b] = rgb.split(',').map(Number);
            return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
          });

        resolve(sortedColors.length > 0 ? sortedColors : ['#3B82F6']);
      };
      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(imageFile);
  });
};

export const generateColorPalette = (brandColor: string): ColorPalette => {
  const hex = brandColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const lighten = (color: number, amount: number) =>
    Math.min(255, Math.floor(color + (255 - color) * amount));
  const darken = (color: number, amount: number) =>
    Math.max(0, Math.floor(color * (1 - amount)));

  const toHex = (r: number, g: number, b: number) =>
    `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

  return {
    primary: brandColor,
    secondary: toHex(lighten(r, 0.3), lighten(g, 0.3), lighten(b, 0.3)),
    accent: toHex(darken(r, 0.2), darken(g, 0.2), darken(b, 0.2)),
    background: toHex(lighten(r, 0.8), lighten(g, 0.8), lighten(b, 0.8)),
  };
};
