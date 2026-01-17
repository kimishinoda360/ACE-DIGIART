
import React, { useState, useRef } from 'react';
import { Upload, Copy, Check, Loader2, Image as ImageIcon } from 'lucide-react';
import { imageToPrompt } from '../services/geminiService';

interface PromptableProps {
  isDarkMode: boolean;
}

const Promptable: React.FC<PromptableProps> = ({ isDarkMode }) => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        analyze(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const analyze = async (imgData: string) => {
    setIsAnalyzing(true);
    try {
      const result = await imageToPrompt(imgData);
      setPrompt(result);
    } catch (err) {
      setPrompt("Could not analyze image. Try another one.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
      <div 
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`p-10 rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center min-h-[400px] transition-all duration-300 relative ${
          isDarkMode 
            ? `bg-zinc-900/50 border-zinc-800 ${isDragging ? 'border-yellow-400 bg-zinc-800/80 scale-[1.02]' : ''}` 
            : `bg-yellow-50/10 border-yellow-200 ${isDragging ? 'border-yellow-400 bg-yellow-50/30 scale-[1.02]' : ''}`
        }`}
      >
        {image ? (
          <div className="relative group flex flex-col items-center">
            <img src={image} alt="target" className="max-w-full max-h-[350px] object-contain rounded-3xl shadow-2xl mb-8 transition-transform group-hover:scale-[1.01]" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-yellow-500 text-xs font-black uppercase tracking-widest hover:underline transition-all"
            >
              Analyze another image
            </button>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="text-center cursor-pointer group"
          >
            <div className={`w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8 transition-all duration-500 ${
              isDragging ? 'scale-110 bg-yellow-400 rotate-12' : 'group-hover:scale-110 bg-zinc-800'
            } ${isDarkMode ? '' : 'bg-white shadow-xl border border-yellow-100'}`}>
              <Upload size={40} className={isDragging ? 'text-zinc-900' : 'text-yellow-500'} />
            </div>
            <h3 className="text-3xl font-black tracking-tighter mb-3 uppercase">
              {isDragging ? 'Release Now' : 'Image to Prompt'}
            </h3>
            <p className="text-sm font-bold tracking-widest text-zinc-500 uppercase opacity-60">
              {isDragging ? 'Drop to start deciphering' : 'Drag & Drop or Click to Upload'}
            </p>
          </div>
        )}
        <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
      </div>

      {(isAnalyzing || prompt) && (
        <div className={`p-10 rounded-[2.5rem] shadow-2xl border transition-all ${
          isDarkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-100'
        }`}>
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Deciphered Signature</h4>
            {prompt && !isAnalyzing && (
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-3 px-6 py-3 bg-yellow-400 text-zinc-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-500 transition-all shadow-lg active:scale-95"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied to Clipboard' : 'Copy Prompt'}
              </button>
            )}
          </div>
          
          <div className={`p-8 rounded-3xl min-h-[120px] flex items-center justify-center transition-all ${
            isDarkMode ? 'bg-zinc-950/50' : 'bg-zinc-50'
          }`}>
            {isAnalyzing ? (
              <div className="flex flex-col items-center gap-4 text-center">
                <Loader2 className="animate-spin text-yellow-400" size={32} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Unlocking creative layers</span>
              </div>
            ) : (
              <p className="text-xl leading-relaxed font-bold italic text-center opacity-90 max-w-2xl">
                "{prompt}"
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Promptable;
