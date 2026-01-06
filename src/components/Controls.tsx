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
    <div className="flex flex-row items-center justify-between w-full gap-4 bg-white p-3 rounded-xl shadow-sm border border-stone-200">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-stone-500 hover:text-stone-800 transition-colors">
            <input 
              type="checkbox" 
              checked={visualize} 
              disabled={solving}
              onChange={(e) => setVisualize(e.target.checked)}
              className="w-4 h-4 rounded border-stone-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Zobrazovat průběh skládání</span>
        </label>
      </div>

      <div className="flex items-center gap-4">
          <div className="text-xs text-stone-500 font-medium whitespace-nowrap hidden sm:block">
              {solutionCount > 0 ? `${solutionCount} Found` : ''}
          </div>
          <button
            onClick={solving ? onStop : onSolve}
            className={`px-8 py-2.5 rounded-lg text-sm font-bold shadow-lg transition-all active:scale-95 min-w-[120px]
             ${solving 
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                : 'bg-stone-900 hover:bg-black text-white'
             }
            `}
          >
            {solving ? 'STOP' : 'Vyřešit'}
          </button>
      </div>
    </div>
  );
};
