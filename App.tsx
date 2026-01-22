import React, { useState } from 'react';
import { InputBar } from './components/InputBar';
import { PreviewFrame } from './components/PreviewFrame';
import { CodeViewer } from './components/CodeViewer';
import { generateAppCode } from './services/geminiService';
import { ModelMode } from './types';
import { Code, Eye, Download, ArrowLeft, RefreshCw, Smartphone, Monitor } from 'lucide-react';

const App: React.FC = () => {
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [lastPrompt, setLastPrompt] = useState<string>('');
  const [lastMode, setLastMode] = useState<ModelMode>(ModelMode.FAST);

  const handleGenerate = async (prompt: string, mode: ModelMode) => {
    setIsLoading(true);
    setLastPrompt(prompt);
    setLastMode(mode);
    try {
      const code = await generateAppCode(prompt, mode);
      setGeneratedCode(code);
    } catch (error) {
      alert("Error generating code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedCode) return;
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setGeneratedCode(null);
    setLastPrompt('');
  };

  // --- Landing Screen ---
  if (!generatedCode && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#212121] text-white">
        <div className="mb-8 text-center">
            {/* Logo / Icon placeholder if needed */}
            <div className="w-16 h-16 bg-white/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Code className="text-white/80" size={32} />
            </div>
           <h1 className="text-3xl md:text-4xl font-semibold mb-2 tracking-tight">
            有什么可以帮忙的？
          </h1>
        </div>
        
        <InputBar onSend={handleGenerate} isLoading={isLoading} />
      </div>
    );
  }

  // --- Loading Screen ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#212121] text-white space-y-6">
        <div className="relative">
            <div className="w-16 h-16 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                 <Code size={20} className="text-white/50" />
            </div>
        </div>
        <div className="text-center">
            <h2 className="text-xl font-medium animate-pulse">正在生成代码...</h2>
            <p className="text-sm text-gray-400 mt-2">
                Using {lastMode === ModelMode.THINKING ? 'Gemini 3 Pro (Thinking)' : 'Gemini 3 Flash'}
            </p>
        </div>
      </div>
    );
  }

  // --- Result Screen ---
  return (
    <div className="h-screen flex flex-col bg-[#212121] overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 md:px-6 shrink-0 bg-[#212121]">
        <div className="flex items-center gap-4">
          <button 
            onClick={reset}
            className="p-2 hover:bg-white/10 rounded-full text-gray-300 transition-colors"
            title="Back to home"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-sm font-medium text-gray-300 truncate max-w-[150px] md:max-w-md hidden sm:block">
            {lastPrompt}
          </span>
        </div>

        <div className="flex items-center gap-2 bg-[#2F2F2F] rounded-lg p-1 border border-white/5">
            <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'preview' 
                    ? 'bg-[#404040] text-white shadow-sm' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
            >
                <Eye size={16} />
                Preview
            </button>
            <button
                onClick={() => setViewMode('code')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'code' 
                    ? 'bg-[#404040] text-white shadow-sm' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
            >
                <Code size={16} />
                Code
            </button>
        </div>

        <div className="flex items-center gap-2">
           <button 
            onClick={() => handleGenerate(lastPrompt, lastMode)}
            className="p-2 hover:bg-white/10 rounded-full text-gray-300 transition-colors hidden sm:block"
            title="Regenerate"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-semibold transition-colors"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export HTML</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-hidden relative">
        <div className="h-full max-w-7xl mx-auto">
            {viewMode === 'preview' ? (
                <PreviewFrame code={generatedCode || ''} />
            ) : (
                <CodeViewer code={generatedCode || ''} />
            )}
        </div>
      </main>
    </div>
  );
};

export default App;