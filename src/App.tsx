import { useState, useEffect, useRef } from 'react';
import { Board } from './components/Board';
import { Controls } from './components/Controls';
import { PuzzleSelector } from './components/PuzzleSelector';
import { Solver, Solution } from './solver/solver';
import { PuzzleType } from './solver/types';

function App() {
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [day, setDay] = useState<number>(new Date().getDate());
  const [weekday, setWeekday] = useState<number>((new Date().getDay() + 6) % 7); // 0=Mon, 6=Sun (Standard JS is 0=Sun)
  
  const [puzzleType, setPuzzleType] = useState<PuzzleType>(PuzzleType.DOUBLE);

  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [currentSolutionIndex, setCurrentSolutionIndex] = useState<number>(0);
  const [isSolving, setIsSolving] = useState(false);

  const [visualize, setVisualize] = useState(false);
  const [visualBoard, setVisualBoard] = useState<number[][] | null>(null);

  const solverRef = useRef<Solver | null>(null);

  useEffect(() => {
    // Reset solutions when config changes
    setSolutions([]);
    setCurrentSolutionIndex(0);
    setVisualBoard(null);
  }, [month, day, weekday, puzzleType]);

  const handleStop = () => {
      if (solverRef.current) {
          solverRef.current.stop();
      }
      setIsSolving(false);
  };

  const handleSolve = async () => {
    if (isSolving) return;

    setIsSolving(true);
    setSolutions([]);
    setVisualBoard(null);

    // Give UI a moment
    await new Promise(r => setTimeout(r, 50));
    
    try {
        const solver = new Solver(puzzleType, month, day, weekday);
        solverRef.current = solver;

        if (visualize) {
            // Visualize mode: Find ONE solution with animation
            await solver.solveAsync((boardState) => {
                // Deep copy to trigger re-render
                setVisualBoard(boardState.map(row => [...row]));
            }, 50); // 50ms delay per step
            
            // Check if we found a solution
            // The solver updates visualBoard. 
            // If finished, we can check if it has solutions internally but solveAsync returns boolean
            if (solver.getSolutions().length > 0) {
                 setSolutions(solver.getSolutions());
                 setVisualBoard(null); // Switch to standard view
            }
        } else {
            // Standard mode
            const found = solver.getSolutions();
            setSolutions(found);
            setCurrentSolutionIndex(0);
        }
        
    } catch (e) {
        console.error(e);
    } finally {
        setIsSolving(false);
        solverRef.current = null;
    }
  };

  const nextSolution = () => {
      setCurrentSolutionIndex(prev => (prev + 1) % solutions.length);
  };
  
  const prevSolution = () => {
      setCurrentSolutionIndex(prev => (prev - 1 + solutions.length) % solutions.length);
  };

  const currentSolution = solutions.length > 0 ? solutions[currentSolutionIndex] : null;

  const handleCellClick = (m: number | null, d: number | null, w: number | null) => {
      if (isSolving) return;
      if (m !== null) setMonth(m);
      if (d !== null) setDay(d);
      if (w !== null) setWeekday(w);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4 font-sans text-stone-800">
      
      <div className="w-full max-w-lg flex flex-col gap-4">
        
        {/* Header */}
        <div className="flex items-baseline justify-between px-1">
            <h1 className="text-2xl font-black tracking-tight text-stone-900">Calendar<span className="text-blue-600">Solver</span></h1>
        </div>

        <PuzzleSelector 
            type={puzzleType}
            onChange={setPuzzleType}
            disabled={isSolving}
        />

        <Controls 
            onSolve={handleSolve}
            onStop={handleStop}
            solving={isSolving}
            solutionCount={solutions.length}
            visualize={visualize}
            setVisualize={setVisualize}
        />
        
        {/* Solution Navigation */}
        {solutions.length > 0 && !isSolving && (
            <div className="w-full bg-white p-2 px-4 rounded-xl shadow-sm border border-stone-200 flex items-center justify-between">
                <button onClick={prevSolution} className="p-1 px-3 hover:bg-stone-50 rounded text-stone-600">← Prev</button>
                <span className="font-mono font-bold text-sm text-stone-700">
                    {currentSolutionIndex + 1} / {solutions.length}
                </span>
                <button onClick={nextSolution} className="p-1 px-3 hover:bg-stone-50 rounded text-stone-600">Next →</button>
            </div>
        )}

        {/* Board */}
        <div className="w-full bg-stone-800 p-2 sm:p-4 rounded-xl shadow-xl overflow-hidden">
            <Board 
                puzzleType={puzzleType}
                solution={visualBoard || currentSolution} 
                targetMonth={month} 
                targetDay={day}
                targetWeekday={puzzleType === PuzzleType.TRIPLE ? weekday : null}
                onCellClick={handleCellClick}
                readOnly={isSolving}
            />
        </div>

      </div>
    </div>
  );
}

export default App;
