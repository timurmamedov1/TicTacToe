import type { CellValue } from '../hooks/useGame';
import './Cell.css';

interface CellProps {
  value: CellValue;
  onClick: () => void;
  isWinning: boolean;
  isPlayable: boolean;
}

// svg marks instead of text bc they scale crisp at any size.
// 25/75 coords in a 100x100 viewBox gives ~30% padding from edges.
function XMark() {
  return (
    <svg className="cell-mark" viewBox="0 0 100 100">
      <line x1="25" y1="25" x2="75" y2="75" />
      <line x1="75" y1="25" x2="25" y2="75" />
    </svg>
  );
}

function OMark() {
  return (
    <svg className="cell-mark" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="25" />
    </svg>
  );
}

// button not div, bc we want native keyboard accessibility for free
export function Cell({ value, onClick, isWinning, isPlayable }: CellProps) {
  return (
    <button
      className={`cell${isWinning ? ' cell-winning' : ''}${isPlayable ? ' cell-playable' : ''}`}
      onClick={onClick}
      disabled={!isPlayable}
      type="button"
    >
      {value === 'X' && <XMark />}
      {value === 'O' && <OMark />}
    </button>
  );
}
