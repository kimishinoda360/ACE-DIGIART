
import React, { useState } from 'react';
import { Skull, ArrowLeft, Mail, Send } from 'lucide-react';
import { AppSection } from '../../types';

interface ForgotPasswordProps {
  onNavigate: (section: AppSection) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => onNavigate('login'), 3000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => onNavigate('login')}
            className="p-3 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Recovery Mode</p>
            <h2 className="text-xl font-black tracking-tighter text-white uppercase">Reset Access</h2>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-900 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-xl text-center space-y-6">
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-sm text-zinc-400 font-medium">Enter your registered email address to receive a reset link.</p>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-zinc-100" size={18} />
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950/50 border border-zinc-900 rounded-2xl py-4 pl-14 pr-6 text-white text-sm outline-none focus:ring-1 focus:ring-zinc-700 transition-all placeholder:text-zinc-700"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-white text-zinc-950 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-zinc-200 active:scale-[0.98] transition-all"
              >
                Send Instructions
                <Send size={16} />
              </button>
            </form>
          ) : (
            <div className="py-12 space-y-6 animate-in zoom-in-90 duration-500">
              <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-white">
                <Send size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black uppercase text-white tracking-tighter">Transmission Sent</h3>
                <p className="text-sm text-zinc-500">Check your inbox for a recovery link. Redirecting you shortly...</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="text-center opacity-10">
           <Skull size={100} strokeWidth={0.5} />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
