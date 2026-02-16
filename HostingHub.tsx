
import React from 'react';
import { Rocket, Globe, Database, Smartphone, ArrowRight, CheckCircle2, Circle, Github, ExternalLink, ShieldCheck, Share2, Plus, Code } from 'lucide-react';

const HostingHub: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const uploadDestinations = [
    {
      title: '১. GitHub (কোড রাখার জায়গা)',
      desc: 'এখানে আপনার পুরো প্রোজেক্ট ফোল্ডারটি আপলোড করুন।',
      link: 'https://github.com/new',
      icon: Github,
      color: 'bg-slate-800',
      action: 'গিটহাবে আপলোড করুন'
    },
    {
      title: '২. Vercel (লিংক তৈরির জায়গা)',
      desc: 'গিটহাবের কোডটি এখানে কানেক্ট করলে আপনার ওয়েবসাইট লাইভ হবে।',
      link: 'https://vercel.com/new',
      icon: Globe,
      color: 'bg-blue-600',
      action: 'ভারসেলে লাইভ করুন'
    }
  ];

  const checklist = [
    "প্রথমে GitHub.com এ একটি অ্যাকাউন্ট খুলে কোড আপলোড করুন।",
    "এরপর Vercel-এ গিয়ে GitHub অ্যাকাউন্ট দিয়ে লগইন করুন।",
    "আপনার প্রোজেক্টটি সিলেক্ট করে 'Deploy' বাটনে ক্লিক করুন।",
    "ভারসেল থেকে পাওয়া লিংকটি বন্ধুদের সাথে শেয়ার করুন।"
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 animate-slide-up pb-32">
      <header className="text-center mb-16">
        <div className="w-20 h-20 bg-brand-600 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-6 shadow-brand">
          <Code size={32} />
        </div>
        <h2 className={`text-4xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'} tracking-tighter`}>
          কোথায় এবং কীভাবে আপলোড করবেন?
        </h2>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto">
          নূর নবী ভাই, আপনার এই স্টোরটি লাইভ করতে নিচের এই ২টি সাইট ব্যবহার করতে হবে।
        </p>
      </header>

      {/* Main Upload Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {uploadDestinations.map((dest, idx) => (
          <div 
            key={idx} 
            className={`p-10 rounded-[3.5rem] ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border shadow-premium flex flex-col transition-all hover:scale-[1.02] group`}
          >
            <div className={`w-16 h-16 ${dest.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:rotate-12 transition-transform`}>
              <dest.icon size={28} />
            </div>
            <h4 className={`text-2xl font-black mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{dest.title}</h4>
            <p className="text-slate-500 font-medium mb-10 flex-1 leading-relaxed">{dest.desc}</p>
            <a 
              href={dest.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-brand-600 hover:text-white transition-all shadow-sm"
            >
              {dest.action} <ExternalLink size={14} />
            </a>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Checklist */}
        <div className={`lg:col-span-2 p-12 rounded-[4rem] ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'} border shadow-premium`}>
          <h3 className={`text-2xl font-black mb-8 flex items-center gap-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <CheckCircle2 className="text-emerald-500" /> লাইভ করার চেকলিস্ট
          </h3>
          <div className="space-y-6">
            {checklist.map((item, i) => (
              <div key={i} className="flex items-start gap-6 group">
                <div className="w-8 h-8 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center font-black text-xs shrink-0 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                  {i + 1}
                </div>
                <p className={`text-base font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'} leading-relaxed`}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support Box */}
        <div className={`p-10 rounded-[4rem] bg-brand-600 text-white shadow-brand flex flex-col items-center justify-center text-center relative overflow-hidden group`}>
           <Share2 size={120} className="absolute -right-10 -bottom-10 opacity-10 rotate-12 group-hover:scale-110 transition-transform" />
           <Smartphone size={40} className="mb-6" />
           <h4 className="text-xl font-black mb-4">APK দরকার?</h4>
           <p className="text-brand-100 text-sm mb-8 font-medium">
             একবার ওয়েবসাইট লাইভ হয়ে গেলে, সেই লিংকটি দিয়ে ১ মিনিটে APK তৈরি করা যাবে।
           </p>
           <button className="w-full py-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/30 transition-all">
             আরও জানুন
           </button>
        </div>
      </div>

      <div className="mt-16 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Designed for</p>
        <h5 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Md Nur Noby Islam</h5>
      </div>
    </div>
  );
};

export default HostingHub;
