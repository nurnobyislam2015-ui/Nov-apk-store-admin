
import React, { useState } from 'react';
import { Package, Clock, CheckCircle, XCircle, Download, ExternalLink, Trash2, ShieldCheck, RefreshCw, BarChart3, Users, Eye, Upload, Send, X, Star, HardDrive, Cpu } from 'lucide-react';
import { AppData, User, UpdateRequest, Language } from '../types';

interface UserLibraryProps {
  installedApps: AppData[];
  userSubmissions: AppData[];
  onUninstall: (appId: string) => void;
  onUpdateApp: (appId: string) => void;
  onSubmitUpdate: (appId: string, update: UpdateRequest) => void;
  currentUser: User | null;
  isDarkMode: boolean;
  lang: Language;
}

const UserLibrary: React.FC<UserLibraryProps> = ({ installedApps, userSubmissions, onUninstall, onUpdateApp, onSubmitUpdate, currentUser, isDarkMode, lang }) => {
  const [activeTab, setActiveTab] = React.useState<'installed' | 'submissions'>('installed');
  const [showUpdateForm, setShowUpdateForm] = useState<string | null>(null);
  const [updateVersion, setUpdateVersion] = useState('');
  const [updateNotes, setUpdateNotes] = useState('');

  const isRTL = lang === 'ar' || lang === 'ur';

  if (!currentUser) return null;

  const handleUpdateSubmit = (e: React.FormEvent, appId: string) => {
    e.preventDefault();
    if (!updateVersion || !updateNotes) return;
    onSubmitUpdate(appId, {
      version: updateVersion,
      releaseNotes: updateNotes,
      date: new Date().toISOString()
    });
    setShowUpdateForm(null);
    setUpdateVersion('');
    setUpdateNotes('');
  };

  const totalSizeUsed = installedApps.reduce((acc, app) => acc + (parseFloat(app.size) || 0), 0);

  const userStats = [
    { label: 'Installed', value: installedApps.length, icon: Package },
    { label: 'Submissions', value: userSubmissions.length, icon: Upload },
    { label: 'Storage Used', value: `${totalSizeUsed.toFixed(1)} MB`, icon: HardDrive },
  ];

  return (
    <div className={`p-4 md:p-8 max-w-7xl mx-auto animate-slide-up pb-32 ${isDarkMode ? 'text-white' : 'text-gray-900'} ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <header className={`flex flex-col md:flex-row md:items-center justify-between gap-10 mb-16 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <div className="flex items-center gap-4 mb-3">
             <div className="w-16 h-16 rounded-[2rem] overflow-hidden border-2 border-brand-500 p-1">
                <img src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`} className="w-full h-full rounded-[1.6rem] object-cover" alt="" />
             </div>
             <div>
                <h2 className="text-4xl font-black tracking-tight">{currentUser.name}</h2>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">{currentUser.role === 'admin' ? 'Nexus Proprietor' : 'Global Developer'}</p>
             </div>
          </div>
          <p className="text-slate-500 font-medium max-w-lg mt-4">Manage your personal repository, track installation growth, and push binary updates to the global node.</p>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {userStats.map((stat, i) => (
             <div key={i} className={`px-8 py-6 rounded-[2.5rem] border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} shadow-premium text-center min-w-[160px] group hover:border-brand-500/50 transition-all`}>
                <div className="bg-brand-500/10 p-2 rounded-xl w-fit mx-auto mb-3 text-brand-500 group-hover:scale-110 transition-transform">
                  <stat.icon size={18} />
                </div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-black tracking-tighter">{stat.value}</p>
             </div>
          ))}
        </div>
      </header>

      <div className={`flex p-2 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'} rounded-[2.5rem] w-fit mb-12 border shadow-inner ${isRTL ? 'flex-row-reverse' : ''}`}>
        <button 
          onClick={() => setActiveTab('installed')}
          className={`px-10 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'installed' ? 'bg-brand-600 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-brand-600'}`}
        >
          My Library ({installedApps.length})
        </button>
        <button 
          onClick={() => setActiveTab('submissions')}
          className={`px-10 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'submissions' ? 'bg-brand-600 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-brand-600'}`}
        >
          Nexus Hub ({userSubmissions.length})
        </button>
      </div>

      {activeTab === 'installed' ? (
        <div className="space-y-8">
          <div className={`p-10 rounded-[4rem] ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100'} border flex items-center justify-between shadow-sm overflow-hidden relative`}>
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="w-24 h-24 bg-brand-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-brand">
                   <Cpu size={40} />
                </div>
                <div>
                   <h4 className="text-2xl font-black mb-2 tracking-tight">Binary Storage Insights</h4>
                   <p className="text-slate-500 text-sm font-medium max-w-md">Your localized cache is holding {installedApps.length} packages. Clear unused binaries to optimize system response time.</p>
                </div>
                <div className="flex gap-4">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase mb-1">Quota Used</span>
                      <div className="w-48 h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: '15%' }}></div>
                      </div>
                   </div>
                </div>
             </div>
             <div className="absolute top-0 right-0 p-12 opacity-5">
                <BarChart3 size={200} />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {installedApps.length === 0 ? (
              <div className={`col-span-full py-32 text-center ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'} rounded-[4rem] border-4 border-dashed`}>
                <Package className="mx-auto text-slate-200 dark:text-slate-800 mb-6" size={64} />
                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">No Packages Discovered</p>
                <button className="mt-6 text-brand-500 font-black text-[10px] uppercase tracking-widest hover:underline">Browse Marketplace</button>
              </div>
            ) : (
              installedApps.map(app => (
                <div key={app.id} className={`${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-brand-500' : 'bg-white border-slate-100 hover:border-brand-500'} p-8 rounded-[3.5rem] border shadow-premium transition-all group relative ${isRTL ? 'text-right' : 'text-left'}`}>
                  {app.hasUpdate && (
                    <div className={`absolute -top-3 ${isRTL ? '-left-3' : '-right-3'} bg-red-500 text-white text-[10px] font-black px-5 py-2 rounded-2xl animate-bounce shadow-xl uppercase tracking-widest border-4 border-white dark:border-slate-900`}>
                      Update v{app.newVersion}
                    </div>
                  )}
                  <div className={`flex items-center gap-6 mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <img src={app.icon} className="w-20 h-20 rounded-[1.5rem] object-cover shadow-2xl group-hover:scale-105 transition-transform" alt="" />
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <h4 className="font-black text-xl leading-tight mb-1">{app.name}</h4>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{app.version}</p>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <p className="text-[10px] text-brand-500 font-black uppercase tracking-widest">{app.size}</p>
                      </div>
                      <div className={`flex items-center gap-2 text-emerald-500 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <ShieldCheck size={14} className="animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Verified Binary</span>
                      </div>
                    </div>
                  </div>
                  <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {app.hasUpdate ? (
                      <button 
                        onClick={() => onUpdateApp(app.id)}
                        className="flex-1 py-4 bg-brand-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-brand-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-500/20 active:scale-95"
                      >
                        <RefreshCw size={18} className="animate-spin-slow" /> Push Update
                      </button>
                    ) : (
                      <button className={`flex-1 py-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-900'} text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-brand-600 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95`}>
                        <ExternalLink size={18} /> Launch
                      </button>
                    )}
                    <button 
                      onClick={() => onUninstall(app.id)}
                      className={`p-4 ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-red-500/10' : 'bg-slate-50 text-slate-400 hover:bg-red-50'} hover:text-red-500 rounded-[1.5rem] transition-all active:scale-90`}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {userSubmissions.length === 0 ? (
             <div className={`py-32 text-center ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'} rounded-[4rem] border-4 border-dashed`}>
                <Clock className="mx-auto text-slate-200 dark:text-slate-800 mb-6" size={64} />
                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">No Assets Contributed</p>
                <button className="mt-6 text-brand-500 font-black text-[10px] uppercase tracking-widest hover:underline">Submit New APK</button>
             </div>
          ) : (
            userSubmissions.map(app => (
              <div key={app.id} className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} p-10 rounded-[4rem] border shadow-premium flex flex-col gap-8 relative overflow-hidden group`}>
                <div className={`flex flex-col md:flex-row md:items-center justify-between gap-10 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <img src={app.icon} className="w-20 h-20 rounded-[2rem] object-cover shadow-2xl group-hover:scale-105 transition-transform" alt="" />
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <h4 className="font-black text-2xl tracking-tight mb-1">{app.name}</h4>
                      <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest">{app.category} • Current: {app.version}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {app.pendingUpdate && (
                      <div className={`flex items-center gap-3 px-6 py-3 bg-blue-500/10 text-blue-600 rounded-full border border-blue-500/20 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Upload size={16} className="animate-bounce" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Update v{app.pendingUpdate.version} in review</span>
                      </div>
                    )}
                    {app.status === 'pending' && !app.pendingUpdate && (
                      <div className={`flex items-center gap-3 px-6 py-3 bg-amber-500/10 text-amber-600 rounded-full border border-amber-500/20 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Clock size={16} className="animate-spin-slow" />
                        <span className="text-[10px] font-black uppercase tracking-widest">In Security Review</span>
                      </div>
                    )}
                    {app.status === 'published' && (
                      <div className={`flex items-center gap-3 px-6 py-3 bg-emerald-500/10 text-emerald-600 rounded-full border border-emerald-500/20 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <CheckCircle size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Live Marketplace</span>
                      </div>
                    )}
                    {app.status === 'published' && !app.pendingUpdate && (
                      <button 
                        onClick={() => setShowUpdateForm(app.id)}
                        className="px-10 py-4 bg-brand-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-brand-700 transition-all shadow-xl shadow-brand-500/20 active:scale-95"
                      >
                        Push Update
                      </button>
                    )}
                  </div>
                </div>

                {showUpdateForm === app.id && (
                  <div className={`p-10 ${isDarkMode ? 'bg-slate-950/50' : 'bg-indigo-50/50'} rounded-[3rem] border border-indigo-100 dark:border-indigo-900/30 animate-slide-up ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className={`flex justify-between items-center mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <h5 className="font-black text-[11px] uppercase tracking-[0.3em] text-indigo-500">Binary Update Request</h5>
                      <button onClick={() => setShowUpdateForm(null)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                    </div>
                    <form onSubmit={(e) => handleUpdateSubmit(e, app.id)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="md:col-span-1">
                          <label className={`block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 ${isRTL ? 'text-right' : ''}`}>Version Code</label>
                          <input 
                            required
                            type="text" 
                            placeholder="e.g. 1.5.0" 
                            value={updateVersion}
                            onChange={e => setUpdateVersion(e.target.value)}
                            className={`w-full ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white'} border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-500 ${isRTL ? 'text-right' : ''} shadow-inner`}
                          />
                        </div>
                        <div className="md:col-span-3">
                          <label className={`block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 ${isRTL ? 'text-right' : ''}`}>Release Manifest</label>
                          <textarea 
                            required
                            placeholder="Briefly state the binary changes and patches..." 
                            value={updateNotes}
                            onChange={e => setUpdateNotes(e.target.value)}
                            className={`w-full ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white'} border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-500 min-h-[120px] resize-none ${isRTL ? 'text-right' : ''} shadow-inner`}
                          />
                        </div>
                      </div>
                      <button type="submit" className={`w-full md:w-fit px-12 py-5 bg-brand-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-700 transition-all shadow-xl shadow-brand-500/20 flex items-center justify-center gap-3 ${isRTL ? 'mr-auto' : ''}`}>
                        <Send size={18} /> Submit for Security Scan
                      </button>
                    </form>
                  </div>
                )}

                {app.status === 'published' && app.analytics && (
                  <div className={`grid grid-cols-3 gap-8 p-8 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'} rounded-[2.5rem] ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="text-center group/stat">
                      <div className={`flex items-center justify-center gap-3 text-blue-500 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Users size={20} className="group-hover/stat:scale-125 transition-transform" />
                        <span className="text-3xl font-black tracking-tighter">{app.analytics.totalInstalls}</span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Global Installs</p>
                    </div>
                    <div className={`text-center border-x ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200'} `}>
                      <div className={`flex items-center justify-center gap-3 text-emerald-500 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Eye size={20} />
                        <span className="text-3xl font-black tracking-tighter">{app.analytics.views}</span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Marketplace Hits</p>
                    </div>
                    <div className="text-center">
                      <div className={`flex items-center justify-center gap-3 text-purple-500 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <BarChart3 size={20} />
                        <span className="text-3xl font-black tracking-tighter">+{app.analytics.lastMonthInstalls}</span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">30D Growth</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default UserLibrary;
