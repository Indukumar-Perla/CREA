export const removeBackground = async (imageFile: File): Promise<string> => {
  const apiKey = 'AjdKZ1quEjNiE4xspEXvNo4r';

  try {
    const formData = new FormData();
    formData.append('image_file', imageFile);
    formData.append('size', 'auto');
    formData.append('format', 'PNG');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      console.warn('Remove.bg API failed, falling back to local processing');
      return removeBackgroundLocal(imageFile);
    }

    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn('Remove.bg API error, falling back to local processing:', error);
    return removeBackgroundLocal(imageFile);
  }
};

const removeBackgroundLocal = async (imageFile: File): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve('');
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        const cornerSamples = [
          { x: 0, y: 0 },
          { x: canvas.width - 1, y: 0 },
          { x: 0, y: canvas.height - 1 },
          { x: canvas.width - 1, y: canvas.height - 1 },
        ];

        let bgR = 0,
          bgG = 0,
          bgB = 0;
        cornerSamples.forEach((sample) => {
          const idx = (sample.y * canvas.width + sample.x) * 4;
          bgR += pixels[idx];
          bgG += pixels[idx + 1];
          bgB += pixels[idx + 2];
        });
        bgR = Math.floor(bgR / cornerSamples.length);
        bgG = Math.floor(bgG / cornerSamples.length);
        bgB = Math.floor(bgB / cornerSamples.length);

        const threshold = 40;

        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];

          const diffR = Math.abs(r - bgR);
          const diffG = Math.abs(g - bgG);
          const diffB = Math.abs(b - bgB);

          if (diffR < threshold && diffG < threshold && diffB < threshold) {
            pixels[i + 3] = 0;
          }
        }

        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(imageFile);
  });
};

export const loadImageAsDataUrl = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.readAsDataURL(file);
  });
};

export const compressImage = async (
  dataUrl: string,
  maxSizeKB: number = 500
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      let quality = 0.9;
      const tryCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(dataUrl);
              return;
            }

            if (blob.size <= maxSizeKB * 1024 || quality <= 0.1) {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            } else {
              quality -= 0.1;
              tryCompress();
            }
          },
          'image/jpeg',
          quality
        );
      };

      tryCompress();
    };
    img.src = dataUrl;
  });
};
