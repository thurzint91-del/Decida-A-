import React, { useState, useEffect } from 'react';
import { AppScreen, Duel, UserState, LeaderboardEntry, Mission } from './types';
import Header from './components/Header';
import DuelCard from './components/DuelCard';
import PremiumModal from './components/PremiumModal';
import Leaderboard from './components/Leaderboard';
import { generateDuel } from './services/geminiService';
import { getTitleForLevel } from './services/botService';

const CATEGORIES = ['Polêmicas', 'Vida', 'Grana', 'Romance', 'Aleatório'];

// Initial Missions
const DAILY_MISSIONS: Mission[] = [
    { id: 'm1', description: 'Votar em 5 duelos', target: 5, current: 0, rewardXP: 200, completed: false, expiresAt: Date.now() + 10800000 },
    { id: 'm2', description: 'Acertar a maioria 3x seguidas', target: 3, current: 0, rewardXP: 500, completed: false, expiresAt: Date.now() + 10800000 },
];

function App() {
  // State
  const [screen, setScreen] = useState<AppScreen>(AppScreen.GAME);
  const [user, setUser] = useState<UserState>({
    energy: 5,
    maxEnergy: 5,
    score: 0,
    xp: 0,
    level: 1,
    title: 'Iniciante',
    streak: 0,
    history: [],
    isPremium: false,
    badges: [],
    missions: DAILY_MISSIONS
  });

  const [currentDuel, setCurrentDuel] = useState<Duel | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Aleatório');
  
  // Flash Event State (e.g., Double XP)
  const [isFlashEvent, setIsFlashEvent] = useState(false);

  // Load initial game
  useEffect(() => {
    loadNewDuel();
    // Simulate flash event trigger
    setTimeout(() => setIsFlashEvent(true), 30000);
  }, []);

  const loadNewDuel = async () => {
    setLoading(true);
    setShowResults(false);
    setSelectedOption(null);
    try {
      const duel = await generateDuel(selectedCategory);
      // Randomly make some rare for dopamine
      if (Math.random() > 0.9) duel.isRare = true;
      setCurrentDuel(duel);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const checkMissions = (won: boolean, currentStreak: number, updatedUser: UserState) => {
    const newMissions = updatedUser.missions.map(m => {
        if (m.completed) return m;
        
        let newCurrent = m.current;
        if (m.id === 'm1') newCurrent += 1; // Vote count
        if (m.id === 'm2') newCurrent = won ? currentStreak : 0; // Streak logic

        const completed = newCurrent >= m.target;
        if (completed && !m.completed) {
            // Mission Completed Alert could go here
            updatedUser.xp += m.rewardXP;
        }
        return { ...m, current: newCurrent, completed };
    });
    return newMissions;
  };

  const handleVote = (optionId: string) => {
    if (!currentDuel) return;
    
    if (user.energy <= 0 && !user.isPremium) {
      setShowPremiumModal(true);
      return;
    }

    setSelectedOption(optionId);
    setShowResults(true);

    // Calculate Outcome
    const selected = currentDuel.options.find(o => o.id === optionId);
    const other = currentDuel.options.find(o => o.id !== optionId);
    
    if (!selected || !other) return;

    const won = selected.percentage >= other.percentage;

    // XP Logic
    let xpGain = won ? 100 : 20;
    if (user.streak > 5) xpGain *= 1.5; // Streak multiplier
    if (currentDuel.isRare) xpGain *= 3; // Rare multiplier
    if (isFlashEvent) xpGain *= 2; // Event multiplier

    // Update User State
    setUser(prev => {
      const newStreak = won ? prev.streak + 1 : 0;
      let newXp = Math.floor(prev.xp + xpGain);
      let newLevel = Math.floor(newXp / 1000) + 1;
      
      const updatedUser = {
        ...prev,
        energy: prev.isPremium ? 999 : prev.energy - 1,
        score: prev.score + (won ? 1 : 0), // Simple score count
        xp: newXp,
        level: newLevel,
        title: getTitleForLevel(newLevel),
        streak: newStreak,
        history: [...prev.history, { duelId: currentDuel.id, won, timestamp: Date.now() }]
      };

      updatedUser.missions = checkMissions(won, newStreak, updatedUser);
      return updatedUser;
    });
  };

  const handleNextDuel = () => {
    if (user.energy <= 0 && !user.isPremium) {
      setShowPremiumModal(true);
    } else {
      loadNewDuel();
    }
  };

  const handleShare = () => {
    if (!currentDuel || !selectedOption) return;
    const option = currentDuel.options.find(o => o.id === selectedOption);
    const text = `Eu penso igual a ${option?.percentage}% das pessoas! 😳\n\nJoguei no Decida Aí e meu rank é #${Math.floor(50000 - user.xp/10)}.\n\n👉 decida-ai.app`;
    navigator.clipboard.writeText(text);
    alert("Copiado! Mande no grupo da família.");
  };

  // Render Screens
  const renderContent = () => {
    if (screen === AppScreen.LEADERBOARD) {
      return (
        <Leaderboard 
          currentScore={user.xp}
          currentStreak={user.streak}
          onBack={() => setScreen(AppScreen.GAME)} 
        />
      );
    }

    if (screen === AppScreen.PROFILE) {
        return (
            <div className="pt-24 px-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Missões Diárias</h2>
                <div className="space-y-3">
                    {user.missions.map(m => (
                        <div key={m.id} className={`p-4 rounded-xl border ${m.completed ? 'bg-green-500/10 border-green-500' : 'bg-slate-800 border-slate-700'}`}>
                            <div className="flex justify-between mb-2">
                                <span className="font-bold">{m.description}</span>
                                <span className="text-yellow-400 font-mono">+{m.rewardXP} XP</span>
                            </div>
                            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 transition-all" style={{ width: `${(m.current / m.target) * 100}%`}}></div>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => setScreen(AppScreen.GAME)} className="mt-8 text-slate-400 underline">Voltar</button>
            </div>
        )
    }

    if (screen === AppScreen.PREMIUM) {
        return (
            <div className="h-full flex flex-col items-center justify-center pt-20 px-4">
                <div className="w-full max-w-md bg-slate-800 rounded-3xl p-6 text-center border border-slate-700">
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-500 mb-4">Decida Aí <span className="text-white text-sm bg-orange-500 px-2 rounded ml-1">PRO</span></h1>
                    <ul className="text-left space-y-3 mb-8 text-slate-300">
                        <li>✅ Energia Infinita (Jogue sem parar)</li>
                        <li>✅ Ver estatísticas detalhadas</li>
                        <li>✅ Destaque dourado no Ranking</li>
                        <li>✅ Ícone exclusivo de perfil</li>
                    </ul>
                    <button 
                        onClick={() => {
                            setUser(p => ({...p, isPremium: true, energy: 999})); 
                            setScreen(AppScreen.GAME);
                        }}
                        className="w-full py-4 rounded-xl bg-white text-slate-900 font-black hover:scale-105 transition"
                    >
                        ASSINAR AGORA (R$ 9,90)
                    </button>
                    <button onClick={() => setScreen(AppScreen.GAME)} className="mt-4 text-slate-500 text-sm">Talvez depois</button>
                </div>
            </div>
        )
    }

    // GAME SCREEN
    return (
      <main className="pt-20 pb-28 px-4 min-h-screen flex flex-col justify-between max-w-xl mx-auto relative">
        
        {/* Flash Event Banner */}
        {isFlashEvent && !showResults && (
            <div className="absolute top-20 left-0 w-full flex justify-center pointer-events-none z-10">
                <div className="bg-fuchsia-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce shadow-neon">
                    🔥 DOUBLE XP ATIVO (10 min)
                </div>
            </div>
        )}

        {/* Category Selector */}
        {!showResults && (
           <div className="flex overflow-x-auto gap-2 py-2 mb-2 no-scrollbar mask-gradient">
             {CATEGORIES.map(cat => (
               <button
                 key={cat}
                 onClick={() => setSelectedCategory(cat)}
                 className={`
                    px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all active:scale-95
                    ${selectedCategory === cat 
                        ? 'bg-white text-slate-950 shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                        : 'bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700'}
                 `}
               >
                 {cat}
               </button>
             ))}
           </div>
        )}

        {/* Game Area */}
        <div className="flex-grow flex flex-col justify-center py-4">
          {loading ? (
             <div className="flex flex-col items-center justify-center space-y-6 animate-pulse opacity-50">
                <div className="h-4 w-32 bg-slate-700 rounded-full"></div>
                <div className="h-8 w-64 bg-slate-700 rounded"></div>
                <div className="w-full h-[280px] bg-slate-800/50 rounded-3xl border border-slate-800"></div>
             </div>
          ) : currentDuel ? (
            <DuelCard 
              duel={currentDuel} 
              onVote={handleVote} 
              showResults={showResults} 
              selectedOptionId={selectedOption}
            />
          ) : (
            <div className="text-center text-white">Carregando duelo...</div>
          )}
        </div>

        {/* Action Bar (Next / Share) */}
        {showResults && (
          <div className="fixed bottom-0 left-0 w-full bg-slate-950/90 backdrop-blur-lg border-t border-slate-800 p-4 pb-8 z-40 animate-in slide-in-from-bottom duration-300">
             <div className="max-w-md mx-auto flex gap-3">
               <button 
                 onClick={handleShare}
                 className="flex-1 py-4 px-4 rounded-2xl font-bold bg-slate-800 text-white hover:bg-slate-700 transition-colors border border-slate-700"
               >
                 Compartilhar
               </button>
               <button 
                 onClick={handleNextDuel}
                 className="flex-[2] py-4 px-4 rounded-2xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-neon hover:scale-[1.02] transition-transform active:scale-95"
               >
                 Próximo Duelo ➔
               </button>
             </div>
          </div>
        )}
      </main>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden shine-effect-container">
      <Header user={user} setScreen={setScreen} currentScreen={screen} />
      
      {renderContent()}

      {(showPremiumModal) && (
        <PremiumModal 
          onClose={() => { setShowPremiumModal(false); }} 
          onGoPremium={() => {
              setUser(p => ({...p, isPremium: true, energy: 999})); 
              setShowPremiumModal(false);
          }}
          onWatchAd={() => {
              setLoading(true);
              setTimeout(() => {
                  setUser(prev => ({ ...prev, energy: prev.energy + 3 }));
                  setLoading(false);
                  setShowPremiumModal(false);
                  loadNewDuel();
              }, 1500);
          }}
        />
      )}
      
      {/* Tab Bar for Mobile Navigation */}
      <nav className="fixed bottom-0 w-full md:hidden bg-slate-950/95 backdrop-blur-md border-t border-slate-800 flex justify-around p-3 pb-6 z-30">
          <button onClick={() => setScreen(AppScreen.GAME)} className={`flex flex-col items-center gap-1 transition-colors ${screen === AppScreen.GAME ? 'text-violet-400' : 'text-slate-600'}`}>
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             <span className="text-[10px] font-bold">Jogar</span>
          </button>
          <button onClick={() => setScreen(AppScreen.LEADERBOARD)} className={`flex flex-col items-center gap-1 transition-colors ${screen === AppScreen.LEADERBOARD ? 'text-violet-400' : 'text-slate-600'}`}>
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
             <span className="text-[10px] font-bold">Ranking</span>
          </button>
          <button onClick={() => setScreen(AppScreen.PROFILE)} className={`flex flex-col items-center gap-1 transition-colors ${screen === AppScreen.PROFILE ? 'text-violet-400' : 'text-slate-600'}`}>
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
             <span className="text-[10px] font-bold">Missões</span>
          </button>
      </nav>
    </div>
  );
}

export default App;
