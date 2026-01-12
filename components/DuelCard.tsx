import React, { useState, useEffect } from 'react';
import { Duel } from '../types';

interface DuelCardProps {
  duel: Duel;
  onVote: (optionId: string) => void;
  showResults: boolean;
  selectedOptionId: string | null;
}

const DuelCard: React.FC<DuelCardProps> = ({ duel, onVote, showResults, selectedOptionId }) => {
  const [animateProgress, setAnimateProgress] = useState(false);

  useEffect(() => {
    if (showResults) {
      setTimeout(() => setAnimateProgress(true), 50);
    } else {
      setAnimateProgress(false);
    }
  }, [showResults]);

  const renderOption = (optionIndex: number) => {
    const option = duel.options[optionIndex];
    const isSelected = selectedOptionId === option.id;
    const isWinner = option.percentage >= 50;
    
    // Design States
    let cardStyle = "bg-slate-800/50 border-slate-700"; // Default
    let textStyle = "text-slate-200";
    let percentageColor = "text-slate-400";
    
    if (showResults) {
      if (isSelected) {
        if (isWinner) {
          // User Won
          cardStyle = "bg-green-500/20 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.2)]";
          percentageColor = "text-green-400";
        } else {
          // User Lost
          cardStyle = "bg-red-500/10 border-red-500/50";
          percentageColor = "text-red-400";
        }
      } else if (isWinner) {
        // Winner (not selected)
        cardStyle = "bg-slate-800 border-slate-600 opacity-60";
        percentageColor = "text-slate-300";
      } else {
        // Loser (not selected)
        cardStyle = "bg-slate-900 border-slate-800 opacity-40";
      }
    } else {
      // Idle State (Ready to vote)
      cardStyle = "bg-slate-800 border-slate-700 hover:border-violet-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] active:scale-[0.98]";
    }

    return (
      <button
        disabled={showResults}
        onClick={() => onVote(option.id)}
        className={`
          relative w-full h-[280px] rounded-3xl border-2 p-6 flex flex-col items-center justify-center text-center 
          transition-all duration-300 overflow-hidden group backdrop-blur-sm
          ${cardStyle}
        `}
      >
        {/* Background Progress Fill */}
        {showResults && (
           <div 
             className={`absolute bottom-0 left-0 h-full transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) opacity-20
               ${isWinner ? 'bg-green-500' : 'bg-slate-500'}
             `}
             style={{ width: animateProgress ? `${option.percentage}%` : '0%' }}
           />
        )}

        <div className="relative z-10 flex flex-col items-center gap-4 w-full">
           {/* Percentage - Large & Impactful */}
           {showResults && (
            <div className={`text-6xl font-black tracking-tighter ${percentageColor} animate-pop drop-shadow-lg`}>
                {option.percentage}%
            </div>
           )}

           {/* Option Text */}
           <span className={`text-2xl md:text-3xl font-bold leading-tight ${textStyle} ${!showResults && 'group-hover:scale-105 transition-transform'}`}>
             {option.text}
           </span>

            {/* Badges */}
           {showResults && isSelected && (
               <div className={`
                 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg mt-2
                 ${isWinner ? 'bg-green-500 text-slate-900 animate-bounce' : 'bg-red-500 text-white'}
               `}>
                   {isWinner ? 'Maioria!' : 'Minoria'}
               </div>
           )}
        </div>
      </button>
    );
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      <div className="text-center space-y-3 pt-4">
         {duel.isRare && (
           <div className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/50 rounded-full text-xs font-bold uppercase tracking-widest mb-2 animate-pulse">
             ✨ Pergunta Rara
           </div>
         )}
         <h1 className="text-2xl md:text-3xl font-black text-white px-2 leading-tight drop-shadow-xl">
            {duel.question}
         </h1>
      </div>

      <div className="flex flex-col gap-4 px-2">
        {renderOption(0)}
        
        {/* VS Element */}
        <div className="relative h-6 flex items-center justify-center -my-3 z-20 pointer-events-none">
           <div className="bg-slate-900 border-2 border-slate-700 text-slate-500 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
             Ou
           </div>
        </div>
        
        {renderOption(1)}
      </div>

      {showResults && (
          <div className="text-center flex items-center justify-center gap-2 text-slate-500 text-sm animate-in fade-in duration-700">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              {duel.totalVotes.toLocaleString()} pessoas votaram
          </div>
      )}
    </div>
  );
};

export default DuelCard;
