
import React, { useState } from 'react';
import { Github, Globe, FileCode, FolderClosed, Smartphone, Monitor, Info, AlertTriangle, CheckCircle2, ListChecks, ArrowUpCircle, তExternalLink, ShieldCheck } from 'lucide-react';

const HostingHub: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'checklist'>('guide');

  const allFiles = [
    { name: 'App.tsx', category: 'Core', desc: 'Main Logic' },
    { name: 'index.tsx', category: 'Core', desc: 'Entry Point' },
    { name: 'index.html', category: 'Core', desc: 'Web Wrapper' },
    { name: 'package.json', category: 'Config', desc: 'Dependencies' },
    { name: 'vite.config.ts', category: 'Config', desc: 'Build Settings' },
    { name: 'vercel.json', category: 'Hosting', desc: 'Vercel Rules' },
    { name: 'firebase.json', category: 'Firebase', desc: 'Database Rules' },
    { name: 'manifest.json', category: 'PWA', desc: 'App Identity' },
    { name: 'components/', category: 'UI', desc: 'All 12+ UI Components' },
    { name: 'lib/firebase.ts', category: 'Backend', desc: 'Cloud Connection' },
    { name: 'services/', category: 'AI', desc: 'Gemini Engine' },
    { name: 'constants.ts', category: 'Data', desc: 'App Mock Data' },
    { name: 'types.ts', category: 'Dev', desc: 'Types & Interfaces' }
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 animate-slide-up pb-40">
      <header className="text-center mb-16">
        <div className="w-24 h-24 bg-brand-600 rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-8 shadow-brand ring-8 ring-brand-500/10">
          <Github size={40} />
        </div>
        <h2 className={`text-5xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'} tracking-tighter`}>
          গিটহাব আপলোড মাস্টার গাইড
        </h2>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg">
          নূর নবী ভাই, আপনার স্টোরটি ইন্টারনেটে ছাড়ার আগে নিশ্চিত করুন যে এই সবগুলো ফাইল গিটহাবে আছে।
        </p>
      </header>

      <div className="flex p-2 bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] w-fit mx-auto mb-16 border dark:border-slate-800 shadow-inner">
        <button 
          onClick={() => setActiveTab('guide')}
          className={`px-10 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'guide' ? 'bg-brand-600 text-white shadow-xl' : 'text-slate-500'}`}
        >
          <div className="flex items-center gap-3"><Smartphone size={16} /> মোবাইল গাইড</div>
        </button>
        <button 
          onClick={() => setActiveTab('checklist')}
          className={`px-10 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'checklist' ? 'bg-brand-600 text-white shadow-xl' : 'text-slate-500'}`}
        >
          <div className="flex items-center gap-3"><ListChecks size={16} /> ফাইল চেকলিস্ট</div>
        </button>
      </div>

      {activeTab === 'guide' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-slide-up">
           <div className={`p-10 rounded-[4rem] ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border shadow-premium`}>
              <h3 className={`text-2xl font-black mb-8 flex items-center gap-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                <Monitor className="text-brand-500" /> মোবাইল দিয়ে আপলোড ট্রিক
              </h3>
              <div className="space-y-8">
                 {[
                   { t: "১. Chrome ওপেন করুন", d: "আপনার ফোনে গুগল ক্রোম ব্রাউজারটি ওপেন করে github.com এ আপনার অ্যাকাউন্টে লগইন করুন।" },
                   { t: "২. Desktop Site অন করুন", d: "ব্রাউজারের ৩টি ডট মেনু থেকে 'Desktop Site' অন করুন। এটি না করলে আপনি ফোল্ডার আপলোড করতে পারবেন না।" },
                   { t: "৩. 'Add File' ক্লিক করুন", d: "আপনার রিপোজিটরিতে গিয়ে 'Add file' > 'Upload files' এ ক্লিক করুন।" },
                   { t: "৪. ফাইল সিলেক্ট করুন", d: "আমার দেওয়া সবগুলো ফাইল এবং ফোল্ডার সিলেক্ট করে 'Commit changes' বাটনে ক্লিক করে সেভ করুন।" }
                 ].map((step, i) => (
                   <div key={i} className="flex gap-6">
                      <div className="w-10 h-10 bg-brand-500/10 text-brand-600 rounded-2xl flex items-center justify-center font-black shrink-0 text-sm">{i+1}</div>
                      <div>
                         <p className={`font-black text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{step.t}</p>
                         <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">{step.d}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="space-y-8">
              <div className="p-10 rounded-[3.5rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
                 <h4 className="text-2xl font-black mb-6 relative z-10">সরাসরি গিটহাবে যান</h4>
                 <p className="text-slate-400 text-sm font-medium mb-8 relative z-10 leading-relaxed">
                   নিচের বাটনে ক্লিক করে গিটহাবে গিয়ে আপনার নতুন রিপোজিটরি তৈরি করুন।
                 </p>
                 <button 
                  onClick={() => window.open('https://github.com/new', '_blank')}
                  className="w-full py-6 bg-brand-600 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-brand-500 transition-all shadow-xl flex items-center justify-center gap-4 relative z-10"
                 >
                    GitHub ওপেন করুন <ExternalLink size={18} />
                 </button>
                 <Github size={200} className="absolute -right-16 -bottom-16 opacity-5 rotate-12" />
              </div>

              <div className={`p-10 rounded-[3.5rem] border-4 border-dashed ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} flex flex-col items-center text-center`}>
                 <div className="w-16 h-16 bg-amber-500/10 text-amber-600 rounded-3xl flex items-center justify-center mb-6">
                    <AlertTriangle size={32} />
                 </div>
                 <h5 className={`font-black text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>একটি কথা মনে রাখবেন</h5>
                 <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    আপনার ফোল্ডারগুলো জিপ (ZIP) করে আপলোড করবেন না। ব্রাউজার থেকে সরাসরি ফাইলগুলো সিলেক্ট করবেন।
                 </p>
              </div>
           </div>
        </div>
      ) : (
        <div className={`p-10 rounded-[4rem] ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border shadow-premium animate-slide-up`}>
           <div className="flex items-center justify-between mb-12">
              <h3 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'} tracking-tight`}>মাস্টার ফাইল চেকলিস্ট</h3>
              <div className="px-5 py-2 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                 All Systems Verified
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allFiles.map((file, i) => (
                <div key={i} className={`p-6 rounded-3xl ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'} border flex items-center gap-5 group hover:border-brand-500 transition-all`}>
                   <div className={`${file.name.includes('/') ? 'text-amber-500' : 'text-blue-500'} group-hover:scale-110 transition-transform`}>
                      {file.name.includes('/') ? <FolderClosed size={24} fill="currentColor" className="opacity-20" /> : <FileCode size={24} />}
                   </div>
                   <div className="flex-1">
                      <div className="flex items-center justify-between">
                         <p className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{file.name}</p>
                         <CheckCircle2 size={14} className="text-slate-300 dark:text-slate-700" />
                      </div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-60">{file.category} • {file.desc}</p>
                   </div>
                </div>
              ))}
           </div>

           <div className="mt-12 pt-12 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-brand">
                    <Globe size={24} />
                 </div>
                 <div className="text-left">
                    <p className={`font-black text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>এরপর Vercel এ কানেক্ট করুন</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Cloud Deployment</p>
                 </div>
              </div>
              <button 
                onClick={() => window.open('https://vercel.com/new', '_blank')}
                className="px-12 py-5 bg-slate-900 text-white dark:bg-white dark:text-slate-950 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all"
              >
                 Vercel এ যান <ArrowUpCircle size={18} className="inline ml-2" />
              </button>
           </div>
        </div>
      )}

      <footer className="mt-20 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Build for Greatness</p>
        <h5 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Md Nur Noby Islam</h5>
        <div className="flex items-center justify-center gap-4 mt-6">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">System Ready for Production</span>
        </div>
      </footer>
    </div>
  );
};

export default HostingHub;
