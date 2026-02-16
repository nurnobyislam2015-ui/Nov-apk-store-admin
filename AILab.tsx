
import React, { useState, useRef } from 'react';
import { Sparkles, Upload, Wand2, RefreshCcw, Download, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { geminiService } from '../services/geminiService';

const AILab: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImage(event.target?.result as string);
        setEditedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!originalImage || !prompt) return;

    setIsProcessing(true);
    setError(null);

    try {
      const base64Data = originalImage.split(',')[1];
      const mimeType = originalImage.split(';')[0].split(':')[1];
      
      const result = await geminiService.editImage(base64Data, mimeType, prompt);
      
      if (result) {
        setEditedImage(result);
      } else {
        setError("AI failed to generate a response. Try a more descriptive prompt.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <header className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Powered by Gemini 2.5 Flash</span>
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-4">Nova AI Asset Lab</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Enhance your app icons, banners, and screenshots using pure text commands. 
          Just upload an image and tell our AI what to change.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Workspace */}
        <div className="space-y-6">
          <div 
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            className={`relative group rounded-[2.5rem] border-4 border-dashed transition-all flex flex-col items-center justify-center aspect-video cursor-pointer overflow-hidden ${
              originalImage ? 'border-indigo-100 bg-indigo-50/20' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
            }`}
          >
            {originalImage ? (
              <>
                <img src={originalImage} className="w-full h-full object-contain" alt="original" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-gray-900">
                    <RefreshCcw className="w-4 h-4" /> Change Image
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 text-gray-400">
                <div className="p-6 bg-white rounded-3xl shadow-sm">
                  <Upload className="w-10 h-10 text-indigo-500" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-600">Click to upload asset</p>
                  <p className="text-xs">Supports JPG, PNG (Max 10MB)</p>
                </div>
              </div>
            )}
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50">
            <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Magic Instructions</label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'Add a neon futuristic glow', 'Make it look like it's from the 80s', 'Remove the background and replace it with Mars'..."
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-gray-900 focus:ring-2 focus:ring-indigo-500 resize-none h-32 placeholder:text-gray-400"
              ></textarea>
              <div className="absolute bottom-4 right-4 text-xs text-gray-400 font-medium">
                Try "Enhance details"
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 border border-red-100 animate-pulse">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <button
              onClick={handleEdit}
              disabled={!originalImage || !prompt || isProcessing}
              className={`w-full mt-6 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-lg ${
                !originalImage || !prompt || isProcessing
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-0.5 shadow-indigo-200'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCcw className="w-6 h-6 animate-spin" />
                  Processing in Cloud...
                </>
              ) : (
                <>
                  <Wand2 className="w-6 h-6" />
                  Generate Magic
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result Area */}
        <div className="flex flex-col">
          <div className="flex-1 rounded-[2.5rem] bg-gray-900 overflow-hidden relative min-h-[400px] flex items-center justify-center border-4 border-gray-800">
            {editedImage ? (
              <>
                <img src={editedImage} className="w-full h-full object-contain" alt="result" />
                <div className="absolute top-6 right-6 flex gap-2">
                  <a 
                    href={editedImage} 
                    download="nova-ai-asset.png"
                    className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-2xl text-white transition-all shadow-xl"
                  >
                    <Download className="w-6 h-6" />
                  </a>
                </div>
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
                  <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">Generated Result</p>
                  <p className="text-sm text-gray-200 line-clamp-1 italic">"{prompt}"</p>
                </div>
              </>
            ) : (
              <div className="text-center p-12">
                <div className="w-20 h-20 bg-gray-800 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                  <ImageIcon className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-500 font-bold text-xl mb-2">Magic Awaits</p>
                <p className="text-gray-600 text-sm max-w-xs mx-auto">Upload an image and give it instructions to see the AI generation here.</p>
                
                {isProcessing && (
                  <div className="mt-8 flex flex-col items-center gap-4">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                    </div>
                    <span className="text-xs text-indigo-400 font-black uppercase tracking-widest">Imagining your request...</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="mt-8 bg-gray-50 rounded-3xl p-6 border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Pro Tips
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500 font-medium">
              <li className="flex gap-3">
                <span className="text-indigo-600 font-black">01</span>
                Be specific about style (e.g., "Minimalist", "Flat Design", "Cyberpunk").
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-600 font-black">02</span>
                You can add or remove objects just by describing them.
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-600 font-black">03</span>
                Great for fixing app icon lighting or background consistency.
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-600 font-black">04</span>
                Ask for "Better contrast and sharper edges" for low-quality icons.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AILab;
