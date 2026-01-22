import React from 'react';

interface PreviewFrameProps {
  code: string;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ code }) => {
  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden shadow-xl border border-gray-700">
      <iframe
        title="App Preview"
        srcDoc={code}
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
      />
    </div>
  );
};