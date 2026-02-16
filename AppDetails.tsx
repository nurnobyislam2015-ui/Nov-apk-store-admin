
import React, { useState, useEffect } from 'react';
// Fix: Added Zap to the imported icons from lucide-react
import { X, Star, Download, ShieldCheck, History, MessageSquare, RefreshCcw, CheckCircle, Fingerprint, CloudOff, Info, FileText, HardDrive, Zap } from 'lucide-react';
import { AppData, Review, Language } from '../types';

interface AppDetailsProps {
  app: AppData;
  onClose: () => void;
  onAddReview: (appId: string, review: Omit<Review, 'id' | 'date'>) => void;
  onInstall: () => void;
  onFinishInstall: () => void;
  isInstalled: boolean;
  isInstalling: boolean;
  isDarkMode?: boolean;
  lang: Language;
  isOnline: boolean;
}

const AppDetails: React.FC<AppDetailsProps> = ({ app, onClose, onInstall, onFinishInstall, isInstalled, isInstalling, isDarkMode = false, lang, isOnline }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'reviews' | 'history'>('info');
  const [downloadedMB, setDownloadedMB] = useState(0);
  const totalMB = parseInt(app.size) || 45; 
  
  const [installStep, setInstallStep] = useState(0);
  const installMessages = [
    "অ্যাপ্রুভড বাই নূর নবী ইসলাম...",
    "সার্ভার থেকে প্যাকেজ ফেচ করা হচ্ছে...",
    "নোভা সেন্টিনেল স্ক্যানিং...",
    "ডিক্রিপ্টিং বাইনারি কোড...",
    "সিস্টেম ইন্টেগ্রিটি ভেরিফিকেশন...",
    "ইন্সটলেশন সফল হয়েছে!"
  ];

  useEffect(() => {
    let interval: any;
    if (isInstalling) {
      setInstallStep(0);
      setDownloadedMB(0);
      
      interval = setInterval(() => {
        setDownloadedMB(prev => {
           const next = prev + (totalMB / 10);
           if (next >= totalMB) {
              clearInterval(interval);
              setTimeout(() => onFinishInstall(), 500); // Small delay for the final message
              return totalMB;
           }
           return next;
        });

        setInstallStep(prev => {
          if (prev < installMessages.length - 1) return prev + 1;
          return prev;
        });
      }, 600);
    }
    return () => clearInterval(interval);
  }, [isInstalling, totalMB]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-3xl" onClick={onClose}></div>
      
      <div className={`relative w-full max-w-4xl h-full md:h-[92vh] ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'} md:rounded-[4rem] overflow-hidden shadow-2xl flex flex-col animate-slide-up border border-white/10`}>
        
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-40">
          <div className="relative h-72 md:h-96 w-full">
            <img src={app.banner} className="w-full h-full object-cover" alt="Banner" />
            <div className={`absolute inset-0 bg-gradient-to-t ${isDarkMode ? 'from-slate-950 via-slate-950/20' : 'from-white via-white/20'} to-transparent`}></div>
            <div className="absolute top-8 left-8 right-8 flex justify-between items-center">
              <button onClick={onClose} className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-2xl rounded-2xl text-white transition-all border border-white/20 shadow-xl">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="px-8 md:px-16 -mt-24 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end gap-8 mb-12">
              <div className="relative shrink-0">
                <img src={app.icon} className={`w-40 h-40 rounded-[3.5rem] border-[10px] ${isDarkMode ? 'border-slate-950 shadow-brand-500/10' : 'border-white'} shadow-2xl object-cover bg-slate-100 transition-transform hover:scale-105 duration-500`} alt="Icon" />
                <div className="absolute -bottom-3 -right-3 bg-brand-600 p-3 rounded-2xl text-white shadow-xl border-4 border-slate-950">
                  <ShieldCheck size={24} strokeWidth={3} />
                </div>
              </div>
              <div className="pb-2">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 leading-tight">{app.name}</h2>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="px-4 py-2 bg-brand-600/10 rounded-full border border-brand-500/20 flex items-center gap-2">
                     <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></div>
                     <span className="text-brand-500 font-black text-[10px] uppercase tracking-widest">{app.developer}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex border-b border-slate-100 dark:border-slate-800/50 mb-12 overflow-x-auto scrollbar-hide sticky top-0 bg-white/5 backdrop-blur-xl z-20">
              {[
                { id: 'info', label: 'সারাংশ', icon: Info },
                { id: 'reviews', label: 'রেটিং ও রিভিউ', icon: MessageSquare },
                { id: 'history', label: 'আপডেট লগ', icon: History }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-3 px-10 py-5 border-b-4 transition-all whitespace-nowrap text-[11px] font-black uppercase tracking-widest ${
                    activeTab === tab.id 
                    ? 'border-brand-600 text-brand-600' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <tab.icon size={16} /> {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'info' && (
              <div className="animate-slide-up space-y-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className={`p-8 rounded-[3rem] ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100'} border flex flex-col items-center text-center shadow-sm`}>
                    <Star className="text-amber-500 mb-3" size={24} fill="currentColor" />
                    <p className="text-2xl font-black">{app.rating}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Score</p>
                  </div>
                  <div className={`p-8 rounded-[3rem] ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100'} border flex flex-col items-center text-center shadow-sm`}>
                    <HardDrive className="text-brand-500 mb-3" size={24} />
                    <p className="text-2xl font-black">{app.size}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Size</p>
                  </div>
                  <div className={`p-8 rounded-[3rem] ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100'} border flex flex-col items-center text-center shadow-sm`}>
                    <Download className="text-emerald-500 mb-3" size={24} />
                    <p className="text-2xl font-black">{app.downloads}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Installs</p>
                  </div>
                </div>

                <div className="p-10 rounded-[3.5rem] bg-slate-900 text-white relative overflow-hidden shadow-2xl border border-white/5 group">
                   <div className="flex items-center gap-8 relative z-10">
                      <div className="bg-brand-600 p-5 rounded-[2rem] shadow-brand border border-white/20 group-hover:scale-110 transition-transform">
                         <ShieldCheck size={32} />
                      </div>
                      <div>
                         <h4 className="text-2xl font-black mb-2 flex items-center gap-3">Nova Sentinel Security <Zap size={20} className="text-amber-400" /></h4>
                         <p className="text-sm font-medium text-slate-400 leading-relaxed uppercase tracking-wider">এটি একটি ভেরিফাইড প্যাকেজ। নূর নবী ইসলাম ব্যক্তিগতভাবে এই অ্যাপের সিকিউরিটি চেক করেছেন।</p>
                      </div>
                   </div>
                   <Fingerprint size={180} className="absolute -right-10 -bottom-10 text-white opacity-5 pointer-events-none" />
                </div>

                <section>
                  <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
                    <FileText size={16} /> বিস্তারিত বিবরণ
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-lg">
                    {app.description}
                  </p>
                </section>
              </div>
            )}
          </div>
        </div>

        <div className={`absolute bottom-0 left-0 right-0 p-8 md:p-12 ${isDarkMode ? 'bg-slate-950/90' : 'bg-white/90'} backdrop-blur-3xl border-t border-slate-100 dark:border-slate-800/50`}>
           {isInstalling ? (
             <div className="space-y-6 animate-slide-up">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <RefreshCcw className="w-6 h-6 text-brand-600 animate-spin" />
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-600">{installMessages[installStep]}</span>
                   </div>
                   <span className="text-sm font-black text-brand-600">{Math.round((downloadedMB / totalMB) * 100)}%</span>
                </div>
                <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                   <div className="h-full bg-brand-600 transition-all duration-300 ease-out shadow-brand" style={{ width: `${Math.min((downloadedMB / totalMB) * 100, 100)}%` }}></div>
                </div>
             </div>
           ) : (
             <div className="flex items-center gap-6">
                <button 
                  onClick={onInstall}
                  disabled={isInstalled}
                  className={`flex-1 py-6 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.3em] transition-all active:scale-95 flex items-center justify-center gap-4 shadow-2xl ${
                    isInstalled ? 'bg-emerald-500 text-white shadow-emerald-500/20' : (isOnline ? 'bg-brand-600 text-white shadow-brand' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed')
                  }`}
                >
                   {isInstalled ? <><CheckCircle size={22} /> ইন্সটল করা আছে</> : (isOnline ? <><Download size={22} /> এখনই ইন্সটল করুন</> : <><CloudOff size={22} /> অফলাইনে ডাউনলোড সম্ভব নয়</>)}
                </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AppDetails;
