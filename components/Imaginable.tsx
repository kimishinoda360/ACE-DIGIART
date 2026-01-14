
import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Trash, 
  Sparkles, 
  Loader2, 
  Image as ImageIcon,
  ArrowRight
} from 'lucide-react';
import { ASPECT_RATIOS, IMAGE_COUNTS, GeneratedImage } from '../types';
import { generateImage, enhancePrompt } from '../services/geminiService';
import ImageCard from './UI/ImageCard';

interface ImaginableProps {
  onSave: (url: string, prompt: string) => void;
  collection: GeneratedImage[];
  isDarkMode: boolean;
}

const Imaginable: React.FC<ImaginableProps> = ({ onSave, collection, isDarkMode }) => {
  const [prompt, setPrompt] = useState('');
  const [ratio, setRatio] = useState(ASPECT_RATIOS[0].value);
  const [count, setCount] = useState(1);
  const [refImages, setRefImages] = useState<string[]>([]);
  const [results, setResults] = useState<{url: string; prompt: string}[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files || []);
    if (refImages.length + files.length > 5) return;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setRefImages(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeRefImage = (index: number) => setRefImages(prev => prev.filter((_, i) => i !== index));

  const handleEnhance = async () => {
    if (!prompt) return;
    setIsEnhancing(true);
    try {
      const enhanced = await enhancePrompt(prompt);
      setPrompt(enhanced);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setResults([]);
    try {
      for (let i = 0; i < count; i++) {
        const url = await generateImage(prompt, ratio, refImages);
        setResults(prev => [...prev, { url, prompt }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Input Section */}
        <div className="lg:col-span-4 space-y-8">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">The Vision</h3>
            <div className="relative group">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your creation..."
                className={`w-full p-0 bg-transparent border-b resize-none h-32 focus:outline-none text-xl font-medium placeholder:text-zinc-200 dark:placeholder:text-zinc-800 transition-colors ${
                  isDarkMode ? 'border-zinc-800 focus:border-zinc-100' : 'border-zinc-100 focus:border-zinc-900'
                }`}
              />
              <button 
                onClick={handleEnhance}
                disabled={isEnhancing || !prompt}
                className="absolute bottom-4 right-0 text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 minimal-transition disabled:opacity-0"
              >
                {isEnhancing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Configuration</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-zinc-400">Ratio</label>
                <select 
                  value={ratio}
                  onChange={(e) => setRatio(e.target.value)}
                  className="w-full bg-transparent border-b border-zinc-100 dark:border-zinc-800 py-2 text-sm focus:outline-none appearance-none cursor-pointer"
                >
                  {ASPECT_RATIOS.map(r => <option key={r.value} value={r.value}>{r.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-zinc-400">Amount</label>
                <select 
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full bg-transparent border-b border-zinc-100 dark:border-zinc-800 py-2 text-sm focus:outline-none appearance-none cursor-pointer"
                >
                  {IMAGE_COUNTS.map(c => <option key={c} value={c}>{c} Item{c > 1 ? 's' : ''}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase text-zinc-400">Context Images ({refImages.length}/5)</label>
              <div className="flex flex-wrap gap-2">
                {refImages.map((img, i) => (
                  <div key={i} className="relative group w-12 h-12 rounded-lg overflow-hidden border dark:border-zinc-800">
                    <img src={img} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeRefImage(i)}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash size={12} className="text-white" />
                    </button>
                  </div>
                ))}
                {refImages.length < 5 && (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-12 h-12 rounded-lg flex items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-100 transition-colors"
                  >
                    <Plus size={16} className="text-zinc-300" />
                  </button>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} multiple accept="image/*" className="hidden" />
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className="w-full group flex items-center justify-between p-6 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-bold tracking-tight minimal-transition disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:text-zinc-400"
          >
            <span>{isGenerating ? 'Synthesizing...' : 'Initialize Creation'}</span>
            {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight className="group-hover:translate-x-1 minimal-transition" size={20} />}
          </button>
        </div>

        {/* Output Section */}
        <div className="lg:col-span-8">
          <div className={`min-h-[500px] rounded-[2.5rem] flex items-center justify-center border ${
            isDarkMode ? 'bg-zinc-900/20 border-zinc-900' : 'bg-zinc-50 border-zinc-100'
          }`}>
            {isGenerating && results.length === 0 ? (
              <div className="text-center space-y-4">
                <Loader2 className="animate-spin mx-auto text-zinc-300" size={48} />
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">Processing Pixels</p>
              </div>
            ) : results.length > 0 ? (
              <div className="w-full p-8 grid gap-8 h-full">
                <div className={`grid gap-6 w-full ${results.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {results.map((res, i) => (
                    <ImageCard 
                      key={i} 
                      url={res.url} 
                      prompt={res.prompt} 
                      onSave={() => onSave(res.url, res.prompt)}
                      isSaved={collection.some(item => item.url === res.url)}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center opacity-20">
                <ImageIcon size={120} strokeWidth={0.5} className="mx-auto mb-4" />
                <p className="text-xs font-bold uppercase tracking-[0.3em]">Awaiting Instruction</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Imaginable;
