
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const SupportChat: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'স্বাগতম! আমি নোভা স্টোর অ্যাসিস্ট্যান্ট। আমি আপনাকে কীভাবে সাহায্য করতে পারি?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...chatHistory, { role: 'user', text: userMessage }].map(m => ({
          parts: [{ text: m.text }],
          role: m.role
        })),
        config: {
          systemInstruction: "You are the AI Support Assistant for 'Nova Premium APK Store', owned by Md Nur Noby Islam in Bangladesh. You help users find apps like Nagad, Pathao, and Chorki. Speak in Bengali if the user speaks Bengali. Be extremely polite and professional."
        }
      });

      setChatHistory(prev => [...prev, { role: 'model', text: response.text || 'দুঃখিত, আমি এখন উত্তর দিতে পারছি না।' }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'model', text: 'একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 lg:bottom-10 right-10 z-[100]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-brand-600 text-white rounded-full shadow-brand flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group"
        >
          <Sparkles className="animate-pulse group-hover:rotate-12 transition-transform" />
        </button>
      ) : (
        <div className={`w-[350px] md:w-[400px] h-[500px] ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-slide-up`}>
          <div className="p-6 bg-brand-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div>
                <p className="font-black text-xs uppercase tracking-widest">Nova Support</p>
                <p className="text-[10px] opacity-80">AI Assistant Live</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
            {chatHistory.map((chat, i) => (
              <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-xs font-medium leading-relaxed ${
                  chat.role === 'user' 
                  ? 'bg-brand-600 text-white rounded-br-none' 
                  : (isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-800') + ' rounded-bl-none'
                }`}>
                  {chat.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} rounded-bl-none`}>
                  <Loader2 size={16} className="animate-spin text-brand-500" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-slate-50 dark:bg-slate-950 border-t dark:border-slate-800 flex gap-2">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="প্রশ্ন করুন..."
              className="flex-1 bg-white dark:bg-slate-900 border-none rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-1 focus:ring-brand-500 dark:text-white"
            />
            <button type="submit" className="p-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-all">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SupportChat;
