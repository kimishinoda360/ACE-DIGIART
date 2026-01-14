
import React, { useState } from 'react';
import { 
  Download, 
  Trash2, 
  Maximize2, 
  Copy, 
  Check, 
  Search,
  FolderHeart,
  X
} from 'lucide-react';
import { GeneratedImage } from '../types';

interface CollectableProps {
  collection: GeneratedImage[];
  onRemove: (id: string) => void;
  isDarkMode: boolean;
}

const Collectable: React.FC<CollectableProps> = ({ collection, onRemove, isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = collection.filter(item => 
    item.prompt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadImage = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `ace-digiart-${Date.now()}.png`;
    link.click();
  };

  const copyPrompt = (prompt: string, id: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={20} />
          <input 
            type="text" 
            placeholder="Search your collection..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-yellow-400 outline-none transition-all ${
              isDarkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-yellow-100 shadow-sm'
            }`}
          />
        </div>
        <p className="font-bold opacity-60">{collection.length} saved masterpieces</p>
      </div>

      {collection.length === 0 ? (
        <div className="py-20 text-center opacity-40">
          <FolderHeart size={80} className="mx-auto mb-6" />
          <h3 className="text-2xl font-bold mb-2">No items saved yet</h3>
          <p>Go to Imaginable or Editable to start your collection!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <div 
              key={item.id} 
              className={`group relative rounded-3xl overflow-hidden transition-all hover:scale-[1.02] shadow-xl ${
                isDarkMode ? 'bg-zinc-900' : 'bg-white'
              }`}
            >
              <div className="aspect-square overflow-hidden relative">
                <img 
                  src={item.url} 
                  alt="saved art" 
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                   <div className="flex gap-2 mb-4 justify-center">
                      <button 
                        onClick={() => setSelectedImage(item)}
                        className="bg-white/20 hover:bg-white/40 p-3 rounded-full text-white backdrop-blur-md"
                        title="View Large"
                      >
                        <Maximize2 size={20} />
                      </button>
                      <button 
                        onClick={() => downloadImage(item.url)}
                        className="bg-white/20 hover:bg-white/40 p-3 rounded-full text-white backdrop-blur-md"
                        title="Download"
                      >
                        <Download size={20} />
                      </button>
                      <button 
                        onClick={() => copyPrompt(item.prompt, item.id)}
                        className="bg-white/20 hover:bg-white/40 p-3 rounded-full text-white backdrop-blur-md"
                        title="Copy Prompt"
                      >
                        {copiedId === item.id ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                      </button>
                      <button 
                        onClick={() => onRemove(item.id)}
                        className="bg-red-500/80 hover:bg-red-500 p-3 rounded-full text-white backdrop-blur-md"
                        title="Remove"
                      >
                        <Trash2 size={20} />
                      </button>
                   </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm font-medium line-clamp-2 opacity-80">"{item.prompt}"</p>
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-40 mt-2 block">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Large View Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10 bg-black/95 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-6 right-6 text-white hover:text-yellow-400 transition-colors">
            <X size={32} />
          </button>
          <div 
            className="max-w-5xl w-full flex flex-col items-center gap-8"
            onClick={e => e.stopPropagation()}
          >
            <img 
              src={selectedImage.url} 
              alt="large preview" 
              className="max-w-full max-h-[70vh] rounded-3xl shadow-2xl border-4 border-yellow-400" 
            />
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl w-full text-center">
              <h4 className="text-yellow-500 font-bold mb-4 uppercase tracking-widest text-sm">Artwork Prompt</h4>
              <p className="text-xl md:text-2xl font-medium leading-relaxed italic">"{selectedImage.prompt}"</p>
              <div className="flex gap-4 justify-center mt-8">
                 <button 
                    onClick={() => downloadImage(selectedImage.url)}
                    className="bg-yellow-400 text-black px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-yellow-500"
                 >
                   <Download size={20} /> Download HD
                 </button>
                 <button 
                    onClick={() => copyPrompt(selectedImage.prompt, 'modal')}
                    className="bg-zinc-100 dark:bg-zinc-800 px-8 py-3 rounded-xl font-bold flex items-center gap-2"
                 >
                   {copiedId === 'modal' ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                   Copy Prompt
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collectable;
