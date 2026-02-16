
import React from 'react';
import { Star, Download, Bookmark, Zap, ShieldCheck } from 'lucide-react';
import { AppData } from '../types';

interface AppCardProps {
  app: AppData;
  onClick: () => void;
}

const AppCard: React.FC<AppCardProps> = ({ app, onClick }) => {
  const isNew = parseInt(app.id) > 5 || app.status === 'published';

  return (
    <div 
      onClick={onClick}
      className="group bg-white dark:bg-slate-900/60 backdrop-blur-md rounded-[3rem] p-4 border border-slate-100 dark:border-slate-800/50 hover:shadow-premium hover:-translate-y-2 hover:border-brand-500/40 transition-all duration-500 cursor-pointer flex flex-col h-full relative"
    >
      <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-inner mb-5">
        <img 
          src={app.icon} 
          alt={app.name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${app.name}&backgroundColor=4f46e5`;
          }}
        />
        
        {isNew && (
          <div className="absolute top-4 left-4">
            <div className="bg-brand-600/90 backdrop-blur-md px-3 py-1 rounded-xl shadow-lg flex items-center gap-1.5 border border-white/10">
              <Zap size={10} className="text-white fill-white animate-pulse" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest">New</span>
            </div>
          </div>
        )}

        <div className="absolute top-4 right-4">
           <div className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl p-2.5 rounded-2xl shadow-sm border border-white/20 text-slate-400 hover:text-brand-500 transition-colors">
              <Bookmark size={14} />
           </div>
        </div>

        <div className="absolute bottom-4 left-4">
          <div className="bg-slate-950/80 backdrop-blur-xl px-3.5 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-2xl border border-white/10">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-[11px] font-black text-white">{app.rating}</span>
          </div>
        </div>
        
        <div className="absolute bottom-4 right-4">
          <div className="bg-emerald-500/90 backdrop-blur-md p-1.5 rounded-full shadow-lg border border-white/10">
            <ShieldCheck size={12} className="text-white" />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col flex-1 px-2">
        <h3 className="font-black text-slate-900 dark:text-white text-lg leading-tight mb-1 truncate group-hover:text-brand-500 transition-colors tracking-tight">
          {app.name}
        </h3>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest truncate mb-4 opacity-70">
          {app.developer}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50 dark:border-slate-800/50">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">App Size</span>
            <span className="text-[11px] font-black text-slate-600 dark:text-slate-300">{app.size}</span>
          </div>
          <div className="w-11 h-11 bg-slate-900 dark:bg-brand-600 text-white dark:text-white rounded-2xl shadow-lg group-hover:bg-brand-500 group-hover:scale-110 group-hover:rotate-6 transition-all flex items-center justify-center">
             <Download size={18} strokeWidth={3} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppCard;
