export interface Player {
  id: string;
  name: string;
  score: number;
  isReady: boolean;
}

export interface DrawingData {
  playerId: string;
  originalWord: string;
  imageData: string; // base64 canvas data
  currentGuess?: string;
  guessedBy?: string;
  completed: boolean;
}

export interface GameState {
  id: string;
  players: Player[];
  phase: 'lobby' | 'drawing' | 'guessing' | 'results' | 'finished';
  currentRound: number;
  totalRounds: number;
  timeRemaining: number;
  drawings: DrawingData[];
  currentWords: { [playerId: string]: string };
  hostId: string;
}

export interface DrawingTools {
  color: string;
  brushSize: number;
  tool: 'brush' | 'eraser';
}
