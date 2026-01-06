import React from 'react';
import { PuzzleType } from '../solver/types';

interface PuzzleSelectorProps {
  type: PuzzleType;
  onChange: (type: PuzzleType) => void;
  disabled?: boolean;
}

export const PuzzleSelector: React.FC<PuzzleSelectorProps & { compact?: boolean }> = ({ type, onChange, disabled, compact }) => {
  return (
    <div className={`flex items-center gap-2 ${!compact ? 'bg-white p-2 rounded-xl shadow-sm border border-stone-200' : ''}`}>
      {!compact && <span className="text-sm font-medium text-stone-600 pl-2">Druh puzzle:</span>}
      <div className="flex gap-1">
        <button
          onClick={() => onChange(PuzzleType.DOUBLE)}
          disabled={disabled}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold transition-all
            ${type === PuzzleType.DOUBLE 
              ? 'bg-stone-900 text-white shadow-sm' 
              : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
            }
          `}
        >
          <div className={`w-2.5 h-2.5 rounded-full border-[1.5px] ${type === PuzzleType.DOUBLE ? 'border-blue-400 bg-blue-400' : 'border-stone-400'}`} />
          dvoj
        </button>
        
        <button
          onClick={() => onChange(PuzzleType.TRIPLE)}
          disabled={disabled}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold transition-all
            ${type === PuzzleType.TRIPLE 
              ? 'bg-stone-900 text-white shadow-sm' 
              : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
            }
          `}
        >
          <div className={`w-2.5 h-2.5 rounded-full border-[1.5px] ${type === PuzzleType.TRIPLE ? 'border-blue-400 bg-blue-400' : 'border-stone-400'}`} />
          troj
        </button>
      </div>
    </div>
  );
};
