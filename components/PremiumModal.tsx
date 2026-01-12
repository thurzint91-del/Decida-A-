import React from 'react';

interface PremiumModalProps {
  onClose: () => void;
  onGoPremium: () => void;
  onWatchAd: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ onClose, onGoPremium, onWatchAd }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full md:max-w-md bg-slate-900 md:rounded-3xl rounded-t-3xl border border-slate-800 p-6 md:p-8 relative overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        
        {/* Background FX */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 blur-[80px] rounded-full pointer-events-none"></div>

        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8 pt-4">
          <div className="w-20 h-20 bg-slate-800 rounded-full mx-auto flex items-center justify-center mb-4 relative">
             <div className="absolute inset-0 rounded-full animate-ping bg-red-500/20"></div>
             <span className="text-4xl">⚡</span>
          </div>
          <h2 className="text-3xl font-black text-white mb-2 leading-tight">Zero Energia!</h2>
          <p className="text-slate-400">
            Você estava indo tão bem! Não perca seu <span className="text-orange-400 font-bold">Streak diário</span>.
          </p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={onGoPremium}
            className="group relative w-full py-4 px-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-2xl shadow-neon transform transition active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <div className="relative flex items-center justify-between">
                <div className="text-left">
                    <div className="font-black text-lg">Seja VIP 👑</div>
                    <div className="text-xs opacity-90">Jogadas infinitas + Stats</div>
                </div>
                <div className="text-right">
                    <div className="text-xs line-through opacity-70">R$ 19,90</div>
                    <div className="font-bold bg-white/20 px-2 py-0.5 rounded text-sm">R$ 9,90</div>
                </div>
            </div>
          </button>
          
          <div className="flex items-center justify-center gap-4 text-xs text-slate-600 font-bold tracking-widest uppercase">
            <span>ou continue de graça</span>
          </div>

          <button 
            onClick={onWatchAd}
            className="w-full py-4 px-6 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl transition active:scale-95 border border-slate-700 flex items-center justify-center gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
               <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
            Assistir Vídeo Curto (+3 ⚡)
          </button>
        </div>
        
        <p className="text-center text-[10px] text-slate-600 mt-6">
          Ao assinar você concorda com os termos. Cancele quando quiser.
        </p>
      </div>
    </div>
  );
};

export default PremiumModal;
