
import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Trash, 
  Sparkles, 
  Download, 
  Save, 
  Maximize2, 
  Loader2,
  ImagePlus,
  Image as ImageIcon
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
    // Fix: Explicitly type files as File[] to prevent 'unknown' type inference that clashes with Blob requirements in readAsDataURL
    const files: File[] = Array.from(e.target.files || []);
    if (refImages.length + files.length > 5) {
      alert("Max 5 reference images allowed.");
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRefImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeRefImage = (index: number) => {
    setRefImages(prev => prev.filter((_, i) => i !== index));
  };

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
    setResults([]); // Clear results for new batch
    
    try {
      // Generate specified number of images one by one to show progress
      for (let i = 0; i < count; i++) {
        const url = await generateImage(prompt, ratio, refImages);
        setResults(prev => [...prev, { url, prompt }]);
      }
    } catch (err) {
      alert("Error generating images. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Uploads */}
        <div className={`p-6 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center min-h-[300px] transition-colors ${
          isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-yellow-50/30 border-yellow-200'
        }`}>
          <div className="mb-6 text-center">
            <h3 className="text-xl font-bold mb-2">Reference Images</h3>
            <p className="text-sm opacity-60">Upload up to 5 images for style/context</p>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            {refImages.map((img, i) => (
              <div key={i} className="relative group w-24 h-24">
                <img src={img} alt="ref" className="w-full h-full object-cover rounded-xl shadow-md border-2 border-white dark:border-zinc-700" />
                <button 
                  onClick={() => removeRefImage(i)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash size={14} />
                </button>
              </div>
            ))}
            {refImages.length < 5 && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className={`w-24 h-24 rounded-xl flex flex-col items-center justify-center gap-2 border-2 border-dashed transition-all ${
                  isDarkMode ? 'bg-zinc-800 border-zinc-700 hover:border-yellow-500' : 'bg-white border-yellow-200 hover:border-yellow-400'
                }`}
              >
                <Plus size={24} className="text-yellow-500" />
                <span className="text-[10px] font-bold">ADD REF</span>
              </button>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            multiple 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {/* Right: Results */}
        <div className={`p-6 rounded-3xl min-h-[300px] flex items-center justify-center transition-colors ${
          isDarkMode ? 'bg-zinc-900' : 'bg-zinc-50'
        }`}>
          {isGenerating && results.length === 0 ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-yellow-500" size={48} />
              <p className="font-bold animate-pulse">Dreaming up your masterpiece...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="relative w-full h-full">
              <div className={`grid gap-4 w-full h-full ${
                results.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
              }`}>
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
              {isGenerating && (
                <div className="absolute top-2 right-2 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg">
                  <Loader2 size={12} className="animate-spin" /> Generating next...
                </div>
              )}
            </div>
          ) : (
            <div className="text-center opacity-40">
              <ImageIcon size={64} className="mx-auto mb-4" />
              <p className="font-medium">No images generated yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom: Controls */}
      <div className={`p-6 rounded-3xl shadow-2xl space-y-6 ${
        isDarkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-yellow-100'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="lg:col-span-2 relative">
            <label className="text-sm font-bold mb-2 block ml-1">Your Creative Prompt</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic city with floating gardens, cinematic lighting, 8k..."
              className={`w-full p-4 pr-12 rounded-2xl resize-none h-24 focus:ring-2 focus:ring-yellow-400 outline-none transition-all ${
                isDarkMode ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-black'
              }`}
            />
            <button 
              onClick={handleEnhance}
              disabled={isEnhancing || !prompt}
              className="absolute bottom-4 right-4 text-yellow-500 hover:scale-110 transition-transform disabled:opacity-50"
              title="Enhance Prompt"
            >
              {isEnhancing ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold block ml-1">Aspect Ratio</label>
            <select 
              value={ratio}
              onChange={(e) => setRatio(e.target.value)}
              className={`w-full p-4 rounded-2xl focus:ring-2 focus:ring-yellow-400 outline-none appearance-none font-medium cursor-pointer ${
                isDarkMode ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-black'
              }`}
            >
              {ASPECT_RATIOS.map(r => (
                <option key={r.value} value={r.value}>{r.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold block ml-1">Count</label>
            <select 
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className={`w-full p-4 rounded-2xl focus:ring-2 focus:ring-yellow-400 outline-none appearance-none font-medium cursor-pointer ${
                isDarkMode ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-black'
              }`}
            >
              {IMAGE_COUNTS.map(c => (
                <option key={c} value={c}>{c} Image{c > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={isGenerating || !prompt}
          className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-zinc-300 disabled:cursor-not-allowed text-black font-extrabold py-5 rounded-2xl text-lg shadow-lg shadow-yellow-400/20 transition-all flex items-center justify-center gap-3 uppercase tracking-wider"
        >
          {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles size={24} />}
          {isGenerating ? 'Generating Art...' : 'Ignite Imagination'}
        </button>
      </div>
    </div>
  );
};

export default Imaginable;
