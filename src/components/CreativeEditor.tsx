import { useState, useEffect } from 'react';
import { Download, Edit3, Palette, Layout, RotateCw, Trash2 } from 'lucide-react';
import { GeneratedCreative, TemplateFamily, ColorPalette, CreativeLayout, AdvertisingCategory } from '../types';
import { generateLayout, templateNames } from '../templates/templateGenerator';
import { renderCreative } from '../utils/creativeRenderer';
import { compressImage } from '../utils/imageProcessor';
import { DraggableCanvas } from './DraggableCanvas';

interface CreativeEditorProps {
  creatives: GeneratedCreative[];
  packshotDataUrl: string;
  logoDataUrl: string;
  headline: string;
  cta: string;
  additionalText: string;
  brandColor: string;
  colorPalette: ColorPalette;
  advertisingCategory: AdvertisingCategory;
  onBack: () => void;
}

export const CreativeEditor = ({
  creatives: initialCreatives,
  packshotDataUrl,
  logoDataUrl,
  headline: initialHeadline,
  cta: initialCta,
  additionalText: initialAdditionalText,
  brandColor,
  colorPalette,
  advertisingCategory,
  onBack,
}: CreativeEditorProps) => {
  const [creatives, setCreatives] = useState(initialCreatives);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editedHeadline, setEditedHeadline] = useState(initialHeadline);
  const [editedCta, setEditedCta] = useState(initialCta);
  const [editedAdditionalText, setEditedAdditionalText] = useState(initialAdditionalText);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateFamily>(
    initialCreatives[0]?.layout.template || 'clean-minimal'
  );
  const [selectedBgColor, setSelectedBgColor] = useState(brandColor);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [selectedElement, setSelectedElement] = useState<{ type: string; index?: number } | null>(null);
  const [headlineFontSize, setHeadlineFontSize] = useState(initialCreatives[0]?.layout.headline.fontSize || 42);
  const [ctaFontSize, setCtaFontSize] = useState(initialCreatives[0]?.layout.cta.fontSize || 24);
  const [additionalTextFontSize, setAdditionalTextFontSize] = useState(
    initialCreatives[0]?.layout.additionalText?.fontSize || 22
  );

  const currentCreative = creatives[selectedIndex];

  useEffect(() => {
    if (currentCreative) {
      setSelectedTemplate(currentCreative.layout.template);
      setHeadlineFontSize(currentCreative.layout.headline.fontSize);
      setCtaFontSize(currentCreative.layout.cta.fontSize);
      setAdditionalTextFontSize(currentCreative.layout.additionalText?.fontSize || 22);
      setSelectedElement(null);
    }
  }, [selectedIndex, currentCreative]);

  const regenerateCreative = async () => {
    if (!currentCreative) return;

    setIsRegenerating(true);

    const newPalette = { ...colorPalette, primary: selectedBgColor };
    const newLayout = generateLayout(
      currentCreative.ratio,
      selectedTemplate,
      newPalette,
      editedHeadline,
      [],
      advertisingCategory,
      editedAdditionalText
    );

    const newDataUrl = await renderCreative(
      newLayout,
      packshotDataUrl,
      logoDataUrl,
      editedHeadline,
      editedCta,
      editedAdditionalText
    );

    const updatedCreatives = [...creatives];
    updatedCreatives[selectedIndex] = {
      ...currentCreative,
      layout: newLayout,
      dataUrl: newDataUrl,
    };

    setCreatives(updatedCreatives);
    setIsRegenerating(false);
  };

  const handleLayoutChange = (newLayout: CreativeLayout) => {
    const updatedCreatives = [...creatives];
    updatedCreatives[selectedIndex] = {
      ...currentCreative,
      layout: newLayout,
      dataUrl: '',
    };
    setCreatives(updatedCreatives);
  };

  const handleDeleteElement = () => {
    if (!selectedElement || !currentCreative) return;

    const newLayout = { ...currentCreative.layout };

    if (selectedElement.type === 'decoration' && selectedElement.index !== undefined) {
      newLayout.decorations = newLayout.decorations.filter((_, idx) => idx !== selectedElement.index);
    }

    handleLayoutChange(newLayout);
    setSelectedElement(null);
  };

  const handleRotateElement = (angleDelta: number) => {
    if (!selectedElement || !currentCreative) return;

    const newLayout = { ...currentCreative.layout };

    if (selectedElement.type === 'decoration' && selectedElement.index !== undefined) {
      const deco = { ...newLayout.decorations[selectedElement.index] };
      deco.rotation = (deco.rotation || 0) + angleDelta;
      newLayout.decorations[selectedElement.index] = deco;
      handleLayoutChange(newLayout);
    }
  };

  const updateFontSize = (element: 'headline' | 'cta' | 'additionalText', size: number) => {
    if (!currentCreative) return;

    const newLayout = { ...currentCreative.layout };

    if (element === 'headline') {
      newLayout.headline = { ...newLayout.headline, fontSize: size };
      setHeadlineFontSize(size);
    } else if (element === 'cta') {
      newLayout.cta = { ...newLayout.cta, fontSize: size };
      setCtaFontSize(size);
    } else if (element === 'additionalText' && newLayout.additionalText) {
      newLayout.additionalText = { ...newLayout.additionalText, fontSize: size };
      setAdditionalTextFontSize(size);
    }

    handleLayoutChange(newLayout);
  };

  const downloadCreative = async (creative: GeneratedCreative) => {
    const compressed = await compressImage(creative.dataUrl, 500);
    const link = document.createElement('a');
    link.download = `creative-${creative.ratio.replace(':', '-')}.jpg`;
    link.href = compressed;
    link.click();
  };

  const downloadAll = async () => {
    for (const creative of creatives) {
      await downloadCreative(creative);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };

  if (!currentCreative) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            ← Back to Input
          </button>
          <button
            onClick={downloadAll}
            className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            <Download size={20} />
            <span>Download All</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Editor: {currentCreative.ratio}
                </h2>
                <button
                  onClick={() => downloadCreative(currentCreative)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
                >
                  <Download size={18} />
                  <span>Download</span>
                </button>
              </div>

              <div className="bg-gray-100 rounded-lg">
                <DraggableCanvas
                  layout={currentCreative.layout}
                  packshotDataUrl={packshotDataUrl}
                  logoDataUrl={logoDataUrl}
                  headline={editedHeadline}
                  cta={editedCta}
                  additionalText={editedAdditionalText}
                  selectedElement={selectedElement}
                  onLayoutChange={handleLayoutChange}
                  onElementSelect={setSelectedElement}
                  onDeleteElement={handleDeleteElement}
                  onRotateElement={handleRotateElement}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex space-x-2 overflow-x-auto">
                {creatives.map((creative, index) => (
                  <button
                    key={creative.ratio}
                    onClick={() => setSelectedIndex(index)}
                    className={`flex-shrink-0 relative rounded-lg overflow-hidden border-2 transition ${
                      index === selectedIndex
                        ? 'border-blue-600 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={creative.dataUrl}
                      alt={creative.ratio}
                      className="h-24 w-auto"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs py-1 px-2 text-center">
                      {creative.ratio}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Edit3 size={20} className="text-gray-700" />
                <h3 className="text-lg font-bold text-gray-900">Edit Content</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Headline * (Font: {headlineFontSize}px)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editedHeadline}
                      onChange={(e) => setEditedHeadline(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      maxLength={60}
                    />
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => updateFontSize('headline', Math.max(14, headlineFontSize - 2))}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        -
                      </button>
                      <input
                        type="range"
                        min="14"
                        max="72"
                        value={headlineFontSize}
                        onChange={(e) => updateFontSize('headline', parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => updateFontSize('headline', Math.min(72, headlineFontSize + 2))}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Text {editedAdditionalText && `(Font: ${additionalTextFontSize}px)`}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editedAdditionalText}
                      onChange={(e) => setEditedAdditionalText(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      maxLength={80}
                    />
                    {editedAdditionalText && (
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => updateFontSize('additionalText', Math.max(12, additionalTextFontSize - 2))}
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                          -
                        </button>
                        <input
                          type="range"
                          min="12"
                          max="42"
                          value={additionalTextFontSize}
                          onChange={(e) => updateFontSize('additionalText', parseInt(e.target.value))}
                          className="flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => updateFontSize('additionalText', Math.min(42, additionalTextFontSize + 2))}
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Call-to-Action (Font: {ctaFontSize}px)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editedCta}
                      onChange={(e) => setEditedCta(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      maxLength={20}
                    />
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => updateFontSize('cta', Math.max(12, ctaFontSize - 2))}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        -
                      </button>
                      <input
                        type="range"
                        min="12"
                        max="48"
                        value={ctaFontSize}
                        onChange={(e) => updateFontSize('cta', parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => updateFontSize('cta', Math.min(48, ctaFontSize + 2))}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              {selectedElement && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-green-900">
                      {selectedElement.type === 'decoration' ? 'Decorative Element' : 'Selected Element'} Selected
                    </h3>
                    <button
                      onClick={() => setSelectedElement(null)}
                      className="text-xs px-2 py-1 bg-green-200 text-green-900 rounded hover:bg-green-300"
                    >
                      Deselect
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRotateElement(-15)}
                        className="flex items-center gap-2 flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        <RotateCw size={16} />
                        Rotate Left
                      </button>
                      <button
                        onClick={() => handleRotateElement(15)}
                        className="flex items-center gap-2 flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        <RotateCw size={16} style={{ transform: 'scaleX(-1)' }} />
                        Rotate Right
                      </button>
                    </div>
                    {selectedElement.type === 'decoration' && (
                      <button
                        onClick={handleDeleteElement}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        <Trash2 size={16} />
                        Delete Element
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-3">
                    Keyboard shortcuts: Delete/Backspace to remove, Left/Right arrows to rotate 5°
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-2 mb-4">
                <Layout size={20} className="text-gray-700" />
                <h3 className="text-lg font-bold text-gray-900">Template</h3>
              </div>

              <div className="space-y-2">
                {(['clean-minimal', 'bold-dynamic', 'premium-soft'] as TemplateFamily[]).map(
                  (template) => (
                    <button
                      key={template}
                      onClick={() => setSelectedTemplate(template)}
                      className={`w-full py-3 px-4 rounded-lg font-medium text-left transition ${
                        selectedTemplate === template
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {templateNames[template]}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Palette size={20} className="text-gray-700" />
                <h3 className="text-lg font-bold text-gray-900">Brand Color</h3>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={selectedBgColor}
                  onChange={(e) => setSelectedBgColor(e.target.value)}
                  className="h-12 w-16 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedBgColor}
                  onChange={(e) => setSelectedBgColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-4 gap-2 mt-3">
                {[colorPalette.primary, colorPalette.secondary, colorPalette.accent].map(
                  (color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedBgColor(color)}
                      className="h-10 rounded border-2 border-gray-300 hover:border-gray-500 transition"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  )
                )}
              </div>
            </div>

            <button
              onClick={regenerateCreative}
              disabled={isRegenerating}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300"
            >
              {isRegenerating ? 'Applying Changes...' : 'Apply Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
