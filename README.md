# Calendar Solver
[Calendar Solver](https://calendar-puzzle2.vercel.app/) 

A modern, high-performance web application designed to solve the "A-Puzzle-A-Day" calendar puzzles.

## 🚀 Features

- **Blazing Fast Solver**: Calculates solutions in milliseconds using an optimized backtracking algorithm.
- **Multiple Puzzle Variants**: 
  - **Standard**: Solve the classic puzzle (Month + Day).
  - **Triple (Double-Sided)**: Solve the advanced version with Month, Day, and Weekday.
- **Interactive Visualization**: Watch the solver work in real-time with step-by-step animations.
- **Solution Browser**: Easily cycle through all possible valid solutions for any given date.
- **Modern UI**: Clean, responsive design built with Tailwind CSS.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

## 🏃 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory.
2. **Install dependencies**:
   ```bash
   npm install
   ```

### Running the App

- **Development Mode**:
  Starts a local development server with hot module replacement (HMR).
  ```bash
  npm run dev
  ```
  Then open `http://localhost:5173` in your browser.

- **Production Build**:
  Compiles and minifies the application for production.
  ```bash
  npm run build
  ```

- **Preview Production Build**:
  Locally preview the production build.
  ```bash
  npm run preview
  ```

## 🧩 How it Works

The application uses a recursive backtracking algorithm to place puzzle pieces on the board. For each piece, it tries all possible orientations (rotations and flips) and positions until a valid configuration is found that leaves only the target date cells uncovered.

- **Visualization Mode**: Slows down the algorithm to show the search process.
- **Instant Mode**: Finds all solutions immediately using the optimized solver.

## 📄 License

This project is licensed under the ISC License.
