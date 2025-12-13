import { useState } from 'react';
import { InputForm } from './components/InputForm';
import { LoadingState } from './components/LoadingState';
import { CreativeEditor } from './components/CreativeEditor';
import { CreativeInputs, GeneratedCreative, ColorPalette, TemplateFamily } from './types';
import { extractDominantColors, generateColorPalette } from './utils/colorExtractor';
import { removeBackground, loadImageAsDataUrl } from './utils/imageProcessor';
import { generateLayout } from './templates/templateGenerator';
import { renderCreative } from './utils/creativeRenderer';

type AppState = 'input' | 'generating' | 'editing';

function App() {
  const [appState, setAppState] = useState<AppState>('input');
  const [inputs, setInputs] = useState<CreativeInputs>({
    packshot: null,
    logo: null,
    decorativeElements: [],
    headline: '',
    cta: '',
    additionalText: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#93C5FD',
    selectedRatios: [],
    advertisingCategory: 'product-based',
  });
  const [generatedCreatives, setGeneratedCreatives] = useState<GeneratedCreative[]>([]);
  const [packshotDataUrl, setPackshotDataUrl] = useState('');
  const [logoDataUrl, setLogoDataUrl] = useState('');
  const [decorativeElementsDataUrls, setDecorativeElementsDataUrls] = useState<string[]>([]);
  const [colorPalette, setColorPalette] = useState<ColorPalette>({
    primary: '#3B82F6',
    secondary: '#93C5FD',
    accent: '#1E40AF',
    background: '#EFF6FF',
  });

  const handleInputChange = (newInputs: Partial<CreativeInputs>) => {
    setInputs((prev) => ({ ...prev, ...newInputs }));
  };

  const handleGenerate = async () => {
    if (!inputs.packshot || !inputs.logo || inputs.decorativeElements.length === 0) return;

    setAppState('generating');

    try {
      const packshotProcessed = await removeBackground(inputs.packshot);
      const logoProcessed = await removeBackground(inputs.logo);

      const decorativeUrls = await Promise.all(
        inputs.decorativeElements.map((elem) => removeBackground(elem))
      );

      setPackshotDataUrl(packshotProcessed);
      setLogoDataUrl(logoProcessed);
      setDecorativeElementsDataUrls(decorativeUrls);

      let primaryColor = inputs.primaryColor;
      let secondaryColor = inputs.secondaryColor;

      if (primaryColor === '#3B82F6') {
        const extractedColors = await extractDominantColors(inputs.logo);
        primaryColor = extractedColors[0] || '#3B82F6';
        secondaryColor = extractedColors[1] || '#93C5FD';
      }

      const palette = generateColorPalette(primaryColor);
      palette.secondary = secondaryColor;
      setColorPalette(palette);

      const templates: TemplateFamily[] = ['clean-minimal', 'bold-dynamic', 'premium-soft'];
      const creatives: GeneratedCreative[] = [];

      for (const ratio of inputs.selectedRatios) {
        const template = templates[Math.floor(Math.random() * templates.length)];
        const layout = generateLayout(
          ratio,
          template,
          palette,
          inputs.headline,
          decorativeUrls,
          inputs.advertisingCategory,
          inputs.additionalText
        );

        const dataUrl = await renderCreative(
          layout,
          packshotProcessed,
          logoProcessed,
          inputs.headline,
          inputs.cta,
          inputs.additionalText
        );

        creatives.push({
          ratio,
          layout,
          dataUrl,
        });
      }

      setGeneratedCreatives(creatives);
      setAppState('editing');
    } catch (error) {
      console.error('Error generating creatives:', error);
      setAppState('input');
    }
  };

  const handleBack = () => {
    setAppState('input');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {appState === 'input' && (
        <div className="py-12 px-4">
          <InputForm
            inputs={inputs}
            onInputChange={handleInputChange}
            onGenerate={handleGenerate}
            isGenerating={false}
          />
        </div>
      )}

      {appState === 'generating' && <LoadingState />}

      {appState === 'editing' && (
        <CreativeEditor
          creatives={generatedCreatives}
          packshotDataUrl={packshotDataUrl}
          logoDataUrl={logoDataUrl}
          headline={inputs.headline}
          cta={inputs.cta}
          additionalText={inputs.additionalText}
          brandColor={colorPalette.primary}
          colorPalette={colorPalette}
          advertisingCategory={inputs.advertisingCategory}
          onBack={handleBack}
        />
      )}
    </div>
  );
}

export default App;
