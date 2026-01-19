
import React, { useState, useRef } from 'react';
import { User, Mail, Lock, Camera, Save, Check, Loader2, ShieldCheck, UserCircle } from 'lucide-react';
import { UserProfile } from '../../types';

interface ControlPanelProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  isDarkMode: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ user, setUser, isDarkMode }) => {
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    password: '••••••••',
    profilePic: user.profilePic
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePic: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    
    setUser({
      username: formData.username,
      email: formData.email,
      profilePic: formData.profilePic
    });
    
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-700">
      <div className={`p-10 rounded-[3rem] border shadow-2xl ${
        isDarkMode ? 'bg-zinc-900/40 border-zinc-900' : 'bg-white border-zinc-100'
      }`}>
        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative group">
              <div className={`w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 ${
                isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-white shadow-xl'
              }`}>
                {formData.profilePic ? (
                  <img src={formData.profilePic} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    <UserCircle size={80} strokeWidth={1} />
                  </div>
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-4 bg-zinc-900 text-white rounded-2xl shadow-2xl border border-zinc-800 hover:scale-110 active:scale-95 transition-all"
              >
                <Camera size={20} />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-1">Avatar Source</p>
              <p className="text-xs font-medium text-zinc-400">JPG or PNG allowed</p>
            </div>
          </div>

          {/* Settings Form */}
          <form onSubmit={handleSave} className="flex-1 w-full space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-4">Username</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                  <input 
                    type="text" 
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    className={`w-full py-4 pl-12 pr-6 rounded-2xl outline-none text-sm font-bold transition-all ${
                      isDarkMode ? 'bg-zinc-950 text-white border border-zinc-900 focus:border-zinc-700' : 'bg-zinc-50 text-zinc-900 border border-zinc-100 focus:border-zinc-200'
                    }`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-4">Email Protocol</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className={`w-full py-4 pl-12 pr-6 rounded-2xl outline-none text-sm font-bold transition-all ${
                      isDarkMode ? 'bg-zinc-950 text-white border border-zinc-900 focus:border-zinc-700' : 'bg-zinc-50 text-zinc-900 border border-zinc-100 focus:border-zinc-200'
                    }`}
                  />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-4">Security Key</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                  <input 
                    type="password" 
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className={`w-full py-4 pl-12 pr-6 rounded-2xl outline-none text-sm font-bold transition-all ${
                      isDarkMode ? 'bg-zinc-950 text-white border border-zinc-900 focus:border-zinc-700' : 'bg-zinc-50 text-zinc-900 border border-zinc-100 focus:border-zinc-200'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-3 text-zinc-500">
                <ShieldCheck size={20} className="text-zinc-600" />
                <span className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encrypted</span>
              </div>
              
              <button 
                type="submit"
                disabled={isSaving}
                className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all ${
                  saveSuccess 
                    ? 'bg-green-500 text-white' 
                    : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:scale-[1.02] active:scale-95'
                }`}
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : saveSuccess ? <Check size={16} /> : <Save size={16} />}
                {isSaving ? 'Processing' : saveSuccess ? 'Saved' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.6em]">Hardware ID: 4952-ACE-9901</p>
      </div>
    </div>
  );
};

export default ControlPanel;
