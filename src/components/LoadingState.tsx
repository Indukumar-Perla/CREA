import { Loader2 } from 'lucide-react';

export const LoadingState = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-12 max-w-md text-center">
        <Loader2 className="animate-spin text-blue-600 mx-auto mb-6" size={64} />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Creatives</h2>
        <p className="text-gray-600 mb-4">
          Processing your images and creating beautiful ad creatives...
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Removing background</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Extracting brand colors</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Generating layouts</span>
          </div>
        </div>
      </div>
    </div>
  );
};
