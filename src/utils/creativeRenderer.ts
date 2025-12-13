import { CreativeLayout } from '../types';

export const renderCreative = async (
  layout: CreativeLayout,
  packshotDataUrl: string,
  logoDataUrl: string,
  headline: string,
  cta: string
): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve('');
      return;
    }

    canvas.width = layout.width;
    canvas.height = layout.height;

    const packshot = new Image();
    const logo = new Image();
    const decorativeImages: { [key: number]: HTMLImageElement } = {};
    let loadedImages = 0;
    let totalImages = 2;

    const decorImageIndexes = layout.decorations
      .map((d, idx) => (d.type === 'image' ? idx : null))
      .filter((idx) => idx !== null) as number[];

    totalImages += decorImageIndexes.length;

    const checkAndRender = () => {
      loadedImages++;
      if (loadedImages === totalImages) {
        renderToCanvas();
      }
    };

    const renderToCanvas = () => {
      if (layout.background.startsWith('linear-gradient') || layout.background.startsWith('radial-gradient')) {
        const gradient = parseGradient(layout.background, ctx, canvas.width, canvas.height);
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = layout.background;
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      layout.decorations.forEach((decoration) => {
        ctx.save();
        if (decoration.rotation) {
          const centerX = decoration.position.x;
          const centerY = decoration.position.y;
          ctx.translate(centerX, centerY);
          ctx.rotate((decoration.rotation * Math.PI) / 180);
          ctx.translate(-centerX, -centerY);
        }

        ctx.fillStyle = decoration.color;
        ctx.globalAlpha = 0.6;

        if (decoration.type === 'circle') {
          ctx.beginPath();
          ctx.arc(
            decoration.position.x,
            decoration.position.y,
            decoration.position.width / 2,
            0,
            2 * Math.PI
          );
          ctx.fill();
        } else if (decoration.type === 'rectangle') {
          ctx.fillRect(
            decoration.position.x - decoration.position.width / 2,
            decoration.position.y - decoration.position.height / 2,
            decoration.position.width,
            decoration.position.height
          );
        } else if (decoration.type === 'line') {
          ctx.fillRect(
            decoration.position.x,
            decoration.position.y,
            decoration.position.width,
            decoration.position.height
          );
        } else if (decoration.type === 'emoji' && decoration.content) {
          ctx.globalAlpha = 1;
          ctx.font = `${decoration.position.width * 1.2}px Arial, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            decoration.content,
            decoration.position.x,
            decoration.position.y
          );
        } else if (decoration.type === 'image') {
          ctx.globalAlpha = decoration.opacity ?? 0.85;
          const decorIdx = layout.decorations.indexOf(decoration);
          const decoImg = decorativeImages[decorIdx];
          if (decoImg && decoImg.complete) {
            ctx.drawImage(
              decoImg,
              decoration.position.x - decoration.position.width / 2,
              decoration.position.y - decoration.position.height / 2,
              decoration.position.width,
              decoration.position.height
            );
          }
        }

        ctx.restore();
      });

      ctx.globalAlpha = 1;
      const psWidth = layout.packshot.width;
      const psHeight = layout.packshot.height;
      const aspectRatio = packshot.width / packshot.height;
      let drawWidth = psWidth;
      let drawHeight = psHeight;

      if (aspectRatio > 1) {
        drawHeight = psWidth / aspectRatio;
      } else {
        drawWidth = psHeight * aspectRatio;
      }

      ctx.drawImage(
        packshot,
        layout.packshot.x - drawWidth / 2,
        layout.packshot.y - drawHeight / 2,
        drawWidth,
        drawHeight
      );

      const logoAspectRatio = logo.width / logo.height;
      let logoDrawWidth = layout.logo.width;
      let logoDrawHeight = layout.logo.height;

      if (logoAspectRatio > 1) {
        logoDrawHeight = layout.logo.width / logoAspectRatio;
      } else {
        logoDrawWidth = layout.logo.height * logoAspectRatio;
      }

      ctx.drawImage(logo, layout.logo.x, layout.logo.y, logoDrawWidth, logoDrawHeight);

      ctx.font = `bold ${layout.headline.fontSize}px Arial, sans-serif`;
      ctx.fillStyle = layout.headline.color;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      wrapText(
        ctx,
        headline.toUpperCase(),
        layout.headline.x,
        layout.headline.y,
        layout.headline.width,
        layout.headline.fontSize * 1.2
      );

      if (cta) {
        ctx.fillStyle = layout.cta.color === '#FFFFFF' ? layout.headline.color : layout.cta.color;
        ctx.fillRect(
          layout.cta.x,
          layout.cta.y,
          layout.cta.width,
          layout.cta.height
        );

        ctx.font = `bold ${layout.cta.fontSize}px Arial, sans-serif`;
        ctx.fillStyle = layout.cta.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          cta.toUpperCase(),
          layout.cta.x + layout.cta.width / 2,
          layout.cta.y + layout.cta.height / 2
        );
      }

      resolve(canvas.toDataURL('image/png'));
    };

    packshot.onload = checkAndRender;
    logo.onload = checkAndRender;

    decorImageIndexes.forEach((decorIdx) => {
      const decoration = layout.decorations[decorIdx];
      if (decoration.imageDataUrl) {
        const decorImg = new Image();
        decorImg.onload = checkAndRender;
        decorImg.src = decoration.imageDataUrl;
        decorativeImages[decorIdx] = decorImg;
      }
    });

    packshot.src = packshotDataUrl;
    logo.src = logoDataUrl;
  });
};

const parseGradient = (
  gradientString: string,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): CanvasGradient => {
  const isLinear = gradientString.startsWith('linear-gradient');
  const colorMatch = gradientString.match(/#[0-9A-Fa-f]{6}/g) || [];
  const colors = colorMatch.length >= 2 ? colorMatch : ['#3B82F6', '#1E40AF'];

  if (isLinear) {
    const angleMatch = gradientString.match(/(\d+)deg/);
    const angle = angleMatch ? parseInt(angleMatch[1]) : 135;
    const radians = ((angle - 90) * Math.PI) / 180;
    const x1 = width / 2 - (Math.cos(radians) * width) / 2;
    const y1 = height / 2 - (Math.sin(radians) * height) / 2;
    const x2 = width / 2 + (Math.cos(radians) * width) / 2;
    const y2 = height / 2 + (Math.sin(radians) * height) / 2;
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    return gradient;
  } else {
    const gradient = ctx.createRadialGradient(
      width * 0.5,
      height * 0.5,
      0,
      width * 0.5,
      height * 0.5,
      Math.max(width, height) * 0.7
    );
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    return gradient;
  }
};

const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) => {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && i > 0) {
      ctx.fillText(line, x, currentY);
      line = words[i] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
};
