
import React, { useState } from 'react';
import { Download, Save, Maximize2, X, Check } from 'lucide-react';

interface ImageCardProps {
  url: string;
  prompt: string;
  onSave: () => void;
  isSaved?: boolean;
  isDarkMode: boolean;
}

const ImageCard: React.FC<ImageCardProps> = ({ url, prompt, onSave, isSaved: externalIsSaved, isDarkMode }) => {
  const [isLarge, setIsLarge] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `ace-digiart-${Date.now()}.png`;
    link.click();
  };

  const handleSave = () => {
    onSave();
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  const isSaved = externalIsSaved || showFeedback;

  return (
    <>
      <div className="group relative w-full h-full rounded-3xl overflow-hidden minimal-transition animate-in zoom-in-95 duration-500">
        <img src={url} alt="generated" className="w-full h-full object-cover minimal-transition group-hover:scale-105" />
        
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 minimal-transition flex flex-col justify-end p-8">
          <div className="flex gap-3 justify-center">
            <button 
              onClick={handleDownload}
              className="bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 minimal-transition"
              title="Download"
            >
              <Download size={18} />
            </button>
            <button 
              onClick={handleSave}
              className={`${isSaved ? 'bg-white text-zinc-900' : 'bg-white/10 text-white'} backdrop-blur-md p-3 rounded-full hover:bg-white/30 minimal-transition`}
              title={isSaved ? "Saved" : "Save"}
            >
              {isSaved ? <Check size={18} /> : <Save size={18} />}
            </button>
            <button 
              onClick={() => setIsLarge(true)}
              className="bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 minimal-transition"
              title="View"
            >
              <Maximize2 size={18} />
            </button>
          </div>
        </div>

        {/* Minimal Saved Indicator */}
        {isSaved && !isLarge && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-900 shadow-sm">
            Collected
          </div>
        )}
      </div>

      {/* Fullscreen Overlay */}
      {isLarge && (
        <div 
          className="fixed inset-0 z-[100] bg-zinc-950 flex items-center justify-center p-8 animate-in fade-in duration-500"
          onClick={() => setIsLarge(false)}
        >
          <button className="absolute top-8 right-8 text-zinc-500 hover:text-white minimal-transition">
            <X size={32} strokeWidth={1} />
          </button>
          <div 
            className="relative max-w-5xl w-full flex flex-col items-center gap-12"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative group">
              <img src={url} alt="full view" className="max-w-full max-h-[75vh] rounded-[2rem] shadow-2xl" />
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={handleDownload} className="bg-white text-zinc-900 p-3 rounded-full shadow-lg hover:scale-105 minimal-transition"><Download size={20}/></button>
              </div>
            </div>
            <div className="text-center max-w-2xl space-y-4">
              <p className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Metadata Source</p>
              <p className="text-xl font-medium leading-relaxed italic text-zinc-200">"{prompt}"</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageCard;
