
import React from 'react';
import { ShieldCheck, ShieldAlert, Phone, MessageSquare, BadgeCheck, Lock, Verified, ExternalLink, Globe, Smartphone, HelpCircle } from 'lucide-react';

interface SecurityCenterProps {
  isDarkMode: boolean;
}

const SecurityCenter: React.FC<SecurityCenterProps> = ({ isDarkMode }) => {
  const ownerDetails = {
    name: "Md Nur Noby Islam",
    role: "Proprietor & Lead Developer",
    organization: "Glow And Beauty Mart",
    phone: "+8801615656467",
    whatsapp: "+8801615656467",
    location: "Bangladesh"
  };

  const handleCall = () => window.open(`tel:${ownerDetails.phone}`);
  const handleWhatsApp = () => window.open(`https://wa.me/${ownerDetails.whatsapp.replace('+', '')}`);

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 animate-slide-up pb-32">
      <header className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-amber-50 dark:bg-amber-950/30 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-amber-100 dark:border-amber-900/50">
          <ShieldCheck size={14} /> Official Transparency & Protection
        </div>
        <h2 className="text-5xl font-black tracking-tight mb-4 dark:text-white">Security & Support</h2>
        <p className="text-slate-500 max-w-xl mx-auto font-medium text-lg">
          The Nova Store ecosystem is governed by strict security protocols and clear ownership accountability.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Ownership Certificate */}
        <div className="relative group">
          <div className="absolute inset-0 bg-amber-500 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
          <div className={`relative ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} p-12 rounded-[3.5rem] border shadow-premium overflow-hidden`}>
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <BadgeCheck size={180} className="text-amber-500" />
             </div>
             
             <div className="flex items-center gap-4 mb-10">
                <div className="bg-amber-500 p-3 rounded-2xl text-white">
                  <Verified size={24} />
                </div>
                <h3 className="text-2xl font-black dark:text-white">Store Authority</h3>
             </div>

             <div className="space-y-8">
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Legal Proprietor</p>
                   <p className="text-3xl font-black dark:text-white tracking-tighter">{ownerDetails.name}</p>
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Position</p>
                   <p className="text-xl font-bold text-slate-600 dark:text-slate-300">{ownerDetails.role}</p>
                   <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mt-1">{ownerDetails.organization}</p>
                </div>
                <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Globe size={18} className="text-slate-400" />
                      <span className="text-sm font-bold text-slate-500">{ownerDetails.location}</span>
                   </div>
                   <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800">
                      ID Verified
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="space-y-8">
           <div className={`p-10 rounded-[3rem] ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'} border shadow-sm`}>
              <div className="flex items-center gap-4 mb-8">
                 <ShieldAlert size={28} className="text-red-500" />
                 <h4 className="text-2xl font-black dark:text-white">Incident Response</h4>
              </div>
              <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed">
                If you suspect a security breach, encounter a fraudulent application, or need immediate ownership verification, use the encrypted channels below.
              </p>
              
              <div className="space-y-4">
                 <button 
                  onClick={handleWhatsApp}
                  className="w-full p-6 bg-[#25D366] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-emerald-500/20"
                 >
                    <MessageSquare size={20} /> Encrypted WhatsApp
                 </button>
                 <button 
                  onClick={handleCall}
                  className="w-full p-6 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-black active:scale-95 transition-all shadow-xl"
                 >
                    <Phone size={20} /> Direct Authority Line
                 </button>
              </div>
           </div>

           <div className={`p-8 rounded-[2.5rem] border-2 border-dashed ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} flex items-center justify-between group hover:border-amber-500 transition-all cursor-help`}>
              <div className="flex items-center gap-5">
                 <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-all">
                    <Lock size={20} className="text-amber-500 group-hover:text-white" />
                 </div>
                 <div>
                    <h5 className="font-black text-sm dark:text-white">Security Documentation</h5>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital Signatures & Keys</p>
                 </div>
              </div>
              <ExternalLink size={18} className="text-slate-300 group-hover:text-amber-500" />
           </div>
        </div>
      </div>

      <section className="mt-20 p-12 bg-gradient-to-br from-slate-900 to-slate-950 rounded-[4rem] text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl text-center md:text-left">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-500/20 text-brand-400 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-6 border border-brand-500/30">
                  Nova Protocol v2.4
               </div>
               <h3 className="text-3xl font-black mb-4 tracking-tight">Hacker Defense Program</h3>
               <p className="text-slate-400 font-medium leading-relaxed">
                  We maintain a Zero-Trust architecture. Any unauthorized attempts to access Nova binaries are logged and reported to international cyber authorities. For bug bounty reports, please contact the owner directly.
               </p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 flex flex-col items-center gap-4 min-w-[240px]">
               <Smartphone size={40} className="text-brand-500" />
               <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Service Status</p>
                  <p className="text-xl font-black text-emerald-400">System Secure</p>
               </div>
               <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-4 bg-emerald-500/40 rounded-full animate-pulse" style={{animationDelay: `${i*0.2}s`}}></div>)}
               </div>
            </div>
         </div>
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
      </section>
    </div>
  );
};

export default SecurityCenter;
