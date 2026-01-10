import { PuzzleType, getLayout, getMonthCell, getDayCell, getWeekdayCell } from './types.ts';
import { getPieces } from './pieces.ts';

// Board representation: number[][]
// -1: Wall/Invalid
// 0: Empty
// >0: Piece ID (1-based to distinguish from empty)

export type Solution = number[][];

export class Solver {
    private board: number[][];
    private solutions: Solution[] = [];
    private stopped: boolean = false;
    private rows: number;
    private cols: number;
    private pieces: any[]; // Piece[]

    constructor(type: PuzzleType, month: number, day: number, weekday: number | null) {
        const layout = getLayout(type);
        this.pieces = getPieces(type);
        this.rows = layout.length;
        this.cols = layout[0].length;

        // Initialize board
        this.board = new Array(this.rows).fill(0).map((_, r) =>
            new Array(this.cols).fill(0).map((_, c) => {
                if (layout[r][c] === 0) return -1; // Wall
                return 0; // Empty
            })
        );

        const m = getMonthCell(month, type);
        const d = getDayCell(day, type);

        this.board[m.row][m.col] = -1; // Blocked
        this.board[d.row][d.col] = -1; // Blocked

        if (type === PuzzleType.TRIPLE && weekday !== null) {
            const w = getWeekdayCell(weekday, type);
            if (w) {
                this.board[w.row][w.col] = -1;
            }
        }
    }

    public stop() {
        this.stopped = true;
    }

    // Check if placement is valid
    private canPlace(pieceShape: number[][], r: number, c: number): boolean {
        const H = pieceShape.length;
        const W = pieceShape[0].length;

        for (let i = 0; i < H; i++) {
            for (let j = 0; j < W; j++) {
                if (pieceShape[i][j] === 1) {
                    const br = r + i;
                    const bc = c + j;
                    if (br >= this.rows || bc >= this.cols) return false;
                    if (this.board[br][bc] !== 0) return false; // Not empty
                }
            }
        }
        return true;
    }

    private place(pieceShape: number[][], r: number, c: number, id: number) {
        const H = pieceShape.length;
        const W = pieceShape[0].length;
        for (let i = 0; i < H; i++) {
            for (let j = 0; j < W; j++) {
                if (pieceShape[i][j] === 1) {
                    this.board[r + i][c + j] = id;
                }
            }
        }
    }

    private remove(pieceShape: number[][], r: number, c: number) {
        const H = pieceShape.length;
        const W = pieceShape[0].length;
        for (let i = 0; i < H; i++) {
            for (let j = 0; j < W; j++) {
                if (pieceShape[i][j] === 1) {
                    this.board[r + i][c + j] = 0;
                }
            }
        }
    }

    // Pruning: Check for isolated empty cells that are smaller than the smallest piece (usually 5)
    // Actually smallest is 5. If we have a region of 1-4 empty cells, we can't fill it.
    // Wait, is smallest 5? We have 6 and 5s. Yes, min size is 5.
    // Exception: Maybe we have a 1x1 hole?
    // We can do a flood fill to count size of empty components.
    private isPruned(): boolean {
        const visited = new Set<string>();

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.board[r][c] === 0 && !visited.has(`${r},${c}`)) {
                    // Start BFS/DFS
                    let size = 0;
                    const queue = [{ r, c }];
                    visited.add(`${r},${c}`);
                    size++;

                    let head = 0;
                    while (head < queue.length) {
                        const curr = queue[head++];
                        const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
                        for (const [dr, dc] of dirs) {
                            const nr = curr.r + dr;
                            const nc = curr.c + dc;
                            if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols &&
                                this.board[nr][nc] === 0 && !visited.has(`${nr},${nc}`)) {
                                visited.add(`${nr},${nc}`);
                                queue.push({ r: nr, c: nc });
                                size++;
                            }
                        }
                    }

