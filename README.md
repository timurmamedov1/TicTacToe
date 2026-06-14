# TicTacToe

A tictactoe game where you play against an unbeatable AI. Built as part of a submission for a co-op application.

[LIVE_URL]

## Stack

- React + TypeScript
- Vite
- No UI libraries or frameworks, all CSS

## Run locally

```
npm install
npm run dev
```

## How the AI works

The AI uses an algorithm called minimax. Before making a move, it simulates every possible game from that board state. It assumes the opponent always plays perfectly, and picks the move that leads to the best outcome for itself. Because tic-tac-toe is a small enough game, it can check every possibility and never makes a mistake.

On top of that, alpha-beta pruning lets it skip branches of the game tree that can't change the outcome. For example, if it already found a move that scores well and starts evaluating another move that's clearly worse, it stops early instead of wasting time exploring the rest. On a 3x3 board the speedup is negligible, but the optimization is there essentially.