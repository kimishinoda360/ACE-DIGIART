
import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Sparkles, 
  Loader2, 
  Image as ImageIcon,
  Edit3,
  X
} from 'lucide-react';
import { editImage } from '../services/geminiService';
import { GeneratedImage } from '../types';
import ImageCard from './UI/ImageCard';

interface EditableProps {
  onSave: (url: string, prompt: string) => void;
  collection: GeneratedImage[];
  isDarkMode: boolean;
}

const Editable: React.FC<EditableProps> = ({ onSave, collection, isDarkMode }) => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage(reader.result as string);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!sourceImage || !prompt) return;
    setIsEditing(true);
    try {
      const result = await editImage(sourceImage, prompt);
      setResultImage(result);
    } catch (err) {
      alert("Editing failed. Try a different prompt.");
    } finally {
      setIsEditing(false);
    }
  };

  const clearSource = () => {
    setSourceImage(null);
    setResultImage(null);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source Image Container */}
        <div className={`relative aspect-square md:aspect-[4/5] rounded-[2.5rem] overflow-hidden border transition-all duration-500 ${
          isDarkMode ? 'bg-zinc-900/40 border-zinc-900' : 'bg-zinc-100 border-zinc-200'
        }`}>
          {sourceImage ? (
            <div className="relative group w-full h-full">
              <img 
                src={sourceImage} 
                alt="source" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <button 
                onClick={clearSource}
                className="absolute top-6 right-6 bg-zinc-950/80 text-white p-2.5 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all z-10 border border-white/10 backdrop-blur-md"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-full flex flex-col items-center justify-center cursor-pointer group p-12 text-center"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
                isDarkMode ? 'bg-zinc-800 group-hover:bg-zinc-700' : 'bg-white shadow-sm'
              }`}>
                <Upload className="text-zinc-400 group-hover:text-zinc-100" size={24} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 group-hover:text-zinc-300 transition-colors">
                Upload Source
              </p>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
        </div>

        {/* Result Image Container */}
        <div className={`relative aspect-square md:aspect-[4/5] rounded-[2.5rem] overflow-hidden border transition-all duration-500 ${
          isDarkMode ? 'bg-zinc-900/40 border-zinc-900' : 'bg-zinc-100 border-zinc-200'
        }`}>
          {isEditing ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center space-y-4">
              <Loader2 className="animate-spin text-zinc-500" size={40} />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Refining Canvas</p>
            </div>
          ) : resultImage ? (
            <div className="w-full h-full">
              <ImageCard 
                url={resultImage} 
                prompt={prompt} 
                onSave={() => onSave(resultImage, prompt)}
                isSaved={collection.some(item => item.url === resultImage)}
                isDarkMode={isDarkMode}
              />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center opacity-20">
              <Sparkles size={48} strokeWidth={1} className="mb-4" />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Modified Preview</p>
            </div>
          )}
        </div>
      </div>

      {/* Control Area */}
      <div className={`p-4 rounded-[2rem] border shadow-2xl ${
        isDarkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-100'
      }`}>
        <div className="flex flex-col gap-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-4">Edit Instructions</label>
          <div className="flex gap-3">
            <input 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., 'Make it look like a close-up cinematic shot'..."
              className={`flex-1 px-6 py-4 rounded-2xl outline-none text-sm font-medium transition-all ${
                isDarkMode ? 'bg-zinc-950 text-white placeholder:text-zinc-700' : 'bg-zinc-50 text-black placeholder:text-zinc-300'
              }`}
            />
            <button 
              onClick={handleEdit}
              disabled={isEditing || !sourceImage || !prompt}
              className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-zinc-800 disabled:text-zinc-600 px-8 rounded-2xl text-black font-black text-xs uppercase tracking-tighter transition-all flex items-center gap-2 whitespace-nowrap"
            >
              {isEditing ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
              Edit Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editable;
