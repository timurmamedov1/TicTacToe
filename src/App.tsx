import { useGame } from './hooks/useGame';
import { Board } from './components/Board';
import { GameStatus } from './components/GameStatus';

export default function App() {
  const { board, winningLine, isGameOver, playerScore, aiScore, handleCellClick, restart } = useGame();

  return (
    <main className="app">
      <GameStatus
        isGameOver={isGameOver}
        playerScore={playerScore}
        aiScore={aiScore}
        onRestart={restart}
      />
      <Board
        board={board}
        winningLine={winningLine}
        isGameOver={isGameOver}
        onCellClick={handleCellClick}
      />
    </main>
  );
}
