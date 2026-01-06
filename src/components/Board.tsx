import React from 'react';
import { PuzzleType, getLayout, getLabel, MONTHS_CS, WEEKDAYS_CS } from '../solver/types';
import { getPieces } from '../solver/pieces';

interface BoardProps {
  puzzleType: PuzzleType;
  solution: number[][] | null;
  targetMonth: number;
  targetDay: number;
  targetWeekday: number | null;
  onCellClick: (month: number | null, day: number | null, weekday: number | null) => void;
  readOnly?: boolean;
}

export const Board: React.FC<BoardProps> = ({ 
    puzzleType, 
    solution, 
    targetMonth, 
    targetDay, 
    targetWeekday, 
    onCellClick, 
    readOnly = false 
}) => {
  const layout = getLayout(puzzleType);
  const rows = layout.length;
  const cols = layout[0].length;
  const pieces = getPieces(puzzleType);
  // Helper to get label for a cell


  const getCellContent = (r: number, c: number) => {
    // Wall check
    if (layout[r][c] === 0) return null;

    const label = getLabel(r, c, puzzleType);
    let bgColor = 'bg-stone-200'; // Default gray for board
    let textColor = 'text-stone-400';
    let borderColor = 'border-stone-300';
    
    // Check if it's a target
    let isTarget = false;
    const parsedLabel = Number.parseInt(label);
    
    // Month
    if (r < 2 && label === MONTHS_CS[targetMonth]) isTarget = true;
    // Day
    // Day label is numeric
    else if (!Number.isNaN(parsedLabel) && label === targetDay.toString()) isTarget = true;
    // Weekday
    else if (puzzleType === PuzzleType.TRIPLE && targetWeekday !== null) {
        if (WEEKDAYS_CS.includes(label) && label === WEEKDAYS_CS[targetWeekday]) {
            isTarget = true;
        }
    }

    // Determine piece
    const pieceId = solution?.[r]?.[c] ?? 0;
    
    // Logic:
    // If solution exists:
    //   If pieceId > 0: Show Piece Color (Label hidden or faint).
    //   If pieceId <= 0: Show Label. If isTarget, Highlight.
    // If no solution (just board setup):
    //   Show Label. If isTarget, Highlight.

    if (pieceId > 0) {
      // It's a piece
      const piece = pieces.find(p => p.id === pieceId - 1);
      if (piece) {
          // piece color is applied via style
      }
      return (
        <div 
            className={`w-full h-full flex items-center justify-center font-bold text-sm border border-white/20 select-none shadow-sm`}
            style={{ backgroundColor: piece?.color || '#ccc' }}
        >
          {/* Maybe show label faintly? No, usually opaque. */}
        </div>
      );
    } else {
        // Empty or Target
        if (isTarget) {
            bgColor = 'bg-white';
            textColor = 'text-black';
            borderColor = 'border-black';
        }
        
        return (
            <div className={`w-full h-full flex items-center justify-center font-bold text-sm border ${borderColor} ${bgColor} ${textColor} select-none transition-colors duration-300`}>
                {label}
            </div>
        );
    }
  };

  return (
    <div className="grid gap-1 p-4 bg-stone-800 rounded-lg shadow-2xl"
         style={{ 
             gridTemplateColumns: `repeat(${cols}, minmax(32px, 1fr))`,
             gridTemplateRows: `repeat(${rows}, minmax(32px, 1fr))`,
             aspectRatio: `${cols}/${rows + 0.5}` // Adjusted for better fit
         }}
    >
      {new Array(rows).fill(0).map((_, r) => 
        new Array(cols).fill(0).map((_, c) => (
            <div 
                key={`${r}-${c}`} 
                className={`aspect-square ${!readOnly ? 'cursor-pointer hover:opacity-80' : ''}`}
                onClick={() => {
                    if (readOnly) return;
                    if (layout[r][c] === 0) return;

                    const label = getLabel(r, c, puzzleType);
                    
                    // Month
                    const mIdx = MONTHS_CS.indexOf(label);
                    if (mIdx !== -1) {
                        onCellClick(mIdx, null, null);
                        return;
                    }
                    
                    // Day
                    const d = Number.parseInt(label);
                    if (!Number.isNaN(d)) {
                        onCellClick(null, d, null);
                    }

                    // Weekday
                    const wIdx = WEEKDAYS_CS.indexOf(label);
                    if (wIdx !== -1) {
                        onCellClick(null, null, wIdx);
                    }
                }}
            >
                {getCellContent(r, c)}
            </div>
        ))
      )}
    </div>
  );
};
