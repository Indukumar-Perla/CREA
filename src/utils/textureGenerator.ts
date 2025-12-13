export type TextureType = 'dots' | 'lines' | 'grid' | 'noise' | 'waves' | 'none';

export const generateTexturedBackground = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  baseColor: string,
  textureType: TextureType
): void => {
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, width, height);

  if (textureType === 'none') return;

  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  switch (textureType) {
    case 'dots':
      generateDotsTexture(tempCanvas, tempCtx, width, height, baseColor);
      break;
    case 'lines':
      generateLinesTexture(tempCanvas, tempCtx, width, height, baseColor);
      break;
    case 'grid':
      generateGridTexture(tempCanvas, tempCtx, width, height, baseColor);
      break;
    case 'noise':
      generateNoiseTexture(tempCanvas, tempCtx, width, height);
      break;
    case 'waves':
      generateWavesTexture(tempCanvas, tempCtx, width, height, baseColor);
      break;
  }

  ctx.drawImage(tempCanvas, 0, 0);
};

const generateDotsTexture = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  baseColor: string
): void => {
  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, width, height);

  const dotSize = 4;
  const spacing = 20;
  const overlayColor = adjustColorBrightness(baseColor, -15);

  ctx.fillStyle = overlayColor;
  ctx.globalAlpha = 0.3;

  for (let x = 0; x < width; x += spacing) {
    for (let y = 0; y < height; y += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, dotSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.globalAlpha = 1;
};

const generateLinesTexture = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  baseColor: string
): void => {
  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, width, height);

  const lineWidth = 2;
  const spacing = 15;
  const overlayColor = adjustColorBrightness(baseColor, -20);

  ctx.strokeStyle = overlayColor;
  ctx.lineWidth = lineWidth;
  ctx.globalAlpha = 0.2;

  for (let y = 0; y < height; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
};

const generateGridTexture = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  baseColor: string
): void => {
  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, width, height);

  const lineWidth = 1;
  const spacing = 30;
  const overlayColor = adjustColorBrightness(baseColor, -25);

  ctx.strokeStyle = overlayColor;
  ctx.lineWidth = lineWidth;
  ctx.globalAlpha = 0.25;

  for (let x = 0; x < width; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y < height; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
};

const generateNoiseTexture = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void => {
  canvas.width = width;
  canvas.height = height;

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const noise = Math.random() * 50;
    data[i] = noise;
    data[i + 1] = noise;
    data[i + 2] = noise;
    data[i + 3] = 25;
  }

  ctx.putImageData(imageData, 0, 0);
};

const generateWavesTexture = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  baseColor: string
): void => {
  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, width, height);

  const overlayColor = adjustColorBrightness(baseColor, -15);
  ctx.strokeStyle = overlayColor;
  ctx.lineWidth = 3;
  ctx.globalAlpha = 0.2;

  const waveCount = 8;
  const amplitude = 40;
  const frequency = 0.02;

  for (let i = 0; i < waveCount; i++) {
    ctx.beginPath();
    const yOffset = (height / waveCount) * i;

    for (let x = 0; x < width; x += 5) {
      const y = yOffset + Math.sin(x * frequency + i) * amplitude;
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
};

const adjustColorBrightness = (color: string, amount: number): string => {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + amount));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};
