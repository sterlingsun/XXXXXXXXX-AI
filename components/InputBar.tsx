import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Zap, BrainCircuit, Loader2 } from 'lucide-react';
import { ModelMode } from '../types';

interface InputBarProps {
  onSend: (prompt: string, mode: ModelMode) => void;
  isLoading: boolean;
}

export const InputBar: React.FC<InputBarProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<ModelMode>(ModelMode.FAST);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSend(input, mode);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 relative">
      
      {/* Input Container */}
      <div className="bg-[#2F2F2F] rounded-[26px] p-2 shadow-lg relative border border-white/10 focus-within:border-white/20 transition-colors">
        
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="描述你想做的网页..."
          className="w-full bg-transparent text-gray-100 placeholder-gray-400 text-lg px-4 py-3 min-h-[52px] max-h-[200px] outline-none resize-none overflow-y-auto scrollbar-hide"
          rows={1}
          disabled={isLoading}
        />

        <div className="flex justify-between items-center px-2 pb-1 mt-1">
          {/* Model Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setMode(ModelMode.FAST)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                mode === ModelMode.FAST
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'
              }`}
              title="Fast responses (Gemini 3 Flash)"
            >
              <Zap size={14} fill={mode === ModelMode.FAST ? "currentColor" : "none"} />
              Fast
            </button>
            <button
              onClick={() => setMode(ModelMode.THINKING)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                mode === ModelMode.THINKING
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'
              }`}
              title="Deep reasoning (Gemini 3 Pro + Thinking)"
            >
              <BrainCircuit size={14} />
              Think
            </button>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className={`p-2 rounded-full transition-all duration-200 ${
              input.trim() && !isLoading
                ? 'bg-white text-black hover:bg-gray-200'
                : 'bg-[#676767] text-[#2F2F2F] cursor-not-allowed'
            }`}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <ArrowUp size={20} strokeWidth={3} />}
          </button>
        </div>
      </div>
      
      {/* Footer / Disclaimers */}
      <div className="text-center mt-4">
        <p className="text-xs text-gray-500">
           AI generate content may be inaccurate. 
        </p>
      </div>
    </div>
  );
};