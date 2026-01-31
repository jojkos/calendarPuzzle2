import { useState, useEffect, useRef } from 'react';
import { Board } from './components/Board';
import { Controls } from './components/Controls';
import { PuzzleSelector } from './components/PuzzleSelector';
import { Solver, Solution } from './solver/solver';
import { PuzzleType } from './solver/types';

function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}


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
    const [liveSolutionCount, setLiveSolutionCount] = useState(0);

    const solverRef = useRef<Solver | null>(null);

    useEffect(() => {
        // Reset solutions when config changes
        setSolutions([]);
        setLiveSolutionCount(0);
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
        setLiveSolutionCount(0);
        setVisualBoard(null);

        // Give UI a moment
        await new Promise(r => setTimeout(r, 50));

        try {
            const solver = new Solver(puzzleType, month, day, weekday, true);
            solverRef.current = solver;

            if (visualize) {
                // Visualize mode: Find ONE solution with animation
                await solver.solveAsync((boardState) => {
                    // Deep copy to trigger re-render
                    setVisualBoard(boardState.map(row => [...row]));
                }, 50, 1, (count) => {
                    setLiveSolutionCount(count);
                });

                // The visual solver stops after 1. To show ALL solutions to the user
                // without making them wait 20mins, we now run a sync solve in the background
                // to get the rest instantaneously.
                if (solverRef.current) { // Check if not stopped
                    const fullSolver = new Solver(puzzleType, month, day, weekday, true);
                    // Use new live solver for background search too, to keep UI responsive
                    await fullSolver.solveLive((sol) => {
                        setSolutions(prev => {
                            // If this is the FIRST solution found overall (considering visual one)
                            // Actually, visual one added 1. Now we add more.
                            // But wait, visual solver found 1.
                            // We should probably just start from scratch or append?
                            // Logic was: Visual finds 1. Then we run FULL search to find ALL.
                            // So we clear solutions again? Or distinct?
                            // Let's stick to original logic: Visual finds 1 to show. Then we find ALL to list.
                            return [...prev, sol];
                        });
                        setLiveSolutionCount(count => count + 1);
                    }, 10000);

                    const found = fullSolver.getSolutions();
                    if (found.length > 0) {
                        // Dedup if needed, but we used a fresh solver instance so `found` is complete set
                        // const shuffled = shuffleArray(found); // Solver is already randomizing search order
                        setSolutions(found);
                        setVisualBoard(null);
                        setCurrentSolutionIndex(0);
                    }
                }
            } else {
                // Standard mode using non-blocking Live Solver
                let isFirst = true;
                await solver.solveLive((sol) => {
                    setSolutions(prev => [...prev, sol]);
                    setLiveSolutionCount(prev => prev + 1);

                    if (isFirst) {
                        isFirst = false;
                        // On first solution, show it immediately!
                        // Setting solutions state triggers re-render, 
                        // and since index is 0, it will display this first solution.
                        setCurrentSolutionIndex(0);
                    }
                }, 10000);
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
        <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-2 font-sans text-stone-800">

            <div className="w-full max-w-lg flex flex-col gap-2">

                {/* Header & Selector merged */}
                <div className="flex flex-row items-center justify-between gap-2 bg-white p-2 px-3 rounded-xl shadow-sm border border-stone-200">
                    <h1 className="text-xl font-black tracking-tight text-stone-900 whitespace-nowrap mr-2">
                        Calendar<span className="text-blue-600">Solver</span>
                    </h1>
                    <PuzzleSelector
                        type={puzzleType}
                        onChange={setPuzzleType}
                        disabled={isSolving}
                        compact={true} // We will add this prop or just style it via className in PuzzleSelector if needed, but for now we arrange it here.
                    />
                </div>

                <Controls
                    onSolve={handleSolve}
                    onStop={handleStop}
                    solving={isSolving}
                    solutionCount={isSolving ? liveSolutionCount : solutions.length}
                    visualize={visualize}
                    setVisualize={setVisualize}
                />

                {/* Solution Navigation */}
                {solutions.length > 0 && (
                    <div className="w-full bg-white p-1.5 px-3 rounded-xl shadow-sm border border-stone-200 flex items-center justify-between">
                        <button onClick={prevSolution} className="p-1 px-3 hover:bg-stone-50 rounded text-stone-600 text-sm">← Prev</button>
                        <span className="font-mono font-bold text-sm text-stone-700">
                            {currentSolutionIndex + 1} / {solutions.length}
                        </span>
                        <button onClick={nextSolution} className="p-1 px-3 hover:bg-stone-50 rounded text-stone-600 text-sm">Next →</button>
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
