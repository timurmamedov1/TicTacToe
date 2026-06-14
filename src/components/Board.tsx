import { Cell } from './Cell';
import type { CellValue } from '../hooks/useGame';
import './Board.css';

interface BoardProps {
  board: CellValue[];
  winningLine: number[] | null;
  isGameOver: boolean;
  onCellClick: (index: number) => void;
}

export function Board({ board, winningLine, isGameOver, onCellClick }: BoardProps) {
  return (
    <div className="board">
      {board.map((value, index) => (
        <Cell
          key={index}
          value={value}
          onClick={() => onCellClick(index)}
          isWinning={winningLine?.includes(index) ?? false}
          isPlayable={!isGameOver && value === null}
        />
      ))}
    </div>
  );
}
