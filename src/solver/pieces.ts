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

// Generate all unique variations (rotations and flips)
const generateVariations = (base: PieceShape): PieceShape[] => {
  const variations: PieceShape[] = [];
  const seen = new Set<string>();

  let current = base;
  for (let i = 0; i < 4; i++) {
    const h = JSON.stringify(current);
    if (!seen.has(h)) {
      seen.add(h);
      variations.push(current);
    }

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

/**
 * DOUBLE PUZZLE PIECES (DVOJ)
 * Total cells: 41
 */
const DVOJ_RAW = [
  {
    name: 'Rect6',
    color: '#ef4444',
    shape: [[1, 1, 1], [1, 1, 1]]
  },
  {
    name: 'U5',
    color: '#f97316',
    shape: [[1, 0, 1], [1, 1, 1]]
  },
  {
    name: 'L5',
    color: '#f59e0b',
    shape: [[1, 0, 0, 0], [1, 1, 1, 1]]
  },
  {
    name: 'P5',
    color: '#84cc16',
    shape: [[1, 1], [1, 1], [1, 0]]
  },
  {
    name: 'N5',
    color: '#ec4899',
    shape: [[0, 1], [1, 1], [1, 0], [1, 0]]
  },
  {
    name: 'Z5',
    color: '#06b6d4',
    shape: [[1, 1, 0], [0, 1, 0], [0, 1, 1]]
  },
  {
    name: 'T5',
    color: '#3b82f6',
    shape: [[0, 1], [1, 1], [0, 1], [0, 1]]
  },
  {
    name: 'V5',
    color: '#a855f7',
    shape: [[1, 0, 0], [1, 0, 0], [1, 1, 1]]
  }
];

/**
 * TRIPLE PUZZLE PIECES (TROJ)
 * Total cells: 47 (50 layout - 3 targets)
 * 10 Pieces as identified from reference image.
 */
const TROJ_RAW = [
  // 1. Pink (5) - "h" shape
  {
    name: 'Pink5',
    color: '#f472b6', // Pink-400
    shape: [
      [0, 1],
      [1, 1],
      [1, 0],
      [1, 0]
    ]
  },
  // 2. Maroon (5) - ZigZag Long / Steps
  {
    name: 'Maroon5',
    color: '#9f1239', // Rose-800
    shape: [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 1]
    ]
  },
  // 3. Teal (5) - P shape
  {
    name: 'Teal5',
    color: '#0f766e', // Teal-700
    shape: [
      [1, 1],
      [1, 1],
      [0, 1]
    ]
  },
  // 4. Yellow (4) - Small Z
  {
    name: 'Yellow4',
    color: '#facc15', // Yellow-400
    shape: [
      [0, 1],
      [1, 1],
      [1, 0]
    ]
  },
  // 5. Orange (5) - L shape
  {
    name: 'Orange5',
    color: '#f97316', // Orange-500
    shape: [
      [1, 1, 1, 1],
      [0, 0, 0, 1]
    ]
  },
  // 6. Cyan (5) - Corner / Long Hook
  {
    name: 'Cyan5',
    color: '#22d3ee', // Cyan-400
    shape: [
      [1, 1, 1],
      [0, 0, 1],
      [0, 0, 1]
    ]
  },
  // 7. Red (5) - Tree / Cross-ish
  {
    name: 'Red5',
    color: '#ef4444', // Red-500
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [1, 0, 0]
    ]
  },
  // 8. Purple (4) - Small L
  {
    name: 'Purple4',
    color: '#7e22ce', // Purple-700
    shape: [
      [0, 0, 1],
      [1, 1, 1]
    ]
  },
  // 9. D.Blue (5) - U-flat / Bridge
  {
    name: 'Blue5',
    color: '#1d4ed8', // Blue-700
    shape: [
      [1, 1, 1],
      [1, 0, 1]
    ]
  },
  // 10. Green (4) - Line 4
  {
    name: 'Green4',
    color: '#15803d', // Green-700
    shape: [
      [1],
      [1],
      [1],
      [1]
    ]
  }
];

export const getPieces = (type: PuzzleType): Piece[] => {
  const raw = type === PuzzleType.TRIPLE ? TROJ_RAW : DVOJ_RAW;

  return raw.map((p, idx) => ({
    id: idx,
    name: p.name,
    color: p.color,
    baseShape: p.shape,
    shapes: generateVariations(p.shape)
  }));
};

export const PIECES = getPieces(PuzzleType.DOUBLE);