                    // If any region is not a multiple of 5? No, pieces are 5 and 6.
                    // So specific multiples are not required, but size < 5 is definitely dead end.
                    if (size < 5) return true;
                }
            }
        }
        return false;
    }

    private findEmptySpot(): { r: number, c: number } | null {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.board[r][c] === 0) return { r, c };
            }
        }
        return null;
    }



    // piecesAvailable: Set of indices
    public solve(limit: number = 10000): void {
        const allPieces = new Set(this.pieces.map(p => p.id));
        this.solveFlexible(allPieces, limit);
    }

    private solveFlexible(piecesAvailable: Set<number>, limit: number): void {
        if (this.stopped) return;
        if (this.solutions.length >= limit) return;

        const spot = this.findEmptySpot();
        if (!spot) {
            // Success
            this.solutions.push(this.board.map(row => [...row]));
            return;
        }

        const { r, c } = spot;

        // Check pruning
        if (this.isPruned()) return;

        // Try every available piece
        for (const pIdx of piecesAvailable) {
            const piece = this.pieces[pIdx];

            // Try every variation
            for (const shape of piece.shapes) {
                const H = shape.length;
                const W = shape[0].length;

                for (let ir = 0; ir < H; ir++) {
                    for (let ic = 0; ic < W; ic++) {
                        if (shape[ir][ic] === 1) {
                            const originR = r - ir;
                            const originC = c - ic;

                            if (originR < 0 || originC < 0) continue;

                            if (this.canPlace(shape, originR, originC)) {
                                this.place(shape, originR, originC, piece.id + 1);

                                const nextAvailable = new Set(piecesAvailable);
                                nextAvailable.delete(pIdx);

                                this.solveFlexible(nextAvailable, limit);

                                this.remove(shape, originR, originC);

                                if (this.solutions.length >= limit) return;
                            }
                        }
                    }
                }
            }
        }
    }

    // Visualization helper
    private async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public async solveAsync(
        onUpdate: (board: number[][]) => void,
        delayMs: number = 20,
        limit: number = 10000
    ): Promise<void> {
        const allPieces = new Set(this.pieces.map(p => p.id));
        await this.solveFlexibleAsync(allPieces, onUpdate, delayMs, limit);
    }

    private async solveFlexibleAsync(
        piecesAvailable: Set<number>,
        onUpdate: (board: number[][]) => void,
        delayMs: number,
        limit: number
    ): Promise<boolean> {
        if (this.stopped) return false;
        if (this.solutions.length >= limit) return true;

        const spot = this.findEmptySpot();
        if (!spot) {
            this.solutions.push(this.board.map(row => [...row]));
            onUpdate(this.board);
            await this.delay(delayMs * 10); // Pause briefly on solution
            return false; // Return false to continue searching for more solutions
        }

        const { r, c } = spot;

        if (this.isPruned()) return false;

        for (const pIdx of piecesAvailable) {
            if (this.stopped) return false;
            const piece = this.pieces[pIdx];

            for (const shape of piece.shapes) {
                const H = shape.length;
                const W = shape[0].length;

                for (let ir = 0; ir < H; ir++) {
                    for (let ic = 0; ic < W; ic++) {
                        if (shape[ir][ic] === 1) {
                            const originR = r - ir;
                            const originC = c - ic;

                            if (originR < 0 || originC < 0) continue;

                            if (this.canPlace(shape, originR, originC)) {
                                this.place(shape, originR, originC, piece.id + 1);
                                onUpdate(this.board);
                                await this.delay(delayMs);

                                const nextAvailable = new Set(piecesAvailable);
                                nextAvailable.delete(pIdx);

                                const finished = await this.solveFlexibleAsync(nextAvailable, onUpdate, delayMs, limit);
                                if (finished) return true;

                                this.remove(shape, originR, originC);
                                onUpdate(this.board);
                                // await this.delay(delayMs); 
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    public getSolutions(): Solution[] {
        return this.solutions;
    }
}
