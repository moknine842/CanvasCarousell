import { create } from 'zustand';
import { GameState, Player } from '../../types/game';

interface GameStore extends GameState {
  // Local state
  playerId: string | null;
  playerName: string;
  isHost: boolean;
  
  // Actions
  setGameState: (state: Partial<GameState>) => void;
  setPlayerId: (id: string) => void;
  setPlayerName: (name: string) => void;
  setIsHost: (isHost: boolean) => void;
  reset: () => void;
}

const initialState: GameState = {
  id: '',
  players: [],
  phase: 'lobby',
  currentRound: 0,
  totalRounds: 3,
  timeRemaining: 0,
  drawings: [],
  currentWords: {},
  hostId: '',
};

export const useGameState = create<GameStore>((set, get) => ({
  ...initialState,
  playerId: null,
  playerName: '',
  isHost: false,

  setGameState: (newState) => set((state) => ({ ...state, ...newState })),
  
  setPlayerId: (id) => set({ playerId: id }),
  
  setPlayerName: (name) => set({ playerName: name }),
  
  setIsHost: (isHost) => set({ isHost }),
  
  reset: () => set({
    ...initialState,
    playerId: get().playerId,
    playerName: get().playerName,
    isHost: false,
  }),
}));
