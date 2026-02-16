
import React, { useState } from 'react';
import { Upload, CheckCircle, Wand2, RefreshCcw, Cloud } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { AppData } from '../types';
import { APP_CATEGORIES } from '../constants';
import { db, collection, addDoc, storage, ref, uploadBytesResumable, getDownloadURL, serverTimestamp } from '../lib/firebase';

interface SubmitAppProps {
  lang: string;
  isDarkMode: boolean;
  isCloudMode: boolean;
  onOfflineSubmit: (app: Omit<AppData, 'id'>) => void;
}

const SubmitApp: React.FC<SubmitAppProps> = ({ isDarkMode, isCloudMode, onOfflineSubmit, lang }) => {
  const [formData, setFormData] = useState({ name: '', developer: '', category: 'টুলস (Tools)', description: '', size: '', version: '1.0.0' });
  const [apkFile, setApkFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isAiImproving, setIsAiImproving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const improveDescription = async () => {
    if (!formData.description) return;
    setIsAiImproving(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Rewrite this mobile app description to be more professional: "${formData.description}"`,
      });
      setFormData(prev => ({ ...prev, description: response.text || prev.description }));
    } catch (e) { console.error(e); } finally { setIsAiImproving(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apkFile) return;

    setIsUploading(true);

    if (isCloudMode && db && storage) {
      try {
        // 1. Upload APK to Firebase Storage
        const fileRef = ref(storage, `apks/${Date.now()}_${apkFile.name}`);
        const uploadTask = uploadBytesResumable(fileRef, apkFile);

        uploadTask.on('state_changed', 
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(Math.round(progress));
          },
          (error) => { console.error(error); setIsUploading(false); },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            // 2. Save App Metadata to Firestore
            await addDoc(collection(db, "apps"), {
              ...formData,
              apkUrl: downloadURL,
              icon: `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name}&backgroundColor=4f46e5`,
              banner: `https://images.unsplash.com/photo-1614332287897-cdc485fa562d?auto=format&fit=crop&q=80&w=1200`,
              status: 'published',
              rating: 5.0,
              downloads: '0',
              submittedBy: 'Md Nur Noby Islam',
              createdAt: serverTimestamp()
            });

            setIsUploading(false);
            setSubmitted(true);
          }
        );
      } catch (e) {
        console.error("Cloud Submission Failed:", e);
        setIsUploading(false);
      }
    } else {
      // Local Fallback
      let prog = 0;
      const interval = setInterval(() => {
        prog += 10;
        setUploadProgress(prog);
        if (prog >= 100) {
          clearInterval(interval);
          onOfflineSubmit({
            ...formData,
            icon: `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name}&backgroundColor=4f46e5`,
            banner: `https://images.unsplash.com/photo-1614332287897-cdc485fa562d?auto=format&fit=crop&q=80&w=1200`,
            status: 'published',
            rating: 5.0,
            downloads: '0',
            submittedBy: 'Md Nur Noby Islam',
            reviews: []
          });
          setIsUploading(false);
          setSubmitted(true);
        }
      }, 100);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 animate-slide-up">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-xl">
          <CheckCircle className="text-emerald-500 w-12 h-12" />
        </div>
        <h2 className={`text-3xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>সাফল্যের সাথে পাবলিশ হয়েছে!</h2>
        <p className="text-slate-500">{isCloudMode ? "আপনার অ্যাপটি এখন ক্লাউডে লাইভ এবং সবার জন্য উন্মুক্ত।" : "আপনার অ্যাপটি এখন নোভা স্টোর হোমে দেখা যাচ্ছে।"}</p>
        <button onClick={() => setSubmitted(false)} className="mt-8 px-10 py-4 bg-brand-600 text-white rounded-2xl font-black uppercase text-xs shadow-brand active:scale-95 transition-all">আরেকটি অ্যাপ যোগ করুন</button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-10 animate-slide-up">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black mb-2 dark:text-white">নোভা পাবলিশিং সেন্টার</h2>
          <p className="text-slate-500">আপনার তৈরি অ্যাপটি নূর নবী ইসলামের স্টোরে যুক্ত করুন।</p>
        </div>
        {isCloudMode && (
          <div className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase flex items-center gap-2 border border-emerald-500/20 shadow-lg">
             <Cloud size={14} className="animate-pulse" /> Cloud Ready
          </div>
        )}
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} p-8 rounded-[3rem] border shadow-xl md:col-span-2 space-y-6`}>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-1">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">অ্যাপের নাম</label>
               <input required type="text" className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-500 dark:text-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
             </div>
             <div className="space-y-1">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">ডেভেলপার</label>
               <input required type="text" className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-500 dark:text-white" value={formData.developer} onChange={e => setFormData({...formData, developer: e.target.value})} />
             </div>
           </div>
           <div className="space-y-1">
             <div className="flex justify-between items-center mb-1">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">অ্যাপের বিবরণ</label>
               <button type="button" onClick={improveDescription} className="text-[10px] font-black text-brand-500 flex items-center gap-1 hover:scale-105 transition-all">
                 <Wand2 size={12} /> {isAiImproving ? 'AI ঠিক করছে...' : 'AI দিয়ে সাজান'}
               </button>
             </div>
             <textarea required className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-sm font-bold h-32 resize-none outline-none focus:ring-2 focus:ring-brand-500 dark:text-white" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
           </div>
        </div>

        <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} p-8 rounded-[3rem] border shadow-xl`}>
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">ক্যাটাগরি</label>
           <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-500 dark:text-white">
             {APP_CATEGORIES.filter(c => c !== 'সব (All)').map(c => <option key={c} value={c}>{c}</option>)}
           </select>
           <div className="grid grid-cols-2 gap-4 mt-4">
             <input type="text" placeholder="ভার্সন (1.0.0)" className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-4 py-3 text-sm font-bold dark:text-white" value={formData.version} onChange={e => setFormData({...formData, version: e.target.value})} />
             <input type="text" placeholder="সাইজ (MB)" className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-4 py-3 text-sm font-bold dark:text-white" value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} />
           </div>
        </div>

        <div className="relative h-full">
          <input type="file" accept=".apk" id="apk-upload" className="hidden" onChange={e => setApkFile(e.target.files?.[0] || null)} />
          <label htmlFor="apk-upload" className="bg-slate-900 border-slate-800 p-8 rounded-[3rem] border shadow-xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand-500 transition-all border-dashed h-full min-h-[200px]">
            <Upload className="text-brand-400 w-10 h-10 mb-4" />
            <h4 className="text-white font-black text-sm uppercase">{apkFile ? apkFile.name : 'APK ফাইল সিলেক্ট করুন'}</h4>
          </label>
        </div>

        <div className="md:col-span-2 p-8 bg-brand-600 rounded-[3.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-brand">
          {isUploading ? (
            <div className="w-full space-y-4">
               <div className="flex justify-between text-xs font-black uppercase">
                  <span>{isCloudMode ? "সার্ভারে আপলোড হচ্ছে..." : "আপলোড হচ্ছে..."}</span>
                  <span>{uploadProgress}%</span>
               </div>
               <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden">
                 <div className="h-full bg-white transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
               </div>
            </div>
          ) : (
            <>
              <div>
                <h4 className="text-2xl font-black">সবকিছু ঠিক আছে?</h4>
                <p className="text-brand-100 text-xs">জমা দেওয়ার সাথে সাথেই অ্যাপটি স্টোরে লাইভ হয়ে যাবে।</p>
              </div>
              <button type="submit" disabled={!apkFile} className="px-12 py-5 bg-white text-brand-700 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl disabled:opacity-30 active:scale-95 transition-all">লাইভ পাবলিশ করুন</button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default SubmitApp;
