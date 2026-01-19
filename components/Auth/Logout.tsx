
import React, { useEffect } from 'react';
import { Skull, Loader2 } from 'lucide-react';

interface LogoutProps {
  onFinish: () => void;
}

const Logout: React.FC<LogoutProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-center p-6">
      <div className="space-y-12 animate-in fade-in duration-700">
        <div className="w-32 h-32 bg-zinc-900/50 rounded-[3rem] border border-zinc-800 flex items-center justify-center mx-auto shadow-2xl relative">
          <Skull size={64} className="text-zinc-100 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
             <Loader2 size={80} className="animate-spin text-white" strokeWidth={1} />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase">ACE DIGIART</h1>
          <p className="text-xl font-medium italic text-zinc-500 tracking-tight">"See You Again."</p>
        </div>
        
        <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-800 pt-20">
          Disabling Encrypted Session
        </div>
      </div>
    </div>
  );
};

export default Logout;
