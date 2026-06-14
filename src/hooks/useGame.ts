import { useReducer, useCallback, useState } from 'react';

type Player = 'X' | 'O';
type CellValue = Player | null;
type BoardState = CellValue[];

interface GameState {
  board: BoardState;
  currentPlayer: Player;
}

type GameAction = { type: 'move'; index: number } | { type: 'restart' };

// rows, cols, diagonals. flat indices bc board is a 1d array
const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function checkWinner(board: BoardState): { winner: Player; line: number[] } | null {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line };
    }
  }
  return null;
}

// O maximizes, X minimizes. depth penalty so the ai prefers faster wins.
// mutates board in place and undoes it, thats why callers pass a copy.
function minimax(
  board: BoardState,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
): number {
  const result = checkWinner(board);
  if (result) return result.winner === 'O' ? 10 - depth : depth - 10;
  if (board.every(cell => cell !== null)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] !== null) continue;
      board[i] = 'O';
      best = Math.max(best, minimax(board, depth + 1, false, alpha, beta));
      board[i] = null;
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break; // prune, minimizer wont pick this path
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] !== null) continue;
      board[i] = 'X';
      best = Math.min(best, minimax(board, depth + 1, true, alpha, beta));
      board[i] = null;
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
}

function getBestMove(board: BoardState): number {
  let bestScore = -Infinity;
  let bestMove = -1;
  for (let i = 0; i < 9; i++) {
    if (board[i] !== null) continue;
    board[i] = 'O';
    const score = minimax(board, 0, false, -Infinity, Infinity);
    board[i] = null;
    if (score > bestScore) {
      bestScore = score;
      bestMove = i;
    }
  }
  return bestMove;
}

const INITIAL_STATE: GameState = {
  board: Array(9).fill(null),
  currentPlayer: 'X',
};

// reducer places X and O in one dispatch. avoids useEffect setState which
// triggers cascading renders and lint errors. also makes the ai truly instant
// bc both moves land in a single render.
function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === 'restart') return INITIAL_STATE;

  if (action.type !== 'move') return state;
  if (state.board[action.index] || checkWinner(state.board) || state.currentPlayer !== 'X') return state;

  const board = [...state.board];
  board[action.index] = 'X';

  // check if humans move ended the game before letting ai go
  if (checkWinner(board) || board.every(cell => cell !== null)) {
    return { board, currentPlayer: 'X' };
  }

  const aiMove = getBestMove([...board]);
  if (aiMove !== -1) {
    board[aiMove] = 'O';
  }

  // currentPlayer stays X bc the ai already went
  return { board, currentPlayer: 'X' };
}

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  // player gets a point for draws, ai gets a point for draws and wins
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [counted, setCounted] = useState(false);

  // derived state, recomputed each render. cheap bc its just 8 line checks.
  const result = checkWinner(state.board);
  const winner = result?.winner ?? null;
  const winningLine = result?.line ?? null;
  const isDraw = !winner && state.board.every(cell => cell !== null);
  const isGameOver = winner !== null || isDraw;

  if (isGameOver && !counted) {
    if (winner === 'O') setAiScore(n => n + 1);
    if (isDraw) {
      setPlayerScore(n => n + 1);
      setAiScore(n => n + 1);
    }
    setCounted(true);
  }

  const handleCellClick = useCallback((index: number) => {
    dispatch({ type: 'move', index });
  }, []);

  const restart = useCallback(() => {
    dispatch({ type: 'restart' });
    setCounted(false);
  }, []);

  return { board: state.board, winningLine, isGameOver, playerScore, aiScore, handleCellClick, restart };
}

export type { CellValue };
