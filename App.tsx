
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Camera, 
  Sun, 
  Moon, 
  Image as ImageIcon, 
  Edit3, 
  MessageSquare, 
  FolderHeart,
  ChevronLeft,
  ChevronRight,
  Settings
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
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('ace_digiart_collection', JSON.stringify(collection));
  }, [collection]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const saveToCollection = useCallback((url: string, prompt: string) => {
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
    { id: 'imaginable', label: 'Imaginable', icon: <ImageIcon size={18} /> },
    { id: 'editable', label: 'Editable', icon: <Edit3 size={18} /> },
    { id: 'promptable', label: 'Promptable', icon: <MessageSquare size={18} /> },
    { id: 'collectable', label: 'Collectable', icon: <FolderHeart size={18} /> },
  ];

  return (
    <div className={`min-h-screen flex minimal-transition ${isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'}`}>
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } fixed h-screen z-50 minimal-transition flex flex-col border-r ${
          isDarkMode ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-zinc-100'
        }`}
      >
        <div className="p-8 flex items-center gap-3">
          <Camera size={22} className="text-zinc-400" />
          {isSidebarOpen && (
            <h1 className="text-sm font-bold tracking-[0.2em] uppercase">
              ACE <span className="text-zinc-400">DIGIART</span>
            </h1>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as AppSection)}
              className={`w-full flex items-center gap-4 p-3 rounded-lg minimal-transition text-sm font-medium ${
                activeSection === section.id
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white'
                  : `text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200`
              }`}
            >
              <span className={activeSection === section.id ? 'text-zinc-900 dark:text-zinc-100' : ''}>
                {section.icon}
              </span>
              {isSidebarOpen && <span>{section.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 space-y-1">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center gap-4 p-3 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-sm font-medium minimal-transition"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            {isSidebarOpen && <span>{isDarkMode ? 'Light' : 'Dark'}</span>}
          </button>
          
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center gap-4 p-3 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-sm font-medium minimal-transition"
          >
            {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            {isSidebarOpen && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 minimal-transition ${isSidebarOpen ? 'ml-64' : 'ml-20'} p-12`}>
        <header className="flex justify-between items-start mb-16">
          <div className="space-y-1">
            <h2 className="text-4xl font-bold tracking-tight capitalize">{activeSection}</h2>
            <div className="h-1 w-12 bg-zinc-900 dark:bg-zinc-100 rounded-full"></div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] uppercase font-bold tracking-[0.25em] text-zinc-400">Official Brand</p>
              <p className="text-lg font-black tracking-tighter uppercase leading-tight">
                ACE <span className="text-zinc-400">DIGIART</span>
              </p>
            </div>
            <div className={`w-14 h-14 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center transition-all hover:border-zinc-400 dark:hover:border-zinc-600`}>
              <Camera size={24} className="text-zinc-500 dark:text-zinc-400" strokeWidth={1.5} />
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto">
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
