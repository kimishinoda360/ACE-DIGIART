
import React, { useState, useEffect } from 'react';
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
      <div className="group relative w-full h-full rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-zinc-800 animate-in zoom-in-90 duration-300">
        <img src={url} alt="generated" className="w-full h-full object-cover" />
        
        {/* Actions Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
          <div className="flex gap-2 justify-center">
            <button 
              onClick={handleDownload}
              className="bg-yellow-400 text-black p-2 rounded-lg hover:bg-yellow-500 transition-colors"
              title="Download"
            >
              <Download size={18} />
            </button>
            <button 
              onClick={handleSave}
              className={`${isSaved ? 'bg-green-500' : 'bg-white'} text-black p-2 rounded-lg hover:bg-yellow-500 transition-colors`}
              title={isSaved ? "Saved" : "Save to Collection"}
            >
              {isSaved ? <Check size={18} className="text-white" /> : <Save size={18} />}
            </button>
            <button 
              onClick={() => setIsLarge(true)}
              className="bg-white text-black p-2 rounded-lg hover:bg-yellow-500 transition-colors"
              title="View Large"
            >
              <Maximize2 size={18} />
            </button>
          </div>
        </div>

        {/* Saved Status Indicator */}
        {isSaved && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-tighter shadow-lg pointer-events-none">
            Saved
          </div>
        )}
      </div>

      {/* Large Modal */}
      {isLarge && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setIsLarge(false)}
        >
          <button className="absolute top-6 right-6 text-white hover:text-yellow-400">
            <X size={32} />
          </button>
          <div 
            className="relative max-w-4xl w-full flex flex-col items-center gap-6"
            onClick={e => e.stopPropagation()}
          >
            <img src={url} alt="large view" className="max-w-full max-h-[80vh] rounded-3xl shadow-2xl border-4 border-yellow-400" />
            <div className={`p-6 rounded-2xl w-full text-center ${isDarkMode ? 'bg-zinc-900 text-white' : 'bg-white text-black'}`}>
              <p className="font-medium opacity-80 italic">"{prompt}"</p>
              <div className="flex gap-4 justify-center mt-4">
                 <button 
                  onClick={handleDownload}
                  className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2"
                >
                  <Download size={18} /> Download
                </button>
                <button 
                  onClick={handleSave}
                  className={`${isSaved ? 'bg-green-500 text-white' : 'bg-zinc-100 dark:bg-zinc-800'} px-4 py-2 rounded-lg font-bold flex items-center gap-2`}
                >
                  {isSaved ? <Check size={18} /> : <Save size={18} />}
                  {isSaved ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageCard;
