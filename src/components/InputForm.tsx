import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { CreativeInputs, AspectRatio } from '../types';

interface InputFormProps {
  inputs: CreativeInputs;
  onInputChange: (inputs: Partial<CreativeInputs>) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const InputForm = ({ inputs, onInputChange, onGenerate, isGenerating }: InputFormProps) => {
  const handleFileChange = (field: 'packshot' | 'logo', file: File | null) => {
    onInputChange({ [field]: file });
  };

  const handleDecorativeElementsChange = (files: FileList | null) => {
    if (files) {
      onInputChange({ decorativeElements: Array.from(files) });
    }
  };

  const removeDecorativeElement = (index: number) => {
    const updated = inputs.decorativeElements.filter((_, i) => i !== index);
    onInputChange({ decorativeElements: updated });
  };

  const toggleRatio = (ratio: AspectRatio) => {
    const newRatios = inputs.selectedRatios.includes(ratio)
      ? inputs.selectedRatios.filter((r) => r !== ratio)
      : [...inputs.selectedRatios, ratio];
    onInputChange({ selectedRatios: newRatios });
  };

  const isValid =
    inputs.packshot &&
    inputs.logo &&
    inputs.decorativeElements.length > 0 &&
    inputs.headline.trim() &&
    inputs.selectedRatios.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Retail Media Creative Tool</h1>
      <p className="text-gray-600 mb-8">Generate campaign-ready ad creatives in seconds</p>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Packshot *
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange('packshot', e.target.files?.[0] || null)
                }
                className="hidden"
                id="packshot-upload"
              />
              <label
                htmlFor="packshot-upload"
                className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
              >
                {inputs.packshot ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <ImageIcon size={20} />
                    <span className="text-sm font-medium">{inputs.packshot.name}</span>
                  </div>
                ) : (
                  <>
                    <Upload className="text-gray-400 mb-2" size={24} />
                    <span className="text-sm text-gray-500">Upload packshot</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Brand Logo *
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange('logo', e.target.files?.[0] || null)}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
              >
                {inputs.logo ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <ImageIcon size={20} />
                    <span className="text-sm font-medium">{inputs.logo.name}</span>
                  </div>
                ) : (
                  <>
                    <Upload className="text-gray-400 mb-2" size={24} />
                    <span className="text-sm text-gray-500">Upload logo</span>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Headline *
          </label>
          <input
            type="text"
            value={inputs.headline}
            onChange={(e) => onInputChange({ headline: e.target.value })}
            placeholder="Enter your headline"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={60}
          />
          <p className="text-xs text-gray-500 mt-1">{inputs.headline.length}/60 characters</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Call-to-Action
          </label>
          <input
            type="text"
            value={inputs.cta}
            onChange={(e) => onInputChange({ cta: e.target.value })}
            placeholder="e.g., Shop Now, Learn More"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={20}
          />
          <p className="text-xs text-gray-500 mt-1">{inputs.cta.length}/20 characters</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Decorative Elements *
          </label>
          <div className="relative">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleDecorativeElementsChange(e.target.files)}
              className="hidden"
              id="decorative-upload"
            />
            <label
              htmlFor="decorative-upload"
              className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <Upload className="text-gray-400 mb-2" size={20} />
              <span className="text-sm text-gray-500">Upload decorative elements (leaves, flowers, etc.)</span>
            </label>
          </div>

          {inputs.decorativeElements.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {inputs.decorativeElements.map((elem, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-2 rounded-lg"
                >
                  <ImageIcon size={16} />
                  <span className="text-sm font-medium truncate max-w-[150px]">{elem.name}</span>
                  <button
                    type="button"
                    onClick={() => removeDecorativeElement(idx)}
                    className="hover:text-green-900"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">{inputs.decorativeElements.length} element(s) added</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Brand Color
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={inputs.brandColor}
              onChange={(e) => onInputChange({ brandColor: e.target.value })}
              className="h-12 w-20 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={inputs.brandColor}
              onChange={(e) => onInputChange({ brandColor: e.target.value })}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="#3B82F6"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Leave default to auto-extract from logo</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Formats *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['1:1', '9:16', '1.91:1'] as AspectRatio[]).map((ratio) => (
              <button
                key={ratio}
                type="button"
                onClick={() => toggleRatio(ratio)}
                className={`py-3 px-4 rounded-lg font-medium transition ${
                  inputs.selectedRatios.includes(ratio)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {ratio === '1:1' && 'Square 1:1'}
                {ratio === '9:16' && 'Vertical 9:16'}
                {ratio === '1.91:1' && 'Horizontal 1.91:1'}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={!isValid || isGenerating}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          {isGenerating ? 'Generating Creatives...' : 'Generate Creatives'}
        </button>
      </div>
    </div>
  );
};
