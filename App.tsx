
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Camera, 
  Sun, 
  Moon, 
  Image as ImageIcon, 
  Edit3, 
  MessageSquare, 
  FolderHeart,
  Menu,
  X,
  Settings,
  LogOut,
  User as UserIcon,
  Skull
} from 'lucide-react';
import Imaginable from './components/Imaginable';
import Editable from './components/Editable';
import Promptable from './components/Promptable';
import Collectable from './components/Collectable';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import Logout from './components/Auth/Logout';
import ControlPanel from './components/Profile/ControlPanel';
import { AppSection, GeneratedImage, UserProfile } from './types';

const App: React.FC = () => {
  // Persistence for Auth
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('ace_digiart_auth') === 'true';
  });
  
  const [activeSection, setActiveSection] = useState<AppSection>(() => {
    return (localStorage.getItem('ace_digiart_auth') === 'true') ? 'imaginable' : 'login';
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ace_digiart_user');
    return saved ? JSON.parse(saved) : {
      username: 'kimivoltex',
      email: 'kimi@digiart.com',
      profilePic: null
    };
  });

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

  useEffect(() => {
    localStorage.setItem('ace_digiart_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ace_digiart_auth', String(isAuthenticated));
  }, [isAuthenticated]);

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

  const handleLogin = () => {
    setIsAuthenticated(true);
    setActiveSection('imaginable');
  };

  const handleLogout = () => {
    setActiveSection('logout');
    setIsAuthenticated(false);
    localStorage.removeItem('ace_digiart_auth');
  };

  const sections = [
    { id: 'imaginable', label: 'Imaginable', icon: <ImageIcon size={18} strokeWidth={1.5} /> },
    { id: 'editable', label: 'Editable', icon: <Edit3 size={18} strokeWidth={1.5} /> },
    { id: 'promptable', label: 'Promptable', icon: <MessageSquare size={18} strokeWidth={1.5} /> },
    { id: 'collectable', label: 'Collectable', icon: <FolderHeart size={18} strokeWidth={1.5} /> },
  ];

  // Auth & Interstitial Routing
  if (!isAuthenticated) {
    if (activeSection === 'register') return <Register onNavigate={setActiveSection} />;
    if (activeSection === 'forgot') return <ForgotPassword onNavigate={setActiveSection} />;
    if (activeSection === 'logout') return <Logout onFinish={() => setActiveSection('login')} />;
    return <Login onLogin={handleLogin} onNavigate={setActiveSection} />;
  }

  return (
    <div className={`min-h-screen minimal-transition ${isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'}`}>
      
      {/* Off-Canvas Backdrop */}
      <div 
        className={`fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm transition-opacity duration-300 pointer-events-none ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar (Off-Canvas) */}
      <aside 
        className={`fixed inset-y-0 left-0 w-80 z-[70] transform minimal-transition flex flex-col border-r ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isDarkMode ? 'bg-zinc-950 border-zinc-900 shadow-2xl shadow-black' : 'bg-white border-zinc-100 shadow-xl shadow-zinc-200/50'
        }`}
      >
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Camera size={20} className="text-zinc-400" strokeWidth={1.5} />
            <h1 className="text-xs font-bold tracking-[0.2em] uppercase">
              ACE <span className="text-zinc-400">DIGIART</span>
            </h1>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full minimal-transition text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* User Profile Summary */}
        <div className="px-6 mb-4">
          <div 
            onClick={() => { setActiveSection('control'); setIsSidebarOpen(false); }}
            className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all ${
              isDarkMode ? 'hover:bg-zinc-900' : 'hover:bg-zinc-50'
            }`}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800 border-2 border-zinc-700">
              {user.profilePic ? (
                <img src={user.profilePic} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-500">
                  <UserIcon size={20} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{user.username}</p>
              <p className="text-[10px] text-zinc-500 font-medium truncate uppercase tracking-tighter">{user.email}</p>
            </div>
            <Settings size={16} className="text-zinc-600" />
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => { setActiveSection(section.id as AppSection); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-4 p-4 rounded-xl minimal-transition text-sm font-medium ${
                activeSection === section.id
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
              }`}
            >
              {section.icon}
              <span>{section.label}</span>
            </button>
          ))}
          
          <button
            onClick={() => { setActiveSection('control'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 p-4 rounded-xl minimal-transition text-sm font-medium ${
              activeSection === 'control'
                ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
            }`}
          >
            <Settings size={18} strokeWidth={1.5} />
            <span>Control Panel</span>
          </button>
        </nav>

        <div className="p-6 border-t border-zinc-100 dark:border-zinc-900 space-y-2">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between p-4 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-sm font-medium minimal-transition"
          >
            <div className="flex items-center gap-4">
              {isDarkMode ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
              <span>Mode</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">{isDarkMode ? 'Dark' : 'Light'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-4 rounded-xl text-red-400 hover:bg-red-500/10 text-sm font-medium minimal-transition"
          >
            <LogOut size={18} strokeWidth={1.5} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="min-h-screen p-8 lg:p-20">
        <header className="flex justify-between items-center mb-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <button 
              onClick={toggleSidebar}
              className="p-3 -ml-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white minimal-transition rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>
            
            <div className="flex items-center gap-4">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-400 leading-none mb-1">Active Space</p>
                <h3 className="text-xl font-black tracking-tighter uppercase leading-none opacity-90">
                  {activeSection === 'control' ? 'Control Panel' : activeSection}
                </h3>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-[9px] uppercase font-bold tracking-[0.3em] text-zinc-400 mb-0.5">Creative Suite</p>
              <p className="text-[11px] font-black tracking-tight uppercase leading-none">
                ACE <span className="text-zinc-400">DIGIART</span>
              </p>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
          {activeSection === 'imaginable' && (
            <Imaginable onSave={saveToCollection} collection={collection} isDarkMode={isDarkMode} />
          )}
          {activeSection === 'editable' && (
            <Editable onSave={saveToCollection} collection={collection} isDarkMode={isDarkMode} />
          )}
          {activeSection === 'promptable' && <Promptable isDarkMode={isDarkMode} />}
          {activeSection === 'collectable' && (
            <Collectable collection={collection} onRemove={removeFromCollection} isDarkMode={isDarkMode} />
          )}
          {activeSection === 'control' && (
            <ControlPanel user={user} setUser={setUser} isDarkMode={isDarkMode} />
          )}
        </div>
      </main>

      <div className="fixed bottom-12 left-12 hidden xl:block">
        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-300 dark:text-zinc-800 rotate-90 origin-left">
          STUDIO EDITION
        </p>
      </div>
    </div>
  );
};

export default App;
