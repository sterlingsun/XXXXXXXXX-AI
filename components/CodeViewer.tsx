import React from 'react';

interface CodeViewerProps {
  code: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ code }) => {
  return (
    <div className="w-full h-full bg-[#1e1e1e] rounded-lg overflow-hidden shadow-xl border border-gray-700 flex flex-col">
        <div className="bg-[#2d2d2d] px-4 py-2 text-xs text-gray-400 border-b border-gray-700 font-mono">
            index.html
        </div>
      <div className="flex-1 overflow-auto p-4">
        <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap break-all">
          {code}
        </pre>
      </div>
    </div>
  );
};