import React from 'react';
import { UserState, AppScreen } from '../types';

interface HeaderProps {
  user: UserState;
  setScreen: (screen: AppScreen) => void;
  currentScreen: AppScreen;
}

const Header: React.FC<HeaderProps> = ({ user, setScreen }) => {
  // Calculate XP progress (simple logic: 1000 XP per level)
  const xpProgress = (user.xp % 1000) / 10; 

  return (
    <header className="fixed top-0 left-0 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 z-50">
      <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Profile / Level */}
        <button onClick={() => setScreen(AppScreen.PROFILE)} className="flex items-center gap-3 active:scale-95 transition-transform">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 p-[2px]">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.score}&backgroundColor=transparent`} 
                alt="Avatar" 
                className="w-full h-full rounded-full bg-slate-900"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-[2px]">
              <div className="bg-blue-500 text-[10px] font-bold px-1.5 rounded-full text-white min-w-[1.2rem] text-center">
                {user.level}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-start">
            <span className="text-xs font-bold text-slate-300 leading-none mb-1">{user.title}</span>
            {/* XP Bar */}
            <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              ></div>
            </div>
          </div>
        </button>

        {/* Resources */}
        <div className="flex items-center gap-3">
          {/* Streak */}
          <div className="flex flex-col items-end">
             <div className="flex items-center gap-1 text-orange-400 font-bold text-sm">
               <span>🔥 {user.streak}</span>
             </div>
          </div>

          {/* Energy */}
          <button 
            onClick={() => setScreen(AppScreen.PREMIUM)}
            className={`relative group flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700/50 backdrop-blur-sm transition-all active:scale-95 ${user.energy === 0 ? 'bg-red-500/10 border-red-500/50 animate-pulse' : 'bg-slate-800/50'}`}
          >
            <div className={`w-2 h-2 rounded-full ${user.energy > 0 ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'bg-red-500'}`}></div>
            <span className={`font-bold text-sm ${user.isPremium ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500' : 'text-slate-200'}`}>
              {user.isPremium ? '∞' : user.energy}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
