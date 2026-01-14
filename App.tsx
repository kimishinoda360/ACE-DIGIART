
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Camera, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Image as ImageIcon, 
  Edit3, 
  MessageSquare, 
  FolderHeart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Imaginable from './components/Imaginable';
import Editable from './components/Editable';
import Promptable from './components/Promptable';
import Collectable from './components/Collectable';
import { AppSection, GeneratedImage } from './types';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>('imaginable');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [collection, setCollection] = useState<GeneratedImage[]>(() => {
    const saved = localStorage.getItem('ace_digiart_collection');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ace_digiart_collection', JSON.stringify(collection));
  }, [collection]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const saveToCollection = useCallback((url: string, prompt: string) => {
    // Check if already in collection to avoid duplicates
    setCollection(prev => {
      if (prev.some(item => item.url === url)) return prev;
      
      const newItem: GeneratedImage = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url,
        prompt,
        timestamp: Date.now()
      };
      return [newItem, ...prev];
    });
  }, []);

  const removeFromCollection = useCallback((id: string) => {
    setCollection(prev => prev.filter(item => item.id !== id));
  }, []);

  const sections = [
    { id: 'imaginable', label: 'Imaginable', icon: <ImageIcon size={20} /> },
    { id: 'editable', label: 'Editable', icon: <Edit3 size={20} /> },
    { id: 'promptable', label: 'Promptable', icon: <MessageSquare size={20} /> },
    { id: 'collectable', label: 'Collectable', icon: <FolderHeart size={20} /> },
  ];

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } fixed h-screen z-50 transition-all duration-300 flex flex-col border-r shadow-xl ${
          isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-yellow-200'
        }`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="bg-yellow-400 p-2 rounded-xl text-black">
            <Camera size={24} strokeWidth={2.5} />
          </div>
          {isSidebarOpen && (
            <h1 className="text-xl font-extrabold tracking-tighter">
              ACE <span className="text-yellow-500">DIGIART</span>
            </h1>
          )}
        </div>

        <nav className="flex-1 px-3 space-y-2 mt-4">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as AppSection)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all font-medium ${
                activeSection === section.id
                  ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20'
                  : `hover:bg-yellow-50 ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-400' : 'text-zinc-600'}`
              }`}
            >
              {section.icon}
              {isSidebarOpen && <span>{section.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
          <button
            onClick={toggleDarkMode}
            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
              isDarkMode ? 'bg-zinc-800 text-yellow-400' : 'bg-zinc-100 text-zinc-600'
            }`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            {isSidebarOpen && <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
          
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            {isSidebarOpen && <span>Collapse Menu</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} p-8`}>
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold capitalize mb-1">{activeSection}</h2>
            <p className={`${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Powered by Advanced Gemini AI
            </p>
          </div>
          <div className="hidden md:block">
             <div className="flex items-center gap-3 group cursor-default">
                <div className={`p-3 rounded-2xl transition-all group-hover:rotate-12 ${isDarkMode ? 'bg-zinc-800 text-yellow-500' : 'bg-yellow-100 text-yellow-600'}`}>
                   <Camera size={32} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-2xl font-black tracking-tighter uppercase">
                    ACE <span className="text-yellow-500">DIGIART</span>
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.2em] opacity-40 uppercase">Professional Suite</span>
                </div>
             </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {activeSection === 'imaginable' && (
            <Imaginable 
              onSave={saveToCollection} 
              collection={collection}
              isDarkMode={isDarkMode} 
            />
          )}
          {activeSection === 'editable' && (
            <Editable 
              onSave={saveToCollection} 
              collection={collection}
              isDarkMode={isDarkMode} 
            />
          )}
          {activeSection === 'promptable' && <Promptable isDarkMode={isDarkMode} />}
          {activeSection === 'collectable' && (
            <Collectable 
              collection={collection} 
              onRemove={removeFromCollection}
              isDarkMode={isDarkMode}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
