import React, { useMemo } from 'react';
import { LeaderboardEntry } from '../types';
import { generateLeaderboardSlice } from '../services/botService';

interface LeaderboardProps {
  currentScore: number;
  currentStreak: number;
  onBack: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ currentScore, currentStreak, onBack }) => {
  // Generate a realistic position based on score
  // If score is 0, rank is high (e.g. 50,000). If score is high, rank is low (e.g. 100).
  const estimatedRank = useMemo(() => {
    if (currentScore === 0) return 54203;
    return Math.max(1, Math.floor(54203 - (currentScore / 10)));
  }, [currentScore]);

  const userEntry: LeaderboardEntry = {
    id: 'user',
    name: 'Você',
    score: currentScore,
    streak: currentStreak,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentScore}&backgroundColor=transparent`,
    isBot: false,
    rank: estimatedRank
  };

  // Generate simulated list around the user
  const entries = useMemo(() => generateLeaderboardSlice(estimatedRank, userEntry), [estimatedRank]);

  return (
    <div className="flex flex-col h-full bg-slate-950 pt-20 px-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Ranking Global</h2>
        <button onClick={onBack} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-bold text-sm">Voltar</button>
      </div>

      {/* Top 3 Teaser (Fake static data for ambition) */}
      <div className="grid grid-cols-3 gap-2 mb-8 items-end">
         {[2, 1, 3].map(rank => (
           <div key={rank} className={`flex flex-col items-center ${rank === 1 ? '-mt-6' : ''}`}>
             <div className={`relative rounded-full border-4 ${rank === 1 ? 'w-20 h-20 border-yellow-400 shadow-neon' : 'w-16 h-16 border-slate-700'}`}>
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=top${rank}`} className="w-full h-full rounded-full bg-slate-800" />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-900 px-2 py-0.5 rounded text-xs font-bold border border-slate-800">
                  #{rank}
                </div>
             </div>
           </div>
         ))}
      </div>

      <div className="flex-grow overflow-y-auto space-y-3 pb-24 no-scrollbar">
        {entries.map((entry) => {
          const isMe = entry.id === 'user';
          return (
            <div 
              key={entry.id} 
              className={`
                flex items-center gap-4 p-4 rounded-2xl border transition-all
                ${isMe 
                  ? 'bg-gradient-to-r from-violet-900/40 to-indigo-900/40 border-indigo-500 scale-[1.02] shadow-lg sticky top-0 z-10 backdrop-blur-md' 
                  : 'bg-slate-900 border-slate-800 opacity-80'
                }
              `}
            >
              <div className={`w-12 text-center font-black italic text-lg ${isMe ? 'text-indigo-400' : 'text-slate-600'}`}>
                #{entry.rank.toLocaleString()}
              </div>
              
              <div className="w-12 h-12 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                <img src={entry.avatar} alt={entry.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                    <p className={`font-bold ${isMe ? 'text-white' : 'text-slate-300'}`}>{entry.name}</p>
                    {isMe && <span className="text-[9px] bg-indigo-500 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Você</span>}
                </div>
                <p className="text-xs text-slate-500 font-mono">{entry.score.toLocaleString()} XP</p>
              </div>
              
              <div className="text-right">
                <div className="flex items-center justify-end gap-1 text-orange-500 font-bold text-sm">
                   <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" /></svg>
                   {entry.streak}
                </div>
              </div>
            </div>
          );
        })}
        
        <div className="text-center text-slate-600 text-xs py-4">
          + 54,000 outros jogadores abaixo de você
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
