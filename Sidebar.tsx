
import React from 'react';
import { Home, LayoutGrid, Moon, Sun, Package, ShieldCheck, BadgeCheck, Sparkles, Zap, Command, ShieldAlert, Globe, Heart, Languages, Wifi, WifiOff, Share2, Settings, UploadCloud, Info, Activity, Boxes, ChevronRight, Server } from 'lucide-react';
import { ViewState, UserRole, User as UserType, Language } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  userRole: UserRole;
  currentUser: UserType | null;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  lang: Language;
  setLang: (l: Language) => void;
  isFirebaseConfigured: boolean;
  isOnline: boolean;
  onShare: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, onNavigate, userRole, currentUser, isDarkMode, toggleDarkMode, lang, setLang, isOnline, onShare, isFirebaseConfigured
}) => {
  return (
    <div className={`w-80 border-r ${isDarkMode ? 'bg-[#020617] border-slate-900' : 'bg-white border-slate-100'} h-screen sticky top-0 hidden lg:flex flex-col p-8 shadow-2xl z-50 transition-colors duration-500`}>
      <div className="flex items-center gap-4 mb-16 px-2 cursor-pointer group" onClick={() => onNavigate('home')}>
        <div className="bg-gradient-to-br from-brand-600 to-indigo-700 p-4 rounded-[1.5rem] shadow-xl shadow-brand-500/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
          <Boxes className="text-white w-7 h-7" />
        </div>
        <div className="flex flex-col">
          <h1 className={`text-2xl font-black leading-tight tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Nova<br/><span className="text-brand-500 uppercase text-[10px] tracking-[0.4em] font-black">Nexus Store</span>
          </h1>
        </div>
      </div>

      <div className="mb-6 flex-1 overflow-y-auto scrollbar-hide pr-2">
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] mb-8 px-4 flex items-center gap-2">
          <Command size={10} /> {lang === 'bn' ? 'মার্কেটপ্লেস' : 'Marketplace'}
        </p>
        <nav className="space-y-3">
          {[
            { id: 'home', label: lang === 'bn' ? 'স্টোর হোম' : 'Discover', icon: Home },
            { id: 'ai-studio', label: lang === 'bn' ? 'এআই স্টুডিও' : 'AI Forge', icon: Sparkles },
            { id: 'installed', label: lang === 'bn' ? 'আমার লাইব্রেরি' : 'Library', icon: LayoutGrid },
            { id: 'security', label: lang === 'bn' ? 'নিরাপত্তা কেন্দ্র' : 'Nexus Guard', icon: ShieldCheck },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => onNavigate(item.id as ViewState)} 
              className={`w-full flex items-center justify-between px-6 py-4 rounded-[1.5rem] transition-all group ${currentView === item.id ? 'bg-brand-600 text-white font-black shadow-xl shadow-brand-500/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:translate-x-1'}`}
            >
              <div className="flex items-center gap-4">
                <item.icon size={18} className={currentView === item.id ? 'text-white' : 'group-hover:text-brand-500 transition-colors'} /> 
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
              </div>
              {currentView === item.id && <ChevronRight size={14} className="opacity-50" />}
            </button>
          ))}
        </nav>

        {userRole === 'admin' && (
          <div className="mt-10 pt-10 border-t dark:border-slate-800">
            <p className="text-[10px] font-black text-brand-500 uppercase tracking-[0.3em] mb-8 px-4 flex items-center gap-2">
              <Settings size={10} /> {lang === 'bn' ? 'অ্যাডমিন কন্ট্রোল' : 'Proprietor Control'}
            </p>
            <nav className="space-y-3">
              <button 
                onClick={() => onNavigate('admin-portal')} 
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all ${currentView === 'admin-portal' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black shadow-xl shadow-white/5' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:translate-x-1'}`}
              >
                <LayoutGrid size={18} /> <span className="text-sm font-bold tracking-tight">{lang === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Nexus Engine'}</span>
              </button>
              <button 
                onClick={() => onNavigate('hosting')} 
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all ${currentView === 'hosting' ? 'bg-slate-800 text-white font-black shadow-xl' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:translate-x-1'}`}
              >
                <Server size={18} /> <span className="text-sm font-bold tracking-tight">{lang === 'bn' ? 'ক্লাউড হোস্টিং' : 'Hosting Hub'}</span>
              </button>
              <button 
                onClick={() => onNavigate('submit-app')} 
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all ${currentView === 'submit-app' ? 'bg-indigo-600 text-white font-black shadow-xl shadow-indigo-500/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:translate-x-1'}`}
              >
                <UploadCloud size={18} /> <span className="text-sm font-bold tracking-tight">{lang === 'bn' ? 'অ্যাপ আপলোড' : 'Publish Asset'}</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      <div className="mb-8 px-4 space-y-4">
         <div className={`flex flex-col gap-1 px-5 py-4 ${isFirebaseConfigured ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'} border rounded-3xl shadow-sm transition-colors`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <Activity size={12} className={`${isFirebaseConfigured ? 'text-emerald-500' : 'text-amber-500'} animate-pulse`} />
                 <span className={`text-[10px] font-black ${isFirebaseConfigured ? 'text-emerald-600' : 'text-amber-600'} uppercase tracking-widest`}>
                  {isFirebaseConfigured ? 'Live Node' : 'Demo State'}
                 </span>
              </div>
              <div className={`w-2 h-2 ${isFirebaseConfigured ? 'bg-emerald-500' : 'bg-amber-500'} rounded-full shadow-lg`}></div>
            </div>
            <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">System Health: Optimal</p>
         </div>
         
         <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-[2rem] border dark:border-slate-800">
            <button onClick={() => setLang('bn')} className={`flex-1 py-3 text-[10px] font-black rounded-2xl transition-all flex items-center justify-center gap-2 ${lang === 'bn' ? 'bg-brand-500 text-white shadow-lg' : 'text-slate-500 hover:text-brand-600'}`}>
              BN
            </button>
            <button onClick={() => setLang('en')} className={`flex-1 py-3 text-[10px] font-black rounded-2xl transition-all flex items-center justify-center gap-2 ${lang === 'en' ? 'bg-brand-500 text-white shadow-lg' : 'text-slate-500 hover:text-brand-600'}`}>
              EN
            </button>
         </div>
      </div>

      <button onClick={onShare} className="w-full flex items-center gap-4 px-6 py-5 rounded-[2rem] bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-600 hover:text-white transition-all mb-6 border border-brand-500/20 active:scale-95 group/share">
        <Share2 size={18} className="group-hover/share:rotate-12 transition-transform" />
        <span className="text-sm font-black tracking-tight">{lang === 'bn' ? 'স্টোর শেয়ার করুন' : 'Share Nexus'}</span>
      </button>

      <div className="mt-auto space-y-4">
        <div className={`flex items-center justify-between p-6 rounded-[2.5rem] border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'} shadow-inner`}>
           <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full animate-pulse ${isOnline ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                {isOnline ? 'Network: Live' : 'Disconnected'}
              </span>
           </div>
           {isOnline ? <Wifi size={16} className="text-emerald-500" /> : <WifiOff size={16} className="text-red-500" />}
        </div>

        <div className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 shadow-lg">
           <button onClick={() => !isDarkMode && toggleDarkMode()} className={`flex-1 flex justify-center py-4 rounded-2xl transition-all ${!isDarkMode ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-white'}`}>
             <Sun size={16} />
           </button>
           <button onClick={() => isDarkMode && toggleDarkMode()} className={`flex-1 flex justify-center py-4 rounded-2xl transition-all ${isDarkMode ? 'bg-brand-600 text-white shadow-xl shadow-brand-500/20' : 'text-slate-500 hover:text-white'}`}>
             <Moon size={16} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
