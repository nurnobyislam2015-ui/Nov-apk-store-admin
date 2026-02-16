
import React, { useState } from 'react';
import { ShieldCheck, Package, Lock, Activity, Cloud, Save, Copy, CheckCircle, ExternalLink, Key, AlertCircle } from 'lucide-react';
import { AppData, UserRole, Language } from '../types';

interface AdminPortalProps {
  apps: AppData[];
  userRole: UserRole;
  lang: Language;
  onDeleteApp: (id: string) => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ apps, userRole, lang, onDeleteApp }) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'apps' | 'cloud' | 'rules'>('dashboard');
  const [copied, setCopied] = useState(false);

  const firestoreRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; 
    }
  }
}`;

  const storageRules = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  if (userRole !== 'admin') return (
    <div className="min-h-screen flex items-center justify-center p-8">
       <div className="text-center bg-slate-900 p-12 rounded-[3.5rem] border border-red-500/20 shadow-2xl max-w-lg">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={40} className="text-red-500" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Access Denied</h2>
          <p className="text-slate-500 leading-relaxed font-medium">
            This dashboard is reserved for <span className="text-brand-500 font-black">Md Nur Noby Islam</span>. 
            Standard users cannot modify store infrastructure or core databases.
          </p>
          <div className="mt-8 pt-8 border-t border-slate-800">
             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Verification Status</p>
             <p className="text-red-400 font-black text-xs mt-2 uppercase">Identity Mismatch</p>
          </div>
       </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-10 animate-slide-up pb-32">
      <header className="bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-900 p-12 rounded-[4rem] text-white shadow-brand relative overflow-hidden">
        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mb-4 border border-white/10">
            Authenticated: Proprietor
          </div>
          <h2 className="text-5xl font-black tracking-tighter">Nova Control Engine</h2>
          <p className="text-brand-100 opacity-80 mt-2 font-medium">Md Nur Noby Islam - Full Infrastructure Governance</p>
        </div>
        <Activity size={250} className="absolute -right-20 -bottom-20 opacity-10" />
      </header>

      <div className="flex gap-2 p-2 bg-white dark:bg-slate-900 rounded-[2.5rem] w-fit border dark:border-slate-800 overflow-x-auto scrollbar-hide shadow-xl">
        {[
          { id: 'dashboard', label: 'ওভারভিউ', icon: Activity },
          { id: 'apps', label: 'অ্যাপস লিস্ট', icon: Package },
          { id: 'cloud', label: 'প্রজেক্ট সেটআপ', icon: Cloud },
          { id: 'rules', label: 'পারমিশন ফিক্স', icon: ShieldCheck },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeAdminTab === tab.id ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {activeAdminTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up">
           <div className="p-10 bg-white dark:bg-slate-900 rounded-[3.5rem] border dark:border-slate-800 shadow-premium group">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Inventory</p>
              <h4 className="text-5xl font-black dark:text-white group-hover:text-brand-500 transition-colors">{apps.length}</h4>
              <p className="text-xs text-slate-500 mt-2 font-medium">Managed Packages</p>
           </div>
           <div className="p-10 bg-white dark:bg-slate-900 rounded-[3.5rem] border dark:border-slate-800 shadow-premium">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Instance Status</p>
              <h4 className="text-5xl font-black text-emerald-500 uppercase flex items-center gap-3">
                Live <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
              </h4>
              <p className="text-xs text-slate-500 mt-2 font-medium">Production Environment</p>
           </div>
           <div className="p-10 bg-white dark:bg-slate-900 rounded-[3.5rem] border dark:border-slate-800 shadow-premium">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Auth Layer</p>
              <h4 className="text-5xl font-black text-brand-500 uppercase">Proprietary</h4>
              <p className="text-xs text-slate-500 mt-2 font-medium">Access: Root Admin</p>
           </div>
        </div>
      )}

      {activeAdminTab === 'rules' && (
        <div className="space-y-8 animate-slide-up">
          <div className="p-10 bg-red-500/5 border border-red-500/20 rounded-[3rem] flex items-center gap-6">
            <div className="bg-red-500 p-4 rounded-[1.5rem] text-white shadow-lg">
              <AlertCircle size={32} />
            </div>
            <div>
              <h4 className="text-xl font-black dark:text-white mb-1">Permission Error Detected?</h4>
              <p className="text-sm text-slate-500 font-medium">"Missing or insufficient permissions" means your Firebase Security Rules are blocking the connection. Copy the code below to your Firebase Console.</p>
            </div>
          </div>

          <div className="p-12 bg-white dark:bg-slate-900 rounded-[4rem] border dark:border-slate-800 shadow-premium">
            <h4 className="text-2xl font-black dark:text-white mb-10 flex items-center gap-3">
              <ShieldCheck className="text-brand-500" /> Firebase Rules Configuration
            </h4>
            
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-brand-500 tracking-widest">1. Cloud Firestore Rules</span>
                    <span className="text-xs text-slate-400 font-medium mt-1">Paste this in: Firebase Console > Build > Firestore Database > Rules</span>
                  </div>
                  <button onClick={() => copyToClipboard(firestoreRules)} className="flex items-center gap-2 px-6 py-3 bg-brand-500/10 text-brand-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-500 hover:text-white transition-all">
                    {copied ? <CheckCircle size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy Rules"}
                  </button>
                </div>
                <div className="relative group">
                   <pre className="p-8 bg-slate-950 text-emerald-400 rounded-[2.5rem] text-sm font-mono overflow-x-auto border border-white/5 shadow-2xl leading-relaxed">
                    {firestoreRules}
                   </pre>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest">2. Cloud Storage Rules</span>
                    <span className="text-xs text-slate-400 font-medium mt-1">Paste this in: Firebase Console > Build > Storage > Rules</span>
                  </div>
                  <button onClick={() => copyToClipboard(storageRules)} className="flex items-center gap-2 px-6 py-3 bg-amber-500/10 text-amber-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all">
                    {copied ? <CheckCircle size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy Rules"}
                  </button>
                </div>
                <div className="relative group">
                   <pre className="p-8 bg-slate-950 text-amber-400 rounded-[2.5rem] text-sm font-mono overflow-x-auto border border-white/5 shadow-2xl leading-relaxed">
                    {storageRules}
                   </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeAdminTab === 'apps' && (
        <div className="grid grid-cols-1 gap-4 animate-slide-up">
           <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-black dark:text-white">Active Repository ({apps.length})</h4>
           </div>
           {apps.map(app => (
             <div key={app.id} className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 flex items-center justify-between shadow-sm hover:border-brand-500/30 transition-all">
                <div className="flex items-center gap-6">
                   <div className="relative">
                      <img src={app.icon} className="w-16 h-16 rounded-[1.5rem] shadow-xl" alt="" />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full"></div>
                   </div>
                   <div>
                      <h5 className="text-lg font-black dark:text-white">{app.name}</h5>
                      <div className="flex items-center gap-3">
                        <p className="text-[10px] text-brand-500 uppercase font-black tracking-widest">{app.category}</p>
                        <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">v{app.version}</p>
                      </div>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex flex-col items-end mr-6">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Storage Used</p>
                    <p className="text-sm font-black dark:text-white">{app.size}</p>
                  </div>
                  <button 
                    onClick={() => onDeleteApp(app.id)}
                    className="p-5 bg-red-500/10 text-red-500 rounded-[1.5rem] hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-95"
                  >
                    <Package size={20} />
                  </button>
                </div>
             </div>
           ))}
        </div>
      )}

      {activeAdminTab === 'cloud' && (
        <div className="p-12 bg-white dark:bg-slate-900 rounded-[4rem] border dark:border-slate-800 space-y-12 animate-slide-up shadow-premium">
           <div className="flex items-center gap-6 mb-4">
              <div className="p-5 bg-brand-500 rounded-[2rem] text-white shadow-brand">
                 <Cloud size={32} />
              </div>
              <div>
                <h4 className="text-3xl font-black dark:text-white uppercase tracking-tighter">System Linking Guide</h4>
                <p className="text-slate-500 font-medium">Md Nur Noby Islam: Use this guide to connect a new Firebase environment.</p>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                 <h5 className="text-[10px] font-black text-brand-500 uppercase tracking-[0.3em] flex items-center gap-2">
                    <div className="w-2 h-2 bg-brand-500 rounded-full"></div> Phase 01: Provisioning
                 </h5>
                 <p className="text-sm text-slate-500 font-bold leading-relaxed">
                    ১. <a href="https://console.firebase.google.com/" target="_blank" className="text-brand-600 underline font-black">Firebase Console</a>-এ প্রজেক্ট খুলুন।<br/>
                    ২. "Authentication" এনাবল করুন (Email/Password)।<br/>
                    ৩. "Firestore Database" এনাবল করুন (Production Mode)।<br/>
                    ৪. "Storage" এনাবল করুন।
                 </p>
                 <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border dark:border-slate-700">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Target Config</p>
                    <p className="text-xs font-medium text-slate-500 italic">Project Settings > Your Apps > Web App > Config Object</p>
                 </div>
              </div>
              
              <div className="space-y-6">
                 <h5 className="text-[10px] font-black text-brand-500 uppercase tracking-[0.3em] flex items-center gap-2">
                    <div className="w-2 h-2 bg-brand-500 rounded-full"></div> Phase 02: Injection
                 </h5>
                 <p className="text-sm text-slate-500 font-bold leading-relaxed">
                    আপনার প্রোজেক্টের <span className="text-amber-600 font-black">lib/firebase.ts</span> ফাইলে `firebaseConfig` অবজেক্টটি নতুন কী (Key) গুলো দিয়ে রিপ্লেস করুন।
                 </p>
                 <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] text-emerald-600 text-[10px] font-black uppercase flex items-center gap-3">
                    <CheckCircle size={16} /> Global Cloud Synchronization Enabled
                 </div>
                 <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Live Logs</p>
                    <p className="text-[10px] font-mono text-emerald-400">System ready for deployment...</p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortal;
