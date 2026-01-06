export enum PuzzleType {
  DOUBLE = 'double', // Month + Day
  TRIPLE = 'triple' // Month + Day + Weekday
}

export type Coordinate = {
  row: number;
  col: number;
};

export type PieceShape = number[][]; // 0 or 1 grid

export type Piece = {
  id: number;
  name: string;
  color: string;
  shapes: PieceShape[]; // All unique variations
  baseShape: PieceShape;
};

export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' // Standard
];
// For Czech localization as requested by image:
// Led, Úno, Bře, Dub, Kvě, Čvn, Čvc, Srp, Zář, Říj, Lis, Pro
export const MONTHS_CS = [
  'Led', 'Úno', 'Bře', 'Dub', 'Kvě', 'Čvn',
  'Čvc', 'Srp', 'Zář', 'Říj', 'Lis', 'Pro'
];

export const WEEKDAYS_CS = [
  'Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'
];

// Layout Definitions

// Month + Day (Classic)
// 7 rows, 7 cols
export const LAYOUT_DOUBLE = [
  // Rows 0-1: Months (6 cols, 7th empty)
  [1, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 0],
  // Rows 2-5: Days 1-28 (7 cols)
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  // Row 6: Days 29-31 (3 cols)
  [1, 1, 1, 0, 0, 0, 0],
];

// Month + Day + Weekday
// 8 rows, 7 cols
export const LAYOUT_TRIPLE = [
  // Rows 0-1: Months
  [1, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 0],
  // Rows 2-5: Days 1-28
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  // Row 6: Days 29-31 + Weekdays Po-Čt
  [1, 1, 1, 1, 1, 1, 1],
  // Row 7: Weekdays Pá-Ne (at end?)
  // Looking at image 0 again: 29,30,31,Po,Ut,St,Ct are contiguous.
  // Then next row is: [ ], [ ], [ ], [ ], Pa, So, Ne.
  [0, 0, 0, 0, 1, 1, 1],
];


export const getLayout = (type: PuzzleType) => {
  return type === PuzzleType.TRIPLE ? LAYOUT_TRIPLE : LAYOUT_DOUBLE;
};


// Coordinate Helpers

export const getMonthCell = (monthIndex: number, _type: PuzzleType): Coordinate => {
  if (monthIndex < 6) return { row: 0, col: monthIndex };
  return { row: 1, col: monthIndex - 6 };
};

export const getDayCell = (day: number, _type: PuzzleType): Coordinate => {
  if (day <= 28) {
    const idx = day - 1;
    return {
      row: 2 + Math.floor(idx / 7),
      col: idx % 7
    };
  } else {
    // 29, 30, 31
    // Double: Row 6, Cols 0,1,2
    // Triple: Row 6, Cols 0,1,2 (Same)
    return {
      row: 6,
      col: day - 29
    };
  }
};

export const getWeekdayCell = (weekdayIndex: number, type: PuzzleType): Coordinate | null => {
  if (type !== PuzzleType.TRIPLE) return null;
  // Weekdays: 0=Po ... 6=Ne
  // Po(0), Ut(1), St(2), Ct(3) are in Row 6, cols 3,4,5,6
  // Pa(4), So(5), Ne(6) are in Row 7, cols 4,5,6
  
  if (weekdayIndex <= 3) {
      return { row: 6, col: 3 + weekdayIndex };
  } else {
      return { row: 7, col: 4 + (weekdayIndex - 4) }; // 4+0=4, 4+1=5, etc.
  }
};

export const getLabel = (r: number, c: number, type: PuzzleType): string => {
  // Months
  if (r < 2) {
    if (c >= 6) return '';
    const idx = r * 6 + c;
    return MONTHS_CS[idx];
  }

  // Days
  if (r >= 2 && r <= 5) {
     const idx = (r - 2) * 7 + c;
     return (idx + 1).toString();
  }

  // Row 6
  if (r === 6) {
     if (c < 3) return (29 + c).toString();
     
     if (type === PuzzleType.TRIPLE) {
         // c=3 -> Po(0)
         const wdIdx = c - 3;
         if (wdIdx >= 0 && wdIdx < 4) return WEEKDAYS_CS[wdIdx];
     }
  }

  // Row 7 (Only Triple)
  if (type === PuzzleType.TRIPLE && r === 7) {
      // Cols 4,5,6 -> Pa(4), So(5), Ne(6)
      if (c >= 4) {
          const wdIdx = 4 + (c - 4);
          return WEEKDAYS_CS[wdIdx];
      }
  }

  return '';
};
