
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleGoogleLogin = () => {
    setIsAuthenticating(true);
    // Simulate Google OAuth Redirect/Popup
    setTimeout(() => {
      onLogin({
        email: 'user@gmail.com',
        name: 'Routine Master',
        photo: 'https://ui-avatars.com/api/?name=Routine+Master&background=2563eb&color=fff'
      });
      setIsAuthenticating(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#f8fafc] flex items-center justify-center p-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 -left-20 w-[500px] h-[500px] bg-blue-100/40 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-orange-100/40 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md space-y-12 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-blue-200 rotate-6 mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h1 className="text-5xl font-black text-blue-900 tracking-tighter">Routine</h1>
          <p className="text-slate-400 font-medium text-lg leading-relaxed">Design your day, master your habits.</p>
        </div>

        <div className="bg-white p-2 rounded-[3rem] shadow-2xl shadow-blue-100/50 border border-blue-50">
          <button
            onClick={handleGoogleLogin}
            disabled={isAuthenticating}
            className="w-full flex items-center justify-center gap-4 py-6 bg-white hover:bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] transition-all active:scale-95 group relative overflow-hidden"
          >
            {isAuthenticating ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-black text-blue-900 uppercase tracking-widest">Connecting...</span>
              </div>
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-sm font-black text-slate-800 uppercase tracking-widest">Continue with Google</span>
              </>
            )}
          </button>
        </div>

        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-loose">
          Secure Cloud Sync & AI Coaching <br />
          Requires Google Authentication
        </p>
      </div>
    </div>
  );
};

export default Login;
