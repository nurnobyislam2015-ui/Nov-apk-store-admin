
import React, { useState, useRef } from 'react';
import { Sparkles, Wand2, RefreshCcw, Image as ImageIcon, AlertCircle, Zap, Palette, FileText, ExternalLink, Globe, PlayCircle, Loader2, CloudOff, Film, Clapperboard, Layers, Sliders, Download, Upload, X } from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";
import { Language } from '../types';

interface AIStudioProps {
  isDarkMode?: boolean;
  lang: Language;
  isOnline: boolean;
}

const AIStudio: React.FC<AIStudioProps> = ({ isDarkMode = false, lang, isOnline }) => {
  const [activeTab, setActiveTab] = useState<'icon' | 'desc' | 'refine' | 'voice' | 'video'>('icon');
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoStatus, setVideoStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [appName, setAppName] = useState('');
  const [generatedResult, setGeneratedResult] = useState<{ content: string, type: 'image' | 'text' | 'audio' | 'video', searchUrls?: any[] } | null>(null);
  
  // Refine tab state
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ensureApiKey = async () => {
    const aiStudio = (window as any).aistudio;
    if (aiStudio && typeof aiStudio.hasSelectedApiKey === 'function') {
      const hasKey = await aiStudio.hasSelectedApiKey();
      if (!hasKey) {
        await aiStudio.openSelectKey();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImage(event.target?.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRefineAsset = async () => {
    if (!originalImage || !prompt) return;
    setIsProcessing(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = originalImage.split(',')[1];
      const mimeType = originalImage.split(';')[0].split(':')[1];
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType } },
            { text: `Refine this app asset: ${prompt}. Maintain professional consistency and high quality.` },
          ],
        },
      });

      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (part?.inlineData) {
        setGeneratedResult({ content: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`, type: 'image' });
      } else {
        setError("AI failed to process. Try a simpler prompt.");
      }
    } catch (e: any) {
      setError(e.message);
    } finally { setIsProcessing(false); }
  };

  const handleGenerateVideo = async () => {
    if (!isOnline || !prompt) return;
    await ensureApiKey();
    setIsProcessing(true);
    setError(null);
    setVideoStatus('Connecting to Veo-3 Engine...');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `Cinematic high-quality app promo trailer for ${appName}: ${prompt}`,
        config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
      });
      while (!operation.done) {
        setVideoStatus('Nova Brain is rendering your video...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }
      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await videoResponse.blob();
        setGeneratedResult({ content: URL.createObjectURL(blob), type: 'video' });
      }
    } catch (e: any) {
      if (e.message && e.message.includes("Requested entity was not found.")) {
        const aiStudio = (window as any).aistudio;
        if (aiStudio) await aiStudio.openSelectKey();
      }
      setError(e.message);
    } finally { setIsProcessing(false); setVideoStatus(''); }
  };

  const handleGenerateVoice = async () => {
    if (!isOnline || !prompt) return;
    setIsProcessing(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say with extreme professionalism: Introducing ${appName}. ${prompt}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        },
      });
      const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (audioData) setGeneratedResult({ content: audioData, type: 'audio' });
    } catch (e: any) { setError(e.message); } finally { setIsProcessing(false); }
  };

  const handleGenerateIcon = async () => {
    if (!isOnline || !prompt) return;
    await ensureApiKey();
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: `Professional minimalist 4K app icon for "${appName}". Style: ${prompt}. High-end commercial aesthetic, clean lines.` }] },
        config: { imageConfig: { aspectRatio: '1:1', imageSize: '1K' } }
      });
      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (part?.inlineData) {
        setGeneratedResult({ content: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`, type: 'image' });
      }
    } catch (e: any) { 
      if (e.message && e.message.includes("Requested entity was not found.")) {
        const aiStudio = (window as any).aistudio;
        if (aiStudio) await aiStudio.openSelectKey();
      }
      setError(e.message); 
    } finally { setIsProcessing(false); }
  };

  const handleGenerateDescription = async () => {
    if (!isOnline || !prompt || !appName) return;
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Write a world-class Play Store listing for "${appName}" with features: ${prompt}. Use markdown formatting with clear headings and bullet points.`,
        config: { tools: [{ googleSearch: {} }] }
      });
      const searchUrls = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      setGeneratedResult({ content: response.text || "", type: 'text', searchUrls });
    } catch (e: any) { setError(e.message); } finally { setIsProcessing(false); }
  };

  const playAudio = async () => {
    if (generatedResult?.type !== 'audio') return;
    const decode = (base64: string) => {
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
      return bytes;
    };
    const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
      const dataInt16 = new Int16Array(data.buffer);
      const frameCount = dataInt16.length / numChannels;
      const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
      for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
      return buffer;
    };
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(decode(generatedResult.content), ctx, 24000, 1);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.start();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 animate-slide-up px-6 pb-24">
      <header className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-50 dark:bg-brand-900/30 text-brand-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-brand-100 dark:border-brand-800">
          <Sparkles size={14} className="animate-pulse" /> Neural Forge 6.2
        </div>
        <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight dark:text-white">AI Developer Studio</h2>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
          {lang === 'bn' ? 'নোভা এআই ইঞ্জিন ব্যবহার করে আপনার অ্যাপের জন্য প্রিমিয়াম এসেট তৈরি করুন।' : 'Forge world-class app icons, cinematic trailers, and pro listings with Nova AI.'}
        </p>
        
        {!isOnline && (
          <div className="mt-8 flex items-center gap-3 px-8 py-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-3xl text-sm font-bold w-fit mx-auto border border-red-100 dark:border-red-900/30 animate-pulse">
            <CloudOff size={18} /> Offline Mode: Neural Forge Idle
          </div>
        )}
      </header>

      <div className="flex justify-center p-2 bg-slate-100 dark:bg-slate-900 rounded-[3rem] w-fit mx-auto mb-16 border dark:border-slate-800 shadow-inner overflow-x-auto scrollbar-hide">
        {[
          { id: 'icon', label: 'Icon Forge', icon: Palette },
          { id: 'refine', label: 'Asset Refiner', icon: Sliders },
          { id: 'video', label: 'Trailer', icon: Film },
          { id: 'desc', label: 'Play Listing', icon: FileText },
          { id: 'voice', label: 'Voiceover', icon: PlayCircle },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); setGeneratedResult(null); setError(null); }}
            className={`flex items-center gap-3 px-10 py-4 rounded-[2.5rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab.id ? 'bg-brand-600 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-brand-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] border dark:border-slate-800 shadow-premium space-y-10">
          {activeTab === 'refine' ? (
            <div className="space-y-6">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Source Asset</label>
              <div 
                onClick={() => !isProcessing && fileInputRef.current?.click()}
                className={`relative group rounded-[2.5rem] border-4 border-dashed transition-all flex flex-col items-center justify-center aspect-video cursor-pointer overflow-hidden ${
                  originalImage ? 'border-brand-100 bg-brand-50/20' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {originalImage ? (
                  <>
                    <img src={originalImage} className="w-full h-full object-contain" alt="original" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white px-5 py-2.5 rounded-2xl flex items-center gap-2 font-black text-xs text-slate-900 uppercase">
                        <RefreshCcw size={14} /> Change Image
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-4 text-slate-400">
                    <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm">
                      <Upload size={32} className="text-brand-500" />
                    </div>
                    <div className="text-center">
                      <p className="font-black text-slate-600 dark:text-slate-400 text-xs uppercase tracking-widest">Upload Asset to Refine</p>
                    </div>
                  </div>
                )}
                <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
              </div>
            </div>
          ) : (
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 ml-1">Project Name</label>
              <input value={appName} onChange={e => setAppName(e.target.value)} placeholder="e.g. Nova Nexus" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-8 py-6 font-bold outline-none focus:ring-2 focus:ring-brand-500 dark:text-white transition-all shadow-inner text-lg" />
            </div>
          )}

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 ml-1">Neural Instructions</label>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={activeTab === 'refine' ? "Tell AI how to refine this image..." : "Describe exactly what you want the AI to create..."} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[2.5rem] px-8 py-8 font-bold h-56 outline-none focus:ring-2 focus:ring-brand-500 resize-none dark:text-white transition-all shadow-inner leading-relaxed" />
          </div>

          <button 
            disabled={isProcessing || !isOnline} 
            onClick={() => {
              if (activeTab === 'icon') handleGenerateIcon();
              else if (activeTab === 'video') handleGenerateVideo();
              else if (activeTab === 'voice') handleGenerateVoice();
              else if (activeTab === 'desc') handleGenerateDescription();
              else if (activeTab === 'refine') handleRefineAsset();
            }}
            className="w-full py-8 bg-brand-600 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] shadow-xl shadow-brand-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-5 disabled:opacity-50"
          >
            {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <Zap size={24} />}
            {isProcessing ? (videoStatus || "Fusing Nodes...") : "Initialize Forge"}
          </button>
          
          {error && (
            <div className="p-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-3xl text-xs font-black uppercase tracking-widest border border-red-100 dark:border-red-900/30 flex items-center gap-4 animate-shake">
              <AlertCircle size={20} /> {error}
            </div>
          )}
        </div>

        <div className="bg-slate-100 dark:bg-slate-900/50 rounded-[5rem] border-4 border-dashed dark:border-slate-800 flex flex-col items-center justify-center p-12 relative overflow-hidden group">
           {generatedResult ? (
             <div className="w-full h-full flex flex-col items-center gap-10 animate-slide-up overflow-y-auto scrollbar-hide p-4">
                <div className="flex items-center justify-between w-full mb-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Generation Success</span>
                  <button onClick={() => setGeneratedResult(null)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={18}/></button>
                </div>
                {generatedResult.type === 'video' && <video src={generatedResult.content} controls className="w-full rounded-[3.5rem] shadow-2xl border-8 border-white dark:border-slate-800" />}
                {generatedResult.type === 'image' && (
                  <div className="relative group/img">
                    <img src={generatedResult.content} className="w-96 h-96 rounded-[4rem] shadow-2xl border-8 border-white dark:border-slate-800 object-cover" alt="AI Forge Result" />
                    <a href={generatedResult.content} download="nova-asset.png" className="absolute bottom-6 right-6 p-5 bg-white text-slate-950 rounded-2xl shadow-xl opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-brand-500 hover:text-white">
                      <Download size={24} />
                    </a>
                  </div>
                )}
                {generatedResult.type === 'audio' && (
                   <div className="flex flex-col items-center gap-6 p-12 bg-white dark:bg-slate-900 rounded-[4rem] shadow-xl border dark:border-slate-800">
                      <div className="w-24 h-24 bg-brand-500 text-white rounded-full flex items-center justify-center shadow-brand animate-pulse">
                         <PlayCircle size={40} />
                      </div>
                      <button onClick={playAudio} className="px-12 py-5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">Play Preview</button>
                   </div>
                )}
                {generatedResult.type === 'text' && (
                  <div className="w-full space-y-6">
                    <div className="p-10 bg-white dark:bg-slate-800 rounded-[3rem] shadow-premium text-base leading-relaxed whitespace-pre-wrap dark:text-slate-300 font-medium prose prose-invert max-w-none">{generatedResult.content}</div>
                    {generatedResult.searchUrls && generatedResult.searchUrls.length > 0 && (
                      <div className="p-8 bg-white/50 dark:bg-slate-800/50 rounded-[2.5rem] border dark:border-slate-700">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2"><Globe size={14}/> Grounding Sources</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {generatedResult.searchUrls.map((chunk, idx) => chunk.web && (
                              <a key={idx} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="p-4 bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 hover:border-brand-500 transition-colors flex items-center justify-between group/link">
                                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 line-clamp-1">{chunk.web.title || 'Referenced Source'}</span>
                                <ExternalLink size={12} className="text-brand-500 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                              </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
             </div>
           ) : (
             <div className="text-center flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-brand-500/20 blur-3xl rounded-full scale-150 group-hover:scale-110 transition-transform"></div>
                  <div className="relative p-12 bg-white dark:bg-slate-800 rounded-[3.5rem] shadow-inner border-2 border-slate-100 dark:border-slate-800">
                     <Layers className="text-slate-300 w-16 h-16 group-hover:text-brand-500 transition-colors duration-500" />
                  </div>
                </div>
                <p className="text-slate-400 font-black uppercase text-xs tracking-[0.4em]">{isProcessing ? "Synthesizing Binary..." : "Awaiting Input Signals"}</p>
                <div className="flex gap-2">
                  <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-brand-500 animate-pulse' : 'bg-slate-300'}`}></div>
                  <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-brand-500 animate-pulse delay-100' : 'bg-slate-300'}`}></div>
                  <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-brand-500 animate-pulse delay-200' : 'bg-slate-300'}`}></div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AIStudio;
