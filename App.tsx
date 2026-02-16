
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, Package, Home, Sparkles, ShieldCheck, Settings, Activity, Plus, Cloud, AlertTriangle, X, TrendingUp, Clock, Star, Zap, Bell, CheckCircle2, Info, ArrowUpRight, LayoutGrid, Heart, Flag } from 'lucide-react';
import { MOCK_APPS, APP_CATEGORIES } from './constants';
import { AppData, ViewState, User as UserType, Language } from './types';
import { db, collection, onSnapshot, query, orderBy, isFirebaseConfigured, doc, deleteDoc } from './lib/firebase';
import Sidebar from './components/Sidebar';
import AppCard from './components/AppCard';
import AppDetails from './components/AppDetails';
import Auth from './components/Auth';
import AdminPortal from './components/AdminPortal';
import AIStudio from './components/AIStudio';
import SecurityCenter from './components/SecurityCenter';
import SubmitApp from './components/SubmitApp';
import UserLibrary from './components/UserLibrary';
import SupportChat from './components/SupportChat';
import HostingHub from './components/HostingHub';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [lang, setLang] = useState<Language>('bn');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('সব (All)');
  const [apps, setApps] = useState<AppData[]>(MOCK_APPS);
  const [isCloudMode, setIsCloudMode] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Installation state
  const [installedAppIds, setInstalledAppIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('nova_installed_apps');
    return saved ? JSON.parse(saved) : [];
  });
  const [installingAppId, setInstallingAppId] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<UserType | null>(() => {
    const saved = localStorage.getItem('nova_user');
    return saved ? JSON.parse(saved) : null;
  });

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    localStorage.setItem('nova_installed_apps', JSON.stringify(installedAppIds));
  }, [installedAppIds]);

  useEffect(() => {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, "apps"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const cloudApps = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as AppData[];
          
          if (cloudApps.length > 0) {
            setApps([...MOCK_APPS, ...cloudApps]);
          } else {
            setApps(MOCK_APPS);
          }
          setPermissionError(false);
          setIsCloudMode(true);
        }, (error) => {
          console.warn("Firebase Sync Error:", error);
          if (error.message.toLowerCase().includes("permission") || error.code === 'permission-denied') {
            setPermissionError(true);
          }
          setApps(MOCK_APPS);
          setIsCloudMode(false);
        });
        return () => unsubscribe();
      } catch (e) {
        console.error("Firebase Initialization Error:", e);
        setApps(MOCK_APPS);
        setIsCloudMode(false);
      }
    } else {
      setApps(MOCK_APPS);
    }
  }, []);

  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'সব (All)' || app.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, apps]);

  const featuredApp = useMemo(() => apps.find(a => a.isFeatured) || apps[0], [apps]);
  const trendingApps = useMemo(() => apps.slice(0, 4), [apps]);
  const bdPopularApps = useMemo(() => apps.filter(a => a.category === 'বাংলাদেশী (BD Local)' || a.category === 'শিক্ষা (Edu)' || a.category === 'ফিনটেক (Fintech)').slice(0, 8), [apps]);
  const topCharts = useMemo(() => [...apps].sort((a, b) => b.rating - a.rating).slice(0, 6), [apps]);

  const handleAppSubmit = (newAppData: Omit<AppData, 'id'>) => {
    setCurrentView('home');
    addToast("অ্যাপটি সফলভাবে স্টোরে যুক্ত হয়েছে!", "success");
  };

  const deleteApp = async (id: string) => {
    if (isCloudMode && db) {
      try {
        await deleteDoc(doc(db, "apps", id));
        addToast("প্যাকেজ ডিলিট করা হয়েছে", "info");
      } catch (e) {
        addToast("ডিলিট করতে সমস্যা হয়েছে", "error");
      }
    }
  };

  const handleInstall = (id: string) => {
    setInstallingAppId(id);
    addToast("ইন্সটলেশন শুরু হয়েছে...", "info");
  };

  const handleFinishInstall = () => {
    if (installingAppId) {
      setInstalledAppIds(prev => Array.from(new Set([...prev, installingAppId])));
      setInstallingAppId(null);
      addToast("সফলভাবে ইন্সটল হয়েছে!", "success");
    }
  };

  const handleUninstall = (id: string) => {
    setInstalledAppIds(prev => prev.filter(appId => appId !== id));
    addToast("অ্যাপটি আনইনস্টল করা হয়েছে", "info");
  };

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'dark bg-[#020617]' : 'bg-slate-50'} transition-all duration-500 font-sans selection:bg-brand-500 selection:text-white`}>
      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        userRole={currentUser?.role || 'guest'} 
        currentUser={currentUser} 
        isDarkMode={isDarkMode} 
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
        lang={lang} 
        setLang={setLang} 
        isFirebaseConfigured={isCloudMode} 
        isOnline={navigator.onLine}
        onShare={() => {
          if (navigator.share) {
            navigator.share({ title: 'Nova Store', text: 'Best APKs by Nur Noby Islam!', url: window.location.href });
          }
        }}
      />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <SupportChat isDarkMode={isDarkMode} />
        
        <div className="fixed bottom-24 md:bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
          {toasts.map(toast => (
            <div key={toast.id} className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl animate-slide-up ${
              toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
              toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
              'bg-brand-500/10 border-brand-500/20 text-brand-500'
            }`}>
              {toast.type === 'success' && <CheckCircle2 size={18} />}
              {toast.type === 'error' && <AlertTriangle size={18} />}
              {toast.type === 'info' && <Info size={18} />}
              <span className="text-xs font-black uppercase tracking-widest">{toast.message}</span>
            </div>
          ))}
        </div>

        <header className="sticky top-0 z-40 px-6 py-5 bg-white/50 dark:bg-[#020617]/50 backdrop-blur-3xl border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between gap-4">
          <div className="flex-1 max-w-xl relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder={lang === 'bn' ? "বাংলাদেশে জনপ্রিয় অ্যাপগুলো খুঁজুন..." : "Search top BD Apps..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-brand-500/30 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold outline-none dark:text-white transition-all shadow-inner"
            />
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-500 rounded-full text-[10px] font-black uppercase border border-red-500/20">
                <Flag size={14} className="fill-red-500" /> Proudly BD
             </div>
             <button onClick={() => setCurrentView('auth')} className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-brand-500/50 shadow-brand/20 hover:scale-105 transition-transform active:scale-95">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name || 'Nur'}`} alt="User" />
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-8 pb-40">
          {currentView === 'home' && (
            <div className="animate-slide-up space-y-16">
              {!searchQuery && selectedCategory === 'সব (All)' && (
                <div 
                  onClick={() => featuredApp && setSelectedAppId(featuredApp.id)}
                  className="relative h-80 md:h-[500px] rounded-[3.5rem] overflow-hidden cursor-pointer group shadow-2xl border border-white/5"
                >
                  <img src={featuredApp?.banner} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s] ease-out" alt="Featured" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-12 left-12 right-12 flex flex-col items-start gap-5">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-600/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white border border-white/10 flex items-center gap-2">
                        <Flag size={12} fill="white" /> Top in Bangladesh
                      </div>
                      <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white border border-white/10">
                        Editor's Choice
                      </div>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">{featuredApp?.name}</h1>
                    <p className="text-white/70 max-w-xl text-base md:text-xl font-medium line-clamp-2 leading-relaxed">{featuredApp?.description}</p>
                    <div className="flex items-center gap-4 mt-4">
                       <button className="bg-white text-slate-950 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-500 hover:text-white transition-all shadow-xl group/btn flex items-center gap-2">
                          Get Now <ArrowUpRight size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                       </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 sticky top-0 z-30 bg-transparent py-4">
                {APP_CATEGORIES.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border shadow-sm ${
                      selectedCategory === cat 
                      ? 'bg-red-600 text-white border-red-500 shadow-xl translate-y-[-2px]' 
                      : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl text-slate-500 border-slate-200/50 dark:border-slate-800/50 hover:border-brand-500/30'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {!searchQuery && selectedCategory === 'সব (All)' && (
                <>
                  <section className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-3xl font-black dark:text-white flex items-center gap-4">
                        <Flag className="text-red-500" fill="currentColor" /> Popular in Bangladesh
                      </h2>
                      <button className="text-[10px] font-black text-brand-500 uppercase tracking-widest hover:underline px-4 py-2 bg-brand-500/5 rounded-full">Explore Local</button>
                    </div>
                    <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-6">
                      {bdPopularApps.map(app => (
                        <div key={app.id} onClick={() => setSelectedAppId(app.id)} className="shrink-0 w-64 p-6 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 hover:shadow-premium cursor-pointer transition-all hover:scale-[1.02]">
                          <img src={app.icon} className="w-24 h-24 rounded-[2rem] shadow-xl object-cover mb-4" alt="" />
                          <h4 className="font-black text-xl tracking-tight dark:text-white mb-1 truncate">{app.name}</h4>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{app.category}</p>
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-1.5 text-amber-500">
                                <Star size={12} fill="currentColor" /> <span className="text-xs font-black">{app.rating}</span>
                             </div>
                             <span className="text-[10px] font-black text-brand-600">{app.downloads}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-3xl font-black dark:text-white flex items-center gap-4">
                        <TrendingUp className="text-emerald-500" /> Top Charts
                      </h2>
                      <div className="flex gap-2">
                        <button className="text-[10px] font-black text-brand-500 uppercase tracking-widest px-4 py-2 bg-brand-500/10 rounded-full">Top Free</button>
                        <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">Popular</button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {topCharts.map((app, idx) => (
                        <div key={app.id} onClick={() => setSelectedAppId(app.id)} className="flex items-center gap-6 p-6 hover:bg-white dark:hover:bg-slate-900 rounded-[2.5rem] cursor-pointer group transition-all">
                          <span className="text-3xl font-black text-slate-200 dark:text-slate-800 w-8">{idx + 1}</span>
                          <img src={app.icon} className="w-16 h-16 rounded-2xl shadow-lg" alt="" />
                          <div className="flex-1">
                            <h4 className="font-black text-base dark:text-white">{app.name}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{app.category}</p>
                          </div>
                          <button className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 rounded-xl font-black text-[10px] uppercase tracking-widest group-hover:bg-red-600 group-hover:text-white transition-all">
                            Install
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}

              <section>
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-3xl font-black dark:text-white flex items-center gap-4">
                    <Zap className="text-brand-500" /> {lang === 'bn' ? 'সব অ্যাপ' : 'Marketplace Catalog'}
                  </h2>
                  <div className="hidden md:flex px-5 py-2.5 bg-brand-500/10 text-brand-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-500/20 shadow-sm">
                    Verified Repository: Md Nur Noby Islam
                  </div>
                </div>
                
                {filteredApps.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                    {filteredApps.map(app => (
                      <AppCard key={app.id} app={app} onClick={() => setSelectedAppId(app.id)} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900/50 rounded-[5rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                      <Package size={40} className="text-slate-300" />
                    </div>
                    <p className="font-black uppercase tracking-[0.3em] text-sm text-slate-400">Empty Environment</p>
                  </div>
                )}
              </section>

              <footer className="pt-24 pb-12 text-center">
                <div className="w-16 h-1 bg-red-500/20 rounded-full mx-auto mb-8"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Designed & Managed By</p>
                <h4 className="text-2xl font-black dark:text-white tracking-tighter">Md Nur Noby Islam</h4>
                <p className="text-slate-500 text-xs mt-1">Number 1 Bangladeshi Premium Store Engine</p>
              </footer>
            </div>
          )}

          {currentView === 'ai-studio' && <AIStudio lang={lang} isDarkMode={isDarkMode} isOnline={navigator.onLine} />}
          {currentView === 'security' && <SecurityCenter isDarkMode={isDarkMode} />}
          {currentView === 'submit-app' && <SubmitApp lang={lang} isDarkMode={isDarkMode} isCloudMode={isCloudMode} onOfflineSubmit={handleAppSubmit} />}
          {currentView === 'admin-portal' && <AdminPortal apps={apps} userRole={currentUser?.role || 'guest'} lang={lang} onDeleteApp={deleteApp} />}
          {currentView === 'hosting' && <HostingHub isDarkMode={isDarkMode} />}
          {currentView === 'auth' && <Auth onLogin={(u) => { setCurrentUser(u); setCurrentView('home'); addToast(`স্বাগতম, ${u.name}!`, "success"); }} onClose={() => setCurrentView('home')} />}
          {currentView === 'installed' && (
            <UserLibrary 
              installedApps={apps.filter(app => installedAppIds.includes(app.id))} 
              userSubmissions={apps.filter(app => app.submittedBy === 'Md Nur Noby Islam')} 
              onUninstall={handleUninstall} 
              onUpdateApp={() => addToast("চেকিং ফর আপডেটস...", "info")} 
              onSubmitUpdate={() => {}} 
              currentUser={currentUser || { id: 'guest', name: 'Guest', email: '', role: 'guest', avatar: '' }} 
              isDarkMode={isDarkMode} 
              lang={lang} 
            />
          )}
        </div>

        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-3xl border-t border-slate-200/50 dark:border-slate-800/50 px-4 py-3 flex justify-around items-center">
           {[
             { id: 'home', label: 'Home', icon: Home },
             { id: 'ai-studio', label: 'AI', icon: Sparkles },
             { id: 'installed', label: 'Library', icon: LayoutGrid },
             { id: 'security', label: 'Guard', icon: ShieldCheck },
           ].map(item => (
             <button 
               key={item.id}
               onClick={() => setCurrentView(item.id as ViewState)}
               className={`flex flex-col items-center gap-1 transition-all ${currentView === item.id ? 'text-red-600 scale-110' : 'text-slate-400'}`}
             >
               <item.icon size={20} className={currentView === item.id ? 'fill-red-600/10' : ''} />
               <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
             </button>
           ))}
        </nav>

        {selectedAppId && (
          <AppDetails 
            lang={lang} 
            app={apps.find(a => a.id === selectedAppId)!} 
            onClose={() => setSelectedAppId(null)} 
            onAddReview={() => addToast("রিভিউ সাবমিট করা হয়েছে", "success")} 
            onInstall={() => handleInstall(selectedAppId)} 
            onFinishInstall={handleFinishInstall}
            isInstalled={installedAppIds.includes(selectedAppId)} 
            isInstalling={installingAppId === selectedAppId} 
            isDarkMode={isDarkMode} 
            isOnline={navigator.onLine}
          />
        )}
      </main>
    </div>
  );
};

export default App;
