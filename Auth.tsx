
import React, { useState } from 'react';
import { User, Mail, Lock, UserPlus, ArrowRight, ShieldCheck, Github, RefreshCcw, ShieldAlert, KeyRound, Fingerprint } from 'lucide-react';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, isFirebaseConfigured } from '../lib/firebase';
import { User as UserType } from '../types';

interface AuthProps {
  onLogin: (user: UserType) => void;
  onClose: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isOwnerMode, setIsOwnerMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [ownerData, setOwnerData] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState<string | null>(null);

  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'nova9900'
  };

  const handleOwnerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);
    
    setTimeout(() => {
        if (ownerData.username === ADMIN_CREDENTIALS.username && ownerData.password === ADMIN_CREDENTIALS.password) {
          const adminUser: UserType = {
            id: 'owner-nova',
            name: 'Md Nur Noby Islam',
            email: 'owner@nova.store',
            role: 'admin',
            avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin-nova'
          };
          onLogin(adminUser);
          onClose();
        } else {
          setAuthError("Invalid Security ID or Access Key!");
        }
        setIsLoading(false);
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);

    if (!isFirebaseConfigured || !auth) {
        setTimeout(() => {
          const mockUser: UserType = {
            id: 'mock-123',
            name: formData.name || 'Developer',
            email: formData.email,
            role: 'user',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`
          };
          onLogin(mockUser);
          onClose();
          setIsLoading(false);
        }, 800);
        return;
    }

    try {
      if (isLogin) {
        const res = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        onLogin({
          id: res.user.uid,
          name: res.user.displayName || 'Developer',
          email: res.user.email || '',
          role: 'user',
          avatar: res.user.photoURL || ''
        });
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        if (formData.name && userCredential.user) {
          await updateProfile(userCredential.user, { displayName: formData.name });
        }
        onLogin({
          id: userCredential.user.uid,
          name: formData.name,
          email: formData.email,
          role: 'user',
          avatar: ''
        });
      }
      onClose(); 
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 animate-slide-up">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800 flex flex-col">
        
        <div className={`p-10 text-white text-center relative overflow-hidden transition-colors duration-500 ${isOwnerMode ? 'bg-slate-950' : 'bg-gradient-to-br from-indigo-900 to-brand-700'}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          {isOwnerMode ? (
            <div className="relative z-10 animate-bounce">
              <Fingerprint className="w-14 h-14 text-brand-400 mx-auto mb-4" />
            </div>
          ) : (
            <ShieldAlert className="w-12 h-12 text-brand-300 mx-auto mb-4 opacity-50" />
          )}
          <h2 className="text-3xl font-black mb-2">{isOwnerMode ? 'Proprietor Access' : (isLogin ? 'Nova Login' : 'Create Account')}</h2>
          <p className="text-indigo-200 text-sm">{isOwnerMode ? 'System Identity Verification' : 'Access your dashboard'}</p>
        </div>

        <div className="p-10 space-y-6">
          {isOwnerMode ? (
            <form onSubmit={handleOwnerLogin} className="space-y-4 animate-slide-up">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Security ID</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    required
                    type="text"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-brand-500 dark:text-white outline-none"
                    placeholder="Admin Username"
                    value={ownerData.username}
                    onChange={e => setOwnerData({...ownerData, username: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Access Key</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    required
                    type="password"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-brand-500 dark:text-white outline-none"
                    placeholder="••••••••"
                    value={ownerData.password}
                    onChange={e => setOwnerData({...ownerData, password: e.target.value})}
                  />
                </div>
              </div>

              {authError && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-500 text-[10px] font-black uppercase text-center border border-red-100 dark:border-red-900/30 animate-shake">
                  {authError}
                </div>
              )}

              <button 
                disabled={isLoading}
                type="submit" 
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50"
              >
                {isLoading ? <RefreshCcw className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
                {isLoading ? "AUTHENTICATING..." : "GRANT ACCESS"}
              </button>
              
              <button 
                type="button"
                onClick={() => { setIsOwnerMode(false); setAuthError(null); }}
                className="w-full py-3 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-brand-600 transition-colors"
              >
                Switch to Standard User
              </button>
            </form>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text"
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="email"
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="password"
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>

                {authError && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-500 text-[10px] font-bold uppercase text-center border border-red-100 dark:border-red-900/30">
                    {authError}
                  </div>
                )}

                <button 
                  disabled={isLoading}
                  type="submit" 
                  className="w-full py-4 bg-brand-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-brand-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-brand-500/20"
                >
                  {isLoading ? <RefreshCcw className="animate-spin" /> : (isLogin ? 'Sign In' : 'Create Library')}
                  {!isLoading && <ArrowRight size={16} />}
                </button>
              </form>

              <div className="relative flex items-center justify-center py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-slate-800"></div></div>
                <span className="relative bg-white dark:bg-slate-900 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">OR</span>
              </div>

              <div className="space-y-4">
                <button 
                    onClick={() => { setIsOwnerMode(true); setAuthError(null); }}
                    className="w-full py-4 border-2 border-brand-500 text-brand-600 dark:text-brand-400 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all flex items-center justify-center gap-2"
                >
                    <ShieldCheck size={16} /> OWNER / ADMIN PORTAL
                </button>
                
                <p className="text-center text-xs text-gray-500 font-medium">
                  {isLogin ? "New to Nova?" : "Already a user?"}
                  <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-brand-600 font-black hover:underline uppercase text-[10px] tracking-widest">
                    {isLogin ? 'Join Community' : 'Access Account'}
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
