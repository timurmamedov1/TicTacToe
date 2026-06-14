import './GameStatus.css';

interface GameStatusProps {
  isGameOver: boolean;
  playerScore: number;
  aiScore: number;
  onRestart: () => void;
}

export function GameStatus({ isGameOver, playerScore, aiScore, onRestart }: GameStatusProps) {
  return (
    <div className="game-status">
      <p className="status-text">{playerScore} - {aiScore}</p>
      <button
        className="restart-btn"
        onClick={onRestart}
        type="button"
        style={{ visibility: isGameOver ? 'visible' : 'hidden' }}
      >
        Play again
      </button>
    </div>
  );
}
