import { Piece, PieceShape, PuzzleType } from './types';

// Helper to rotate a matrix 90 degrees clockwise
const rotate90 = (shape: PieceShape): PieceShape => {
  const R = shape.length;
  const C = shape[0].length;
  const newShape = new Array(C).fill(0).map(() => new Array(R).fill(0));
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      newShape[c][R - 1 - r] = shape[r][c];
    }
  }
  return newShape;
};

// Helper to flip horizontal
const flip = (shape: PieceShape): PieceShape => {
  return shape.map(row => [...row].reverse());
};

// Generate all unique variations
const generateVariations = (base: PieceShape): PieceShape[] => {
  const variations: PieceShape[] = [];
  const seen = new Set<string>();

  let current = base;
  // 4 rotations
  for (let i = 0; i < 4; i++) {
    const h = JSON.stringify(current);
    if (!seen.has(h)) {
      seen.add(h);
      variations.push(current);
    }
    
    // Flip each rotation
    const flipped = flip(current);
    const fh = JSON.stringify(flipped);
    if (!seen.has(fh)) {
      seen.add(fh);
      variations.push(flipped);
    }

    current = rotate90(current);
  }
  return variations;
};

// Standard pieces (DragonFjord A-Puzzle-A-Day)
// Total 41 cells. 8 pieces.
// Shapes are approximations, need to be verified against physical puzzle if possible.
// Common synthesis:
// 1. Rect 2x3 (6) - The big block.
// 2. U-Pentomino (5)
// 3. L-Pentomino (5)
// 4. P-Pentomino (5)
// 5. Z-Pentomino (5) ?
// 6. V-Pentomino (5)
// 7. Strange crooked shape (5)
// 8. Another crooked shape (5)
// Sum: 6 + 5*7 = 41. Correct.

const rawPieces: { name: string; color: string; shape: number[][] }[] = [
  {
    name: 'Rect6',
    color: '#ef4444', // Red
    shape: [
      [1, 1, 1],
      [1, 1, 1]
    ]
  },
  {
    name: 'U5',
    color: '#f97316', // Orange
    shape: [
      [1, 0, 1],
      [1, 1, 1]
    ]
  },
  {
    name: 'L5',
    color: '#f59e0b', // Amber
    shape: [
      [1, 0, 0, 0],
      [1, 1, 1, 1]
    ]
  },
  {
    name: 'P5',
    color: '#84cc16', // Lime
    shape: [
      [1, 1],
      [1, 1],
      [1, 0]
    ]
  },
  {
    name: 'N5', // Or zig-zag
    color: '#10b981', // Emerald
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [1, 0, 0] // Wait this is 5? 1,2 + 1,2 + 1 = 5. No.
      // [0,1,1] -> 2
      // [1,1,0] -> 2
      // Total 4? 
      // Let's use standard pentomino definitions where possible.
    ]
  },
  // Correcting N5 (standard N-pentomino)
  // [1, 1, 0],
  // [0, 1, 1],
  // [0, 0, 1] ?? No, that's len 5.
  
  // Re-defining specifically for this puzzle based on typical set.
  // The pieces are usually:
  // 1. 2x3 rect (6)
  // 2. L-shape (4) + 1 bump? (Usually "L" is 4 in Tetris, 5 in Pentominos)
  // Let's assume standard set for "A Puzzle A Day".
  // Reference: https://www.youtube.com/watch?v=... (Can't watch)
  // Search result often lists:
  // - 2x3 block (6)
  // - U-shape (5)
  // - L-shape (5) : Long leg 4, short leg 2. Total 5. (1x4 + 1 side)
  // - P-shape (5) : 2x2 square + 1 extra.
  // - Z-shape (5) : 3 row, 1,1,1? No.
  // - T-shape?
  // - V-shape (3x3 corner? 1,1,1 horizontal, 1,1 vertical? -> 5 cells)
  
  // Let's try to include a "Piece Editor" or "Debug view" if the solution is impossible.
  // But for now, I'll put my best guess of the 8 pieces.
  
  {
    name: 'Z5', // Standard Z pentomino?
    color: '#06b6d4', // Cyan
    shape: [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 1]
    ]
  },
  {
    name: 'T5',
    color: '#3b82f6', // Blue
    shape: [
      [0, 1 ],
      [1, 1 ],
      [0, 1 ],
      [0, 1 ]
    ]
  },
  {
    name: 'V5',
    color: '#a855f7', // Purple
    shape: [
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 1]
    ]
  },
  // I need to double check the count.
  // Rect6 (6)
  // U5 (5)
  // L5 (5)
  // P5 (5)
  // Z5 (5)
  // T5 (5)
  // V5 (5)
  // I need one more 5-mino.
  // N5?
];

// Let's fix N5
const N5 = {
    name: 'N5',
    color: '#ec4899', // Pink
    shape: [
      [0, 1], 
      [1, 1],
      [1, 0],
      [1, 0] 
     ]
     // 1+2+1+1 = 5.
};


// Replacing the placeholder N5 in the array
rawPieces.splice(4, 1, N5);

export const getPieces = (type: PuzzleType): Piece[] => {
  const basePieces = rawPieces.map((p, idx) => ({
    id: idx,
    name: p.name,
    color: p.color,
    baseShape: p.shape,
    shapes: generateVariations(p.shape)
  }));

  if (type === PuzzleType.DOUBLE) {
    return basePieces;
  }

  // For Triple, we need to cover 47 cells (50 - 3).
  // Base pieces cover 41. We need 6 more.
  // We assume one extra piece of size 6.
  // I will guess a shape for now (Ladder / Steps) or Long I.
  // Let's use a "Stairs" shape (1, 2, 3) which is 6 cells.
  // [1, 0, 0]
  // [1, 1, 0]
  // [1, 1, 1]
  const extraPiece: Piece = {
      id: 8,
      name: 'Extra6',
      color: '#4b5563', // Gray/Zinc
      baseShape: [
        [1, 0, 0],
        [1, 1, 0],
        [1, 1, 1]
      ],
      shapes: generateVariations([
        [1, 0, 0],
        [1, 1, 0],
        [1, 1, 1]
      ])
  };

  return [...basePieces, extraPiece];
};

export const PIECES = getPieces(PuzzleType.DOUBLE); // Fallback export for existing code if any

