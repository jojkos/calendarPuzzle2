import React from 'react';


interface ControlsProps {
  onSolve: () => void;
  onStop: () => void;
  solving: boolean;
  solutionCount: number;
  visualize: boolean;
  setVisualize: (v: boolean) => void;
}

export const Controls: React.FC<ControlsProps> = ({ onSolve, onStop, solving, solutionCount, visualize, setVisualize }) => {
  return (
    <div className="flex flex-col gap-3 w-full bg-white p-4 rounded-xl shadow-sm border border-stone-200">

      <button
        onClick={solving ? onStop : onSolve}
        className={`w-full py-4 rounded-lg text-lg font-bold shadow-lg transition-all active:scale-[0.98] 
         ${solving
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
            : 'bg-stone-900 hover:bg-black text-white shadow-stone-900/20'
          }
        `}
      >
        {solving ? 'Zastavit' : 'Vyřešit Hlavolam'}
      </button>

      <div className="flex items-center justify-between px-1">
        <label className="flex items-center gap-2 cursor-pointer select-none group">
          <div className={`w-3 h-3 rounded border border-stone-300 transition-colors flex items-center justify-center
                ${visualize ? 'bg-blue-600 border-blue-600' : 'bg-white group-hover:border-stone-400'}
            `}>
            {visualize && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
          </div>
          <input
            type="checkbox"
            checked={visualize}
            disabled={solving}
            onChange={(e) => setVisualize(e.target.checked)}
            className="hidden"
          />
          <span className="text-xs text-stone-400 font-medium group-hover:text-stone-600 transition-colors">
            Zobrazit průběh řešení
          </span>
        </label>

        <div className="text-xs text-stone-500 font-medium">
          {(solving || solutionCount > 0) && (
            <span className={`px-2 py-1 rounded-md flex items-center gap-2 ${solving ? 'bg-blue-50 text-blue-700' : 'bg-stone-100 text-stone-600'}`}>
              {solving && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />}
              {solving ? 'Hledám řešení' : 'Nalezeno'}: {solutionCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
