
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        analyze(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
      <div className={`p-10 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center min-h-[300px] transition-all ${
        isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-yellow-50/30 border-yellow-200'
      }`}>
        {image ? (
          <img src={image} alt="target" className="max-w-full max-h-[300px] object-contain rounded-2xl shadow-2xl mb-6" />
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="text-center cursor-pointer group"
          >
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110 ${
              isDarkMode ? 'bg-zinc-800' : 'bg-white shadow-xl border border-yellow-100'
            }`}>
              <Upload size={40} className="text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Image to Prompt</h3>
            <p className="opacity-60">Upload an image to extract its artistic prompt</p>
          </div>
        )}
        <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
        
        {image && (
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-yellow-500 font-bold hover:underline"
          >
            Choose a different image
          </button>
        )}
      </div>

      {(isAnalyzing || prompt) && (
        <div className={`p-8 rounded-3xl shadow-xl transition-all ${
          isDarkMode ? 'bg-zinc-900' : 'bg-white'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-bold">Analysis Result</h4>
            {prompt && !isAnalyzing && (
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-xl font-bold hover:bg-yellow-500 transition-colors"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? 'Copied!' : 'Copy Prompt'}
              </button>
            )}
          </div>
          
          <div className={`p-6 rounded-2xl min-h-[100px] flex items-center justify-center ${
            isDarkMode ? 'bg-zinc-800' : 'bg-zinc-50'
          }`}>
            {isAnalyzing ? (
              <div className="flex items-center gap-3">
                <Loader2 className="animate-spin text-yellow-500" />
                <span className="font-medium">Deciphering artistic elements...</span>
              </div>
            ) : (
              <p className="text-lg leading-relaxed font-medium italic opacity-80">"{prompt}"</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Promptable;
