import React from 'react';
import { PuzzleType } from '../solver/types';

interface PuzzleSelectorProps {
  type: PuzzleType;
  onChange: (type: PuzzleType) => void;
  disabled?: boolean;
}

export const PuzzleSelector: React.FC<PuzzleSelectorProps> = ({ type, onChange, disabled }) => {
  return (
    <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-stone-200">
      <span className="text-sm font-medium text-stone-600 pl-2">Druh puzzle:</span>
      <div className="flex gap-2">
        <button
          onClick={() => onChange(PuzzleType.DOUBLE)}
          disabled={disabled}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all
            ${type === PuzzleType.DOUBLE 
              ? 'bg-stone-900 text-white shadow-md transform scale-105' 
              : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
            }
          `}
        >
          <div className={`w-3 h-3 rounded-full border-2 ${type === PuzzleType.DOUBLE ? 'border-blue-400 bg-blue-400' : 'border-stone-400'}`} />
          dvoj
        </button>
        
        <button
          onClick={() => onChange(PuzzleType.TRIPLE)}
          disabled={disabled}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all
            ${type === PuzzleType.TRIPLE 
              ? 'bg-stone-900 text-white shadow-md transform scale-105' 
              : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
            }
          `}
        >
          <div className={`w-3 h-3 rounded-full border-2 ${type === PuzzleType.TRIPLE ? 'border-blue-400 bg-blue-400' : 'border-stone-400'}`} />
          troj
        </button>
      </div>
    </div>
  );
};
