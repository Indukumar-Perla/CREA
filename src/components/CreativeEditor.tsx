import { useState, useEffect } from 'react';
import { Download, Edit3, Palette, Layout } from 'lucide-react';
import { GeneratedCreative, TemplateFamily, ColorPalette, CreativeLayout } from '../types';
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
  brandColor: string;
  colorPalette: ColorPalette;
  onBack: () => void;
}

export const CreativeEditor = ({
  creatives: initialCreatives,
  packshotDataUrl,
  logoDataUrl,
  headline: initialHeadline,
  cta: initialCta,
  brandColor,
  colorPalette,
  onBack,
}: CreativeEditorProps) => {
  const [creatives, setCreatives] = useState(initialCreatives);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editedHeadline, setEditedHeadline] = useState(initialHeadline);
  const [editedCta, setEditedCta] = useState(initialCta);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateFamily>(
    initialCreatives[0]?.layout.template || 'clean-minimal'
  );
  const [selectedBgColor, setSelectedBgColor] = useState(brandColor);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const currentCreative = creatives[selectedIndex];

  useEffect(() => {
    if (currentCreative) {
      setSelectedTemplate(currentCreative.layout.template);
    }
  }, [selectedIndex, currentCreative]);

  const regenerateCreative = async () => {
    if (!currentCreative) return;

    setIsRegenerating(true);

    const newPalette = { ...colorPalette, primary: selectedBgColor };
    const newLayout = generateLayout(currentCreative.ratio, selectedTemplate, newPalette, editedHeadline);

    const newDataUrl = await renderCreative(
      newLayout,
      packshotDataUrl,
      logoDataUrl,
      editedHeadline,
      editedCta
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
                  onLayoutChange={handleLayoutChange}
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
                    Headline
                  </label>
                  <input
                    type="text"
                    value={editedHeadline}
                    onChange={(e) => setEditedHeadline(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    maxLength={60}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Call-to-Action
                  </label>
                  <input
                    type="text"
                    value={editedCta}
                    onChange={(e) => setEditedCta(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    maxLength={20}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
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
