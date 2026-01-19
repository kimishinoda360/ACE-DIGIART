
import React, { useState } from 'react';
import { Skull, ArrowRight, Lock, User, AlertCircle } from 'lucide-react';
import { AppSection } from '../../types';

interface LoginProps {
  onLogin: () => void;
  onNavigate: (section: AppSection) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'kimivoltex' && password === 'kimi@1234') {
      onLogin();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-zinc-900 rounded-[2rem] border border-zinc-800 flex items-center justify-center mx-auto shadow-2xl">
            <Skull size={48} className="text-zinc-100" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase text-white">ACE DIGIART</h1>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500 mt-2">Welcome to ACE DIGIART</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900/40 border border-zinc-900 p-8 rounded-[2.5rem] space-y-6 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-xs font-bold flex items-center gap-3 animate-shake">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-zinc-100 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-950/50 border border-zinc-900 rounded-2xl py-4 pl-14 pr-6 text-white text-sm outline-none focus:ring-1 focus:ring-zinc-700 transition-all placeholder:text-zinc-700"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-zinc-100 transition-colors" size={18} />
              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950/50 border border-zinc-900 rounded-2xl py-4 pl-14 pr-6 text-white text-sm outline-none focus:ring-1 focus:ring-zinc-700 transition-all placeholder:text-zinc-700"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-white text-zinc-950 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-xl"
          >
            Authenticate
            <ArrowRight size={16} />
          </button>

          <div className="flex justify-between items-center px-2">
            <button 
              type="button" 
              onClick={() => onNavigate('forgot')}
              className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-zinc-100 transition-colors"
            >
              Forgot Password?
            </button>
            <button 
              type="button" 
              onClick={() => onNavigate('register')}
              className="text-[10px] font-bold uppercase tracking-widest text-white hover:underline transition-all"
            >
              Create Account
            </button>
          </div>
        </form>
        
        <p className="text-[9px] font-black text-center uppercase tracking-[0.5em] text-zinc-800">
          Encrypted Creative Access
        </p>
      </div>
    </div>
  );
};

export default Login;
