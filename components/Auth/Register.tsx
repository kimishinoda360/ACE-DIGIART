
import React, { useState } from 'react';
import { Skull, ArrowLeft, Mail, User, Lock, Sparkles } from 'lucide-react';
import { AppSection } from '../../types';

interface RegisterProps {
  onNavigate: (section: AppSection) => void;
}

const Register: React.FC<RegisterProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Account registration simulation successful!');
    onNavigate('login');
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => onNavigate('login')}
            className="p-3 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Secure Join</p>
            <h2 className="text-xl font-black tracking-tighter text-white uppercase">Register</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900/40 border border-zinc-900 p-8 rounded-[2.5rem] space-y-5 shadow-2xl backdrop-blur-xl">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-zinc-100" size={18} />
              <input 
                type="email" 
                placeholder="Email Address"
                required
                className="w-full bg-zinc-950/50 border border-zinc-900 rounded-2xl py-4 pl-14 pr-6 text-white text-sm outline-none focus:ring-1 focus:ring-zinc-700 transition-all placeholder:text-zinc-700"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-zinc-100" size={18} />
              <input 
                type="text" 
                placeholder="Username"
                required
                className="w-full bg-zinc-950/50 border border-zinc-900 rounded-2xl py-4 pl-14 pr-6 text-white text-sm outline-none focus:ring-1 focus:ring-zinc-700 transition-all placeholder:text-zinc-700"
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-zinc-100" size={18} />
              <input 
                type="password" 
                placeholder="Secure Password"
                required
                className="w-full bg-zinc-950/50 border border-zinc-900 rounded-2xl py-4 pl-14 pr-6 text-white text-sm outline-none focus:ring-1 focus:ring-zinc-700 transition-all placeholder:text-zinc-700"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-white text-zinc-950 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-xl"
          >
            Create Identity
            <Sparkles size={16} />
          </button>
        </form>

        <div className="text-center opacity-20">
          <Skull size={40} className="mx-auto" strokeWidth={1} />
        </div>
      </div>
    </div>
  );
};

export default Register;
