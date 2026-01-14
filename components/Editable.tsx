
import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Sparkles, 
  Loader2, 
  Image as ImageIcon,
  Edit3
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

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Source Image */}
        <div className={`p-6 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center min-h-[400px] transition-colors ${
          isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-yellow-50/30 border-yellow-200'
        }`}>
          {sourceImage ? (
            <div className="relative group w-full h-full flex items-center justify-center">
              <img src={sourceImage} alt="source" className="max-w-full max-h-[350px] object-contain rounded-2xl shadow-xl" />
              <button 
                onClick={() => setSourceImage(null)}
                className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit3 size={16} />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer text-center group"
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all ${
                isDarkMode ? 'bg-zinc-800 group-hover:bg-zinc-700' : 'bg-white group-hover:bg-yellow-100'
              }`}>
                <Upload className="text-yellow-500" size={32} />
              </div>
              <h4 className="text-xl font-bold mb-2">Upload Source Image</h4>
              <p className="opacity-60">The AI will modify this base image</p>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
        </div>

        {/* Result Image */}
        <div className={`p-6 rounded-3xl min-h-[400px] flex items-center justify-center transition-colors ${
          isDarkMode ? 'bg-zinc-900' : 'bg-zinc-50'
        }`}>
          {isEditing ? (
            <div className="text-center">
              <Loader2 className="animate-spin text-yellow-500 mx-auto mb-4" size={48} />
              <p className="font-bold">Applying magic brush...</p>
            </div>
          ) : resultImage ? (
            <div className="w-full h-full flex items-center justify-center">
              <ImageCard 
                url={resultImage} 
                prompt={prompt} 
                onSave={() => onSave(resultImage, prompt)}
                isSaved={collection.some(item => item.url === resultImage)}
                isDarkMode={isDarkMode}
              />
            </div>
          ) : (
            <div className="text-center opacity-40">
              <Sparkles size={64} className="mx-auto mb-4" />
              <p className="font-medium">Modified artwork will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Control Area */}
      <div className={`p-6 rounded-3xl shadow-2xl space-y-4 ${
        isDarkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-yellow-100'
      }`}>
        <div className="space-y-2">
          <label className="text-sm font-bold block ml-1">Edit Instructions</label>
          <div className="flex gap-4">
            <input 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., 'Change the sky to sunset', 'Add a white cat in the corner'..."
              className={`flex-1 p-4 rounded-2xl focus:ring-2 focus:ring-yellow-400 outline-none transition-all ${
                isDarkMode ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-black'
              }`}
            />
            <button 
              onClick={handleEdit}
              disabled={isEditing || !sourceImage || !prompt}
              className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-zinc-300 px-8 rounded-2xl text-black font-bold transition-all flex items-center gap-2 whitespace-nowrap"
            >
              {isEditing ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              Apply Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editable;
