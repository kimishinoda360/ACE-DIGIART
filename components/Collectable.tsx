
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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col md:flex-row gap-8 items-end justify-between border-b border-zinc-100 dark:border-zinc-900 pb-12">
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 minimal-transition" size={16} />
          <input 
            type="text" 
            placeholder="Filter archives..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 py-2 bg-transparent text-sm focus:outline-none placeholder:text-zinc-300"
          />
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Total Holdings</p>
          <p className="text-2xl font-black tracking-tight">{collection.length}</p>
        </div>
      </div>

      {collection.length === 0 ? (
        <div className="py-40 text-center space-y-4 opacity-20">
          <FolderHeart size={80} strokeWidth={0.5} className="mx-auto" />
          <p className="text-xs font-bold uppercase tracking-[0.4em]">Vault is Empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div 
              key={item.id} 
              className="group relative aspect-square rounded-2xl overflow-hidden border dark:border-zinc-900 minimal-transition"
            >
              <img src={item.url} alt="archive" className="w-full h-full object-cover minimal-transition group-hover:scale-110" />
              <div className="absolute inset-0 bg-zinc-950/80 opacity-0 group-hover:opacity-100 minimal-transition flex flex-col justify-center items-center gap-4 p-6">
                <div className="flex gap-2">
                  <button onClick={() => setSelectedImage(item)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md"><Maximize2 size={16}/></button>
                  <button onClick={() => downloadImage(item.url)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md"><Download size={16}/></button>
                  <button onClick={() => onRemove(item.id)} className="p-3 bg-red-500/20 hover:bg-red-500/40 rounded-full text-red-200 backdrop-blur-md"><Trash2 size={16}/></button>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-2">{new Date(item.timestamp).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-zinc-950 flex items-center justify-center p-8 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-8 right-8 text-zinc-500 hover:text-white minimal-transition"><X size={32} strokeWidth={1} /></button>
          <div className="max-w-5xl w-full flex flex-col items-center gap-12" onClick={e => e.stopPropagation()}>
            <img src={selectedImage.url} alt="large view" className="max-w-full max-h-[70vh] rounded-[2rem] shadow-2xl" />
            <div className="text-center max-w-2xl space-y-6">
              <div className="flex gap-4 justify-center">
                 <button onClick={() => downloadImage(selectedImage.url)} className="bg-white text-zinc-900 px-6 py-2 rounded-full font-bold text-sm">Download RAW</button>
                 <button onClick={() => copyPrompt(selectedImage.prompt, 'modal')} className="bg-zinc-800 text-white px-6 py-2 rounded-full font-bold text-sm">
                   {copiedId === 'modal' ? 'Prompt Copied' : 'Copy Prompt'}
                 </button>
              </div>
              <p className="text-lg font-medium leading-relaxed text-zinc-300 italic">"{selectedImage.prompt}"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collectable;
