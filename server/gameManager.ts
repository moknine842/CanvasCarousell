import { Server as SocketServer } from 'socket.io';
import { getRandomWords } from './wordList';

interface Player {
  id: string;
  name: string;
  score: number;
  isReady: boolean;
  socketId: string;
}

interface DrawingData {
  playerId: string;
  originalWord: string;
  imageData: string;
  currentGuess?: string;
  guessedBy?: string;
  completed: boolean;
}

interface Game {
  id: string;
  players: Map<string, Player>;
  phase: 'lobby' | 'drawing' | 'guessing' | 'results' | 'finished';
  currentRound: number;
  totalRounds: number;
  timeRemaining: number;
  drawings: Map<string, DrawingData>;
  currentWords: Map<string, string>;
  hostId: string;
  timer?: NodeJS.Timeout;
  guessSubmissions?: Set<string>; // Track which players have submitted guesses
  usedWords: Map<string, Set<string>>; // Track words used by each player to prevent repeats
  currentDrawingAssignments?: Map<string, DrawingData>; // Track which drawing each player is guessing
  settings: {
    maxRounds: number;
    drawingTime: number;
    guessingTime: number;
  };
}

export class GameManager {
  private games: Map<string, Game> = new Map();
  private playerToGame: Map<string, string> = new Map();
  private io: SocketServer;

  constructor(io: SocketServer) {
    this.io = io;
  }

  generateGameId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  createGame(hostSocketId: string, playerName: string, settings: { maxRounds: number; drawingTime?: number; guessingTime?: number }): string {
    // Validate and set defaults for settings
    const validatedSettings = {
      maxRounds: Math.max(2, Math.min(5, settings.maxRounds || 3)),
      drawingTime: Math.max(15, Math.min(120, settings.drawingTime || 30)),
      guessingTime: Math.max(15, Math.min(90, settings.guessingTime || 30))
    };
    
    console.log('Creating game for player:', playerName, 'with settings:', validatedSettings);
    const gameId = this.generateGameId();
    const playerId = this.generatePlayerId();
    const hostId = playerId;

    const player: Player = {
      id: playerId,
      name: playerName,
      score: 0,
      isReady: false,
      socketId: hostSocketId
    };

    const game: Game = {
      id: gameId,
      players: new Map([[playerId, player]]),
      phase: 'lobby',
      currentRound: 0,
      totalRounds: validatedSettings.maxRounds,
      timeRemaining: 0,
      drawings: new Map(),
      currentWords: new Map(),
      hostId,
      usedWords: new Map(),
      settings: validatedSettings
    };

    this.games.set(gameId, game);
    this.playerToGame.set(playerId, gameId);
    
    console.log('✅ Game created successfully:', {
      gameId,
      playerId,
      playerName,
      totalRounds: settings.maxRounds
    });

    return gameId;
  }

  joinGame(gameId: string, socketId: string, playerName: string): string | null {
    const game = this.games.get(gameId);
    if (!game) return null;

    if (game.players.size >= 8) return null;
    if (game.phase !== 'lobby') return null;

    const playerId = this.generatePlayerId();
    const player: Player = {
      id: playerId,
      name: playerName,
      score: 0,
      isReady: false,
      socketId
    };

    game.players.set(playerId, player);
    this.playerToGame.set(playerId, gameId);

    // Broadcast full game state to ensure all players get settings
    this.broadcastGameState(game);

    return playerId;
  }

  leaveGame(socketId: string): void {
    const playerId = this.getPlayerIdBySocket(socketId);
    if (!playerId) return;

    const gameId = this.playerToGame.get(playerId);
    if (!gameId) return;

    const game = this.games.get(gameId);
    if (!game) return;

    game.players.delete(playerId);
    this.playerToGame.delete(playerId);

    if (game.players.size === 0) {
      this.cleanupGame(gameId);
      return;
    }

    // If host left, assign new host
    if (game.hostId === playerId) {
      const newHost = Array.from(game.players.values())[0];
      game.hostId = newHost.id;
    }

    this.broadcastToGame(gameId, 'playerLeft', {
      players: Array.from(game.players.values())
    });
  }

  toggleReady(socketId: string): void {
    const playerId = this.getPlayerIdBySocket(socketId);
    if (!playerId) return;

    const gameId = this.playerToGame.get(playerId);
    if (!gameId) return;

    const game = this.games.get(gameId);
    if (!game || game.phase !== 'lobby') return;

    const player = game.players.get(playerId);
    if (!player) return;

    player.isReady = !player.isReady;

    this.broadcastToGame(gameId, 'playerJoined', {
      playerId,
      players: Array.from(game.players.values())
    });
  }

  startGame(socketId: string): void {
    const playerId = this.getPlayerIdBySocket(socketId);
    if (!playerId) return;

    const gameId = this.playerToGame.get(playerId);
    if (!gameId) return;

    const game = this.games.get(gameId);
    if (!game || game.hostId !== playerId || game.phase !== 'lobby') return;

    if (game.players.size < 2) return;

    this.startDrawingRound(game);
  }

  private assignWordsToPlayers(game: Game): void {
    const playerIds = Array.from(game.players.keys());
    const assignedThisRound = new Set<string>();

    for (const playerId of playerIds) {
      const playerName = game.players.get(playerId)?.name || playerId;
      
      // Get the set of words this player has already used
      const playerUsedWords = game.usedWords.get(playerId) || new Set();
      
      // Import the full word list
      const { wordList } = require('./wordList');
      
      // Create available word list: full word list minus player's used words minus already assigned this round
      let availableWords = wordList.filter((word: string) => 
        !playerUsedWords.has(word) && !assignedThisRound.has(word)
      );
      
      // If no words available for this player (they've used all unique words), fallback to words not assigned this round
      if (availableWords.length === 0) {
        console.warn(`⚠️ Player ${playerName} has used all available unique words, falling back to round-unique words`);
        availableWords = wordList.filter((word: string) => !assignedThisRound.has(word));
      }
      
      // Final fallback - should only happen if we have more players than words (impossible with our word list)
      if (availableWords.length === 0) {
        console.error(`🚨 No available words for player ${playerName}, using random word (this should never happen)`);
        availableWords = wordList;
      }
      
      // Pick a random word from available options
      const randomIndex = Math.floor(Math.random() * availableWords.length);
      const assignedWord = availableWords[randomIndex];
      
      // Track this word as assigned this round and used by this player
      assignedThisRound.add(assignedWord);
      
      if (!game.usedWords.has(playerId)) {
        game.usedWords.set(playerId, new Set());
      }
      game.usedWords.get(playerId)!.add(assignedWord);
      
      // Assign the word and create drawing data
      game.currentWords.set(playerId, assignedWord);
      game.drawings.set(playerId, {
        playerId,
        originalWord: assignedWord,
        imageData: '',
        completed: false
      });
      
      console.log(`🎯 Assigned "${assignedWord}" to ${playerName} (${availableWords.length} options available)`);
    }
  }

  private startDrawingRound(game: Game): void {
    game.phase = 'drawing';
    game.currentRound++;
    game.timeRemaining = game.settings.drawingTime;
    game.drawings.clear();
    game.currentWords.clear();

    // Use improved word assignment logic
    this.assignWordsToPlayers(game);

    this.broadcastGameState(game);
    this.startTimer(game, () => this.endDrawingRound(game));
  }

  private endDrawingRound(game: Game): void {
    this.clearTimer(game);
    game.phase = 'guessing';
    game.timeRemaining = game.settings.guessingTime;
    game.guessSubmissions = new Set(); // Initialize guess tracking

    // Rotate drawings between players
    this.rotateDrawings(game);

    this.broadcastGameState(game);
    this.startTimer(game, () => this.endGuessingRound(game));
  }

  private rotateDrawings(game: Game): void {
    const playerIds = Array.from(game.players.keys());
    const drawings = Array.from(game.drawings.values());
    
    if (playerIds.length < 2) {
      console.warn('Cannot rotate drawings with less than 2 players');
      return;
    }
    
    // Create a new map to store the rotated drawing assignments
    const rotatedDrawings = new Map<string, DrawingData>();
    
    // Each player receives the next player's drawing (circular rotation)
    for (let i = 0; i < playerIds.length; i++) {
      const currentPlayerId = playerIds[i];
      const nextPlayerIndex = (i + 1) % playerIds.length;
      const nextPlayerId = playerIds[nextPlayerIndex];
      
      // Find the drawing created by the next player
      const drawingToReceive = drawings.find(d => d.playerId === nextPlayerId);
      
      if (drawingToReceive && !drawingToReceive.completed) {
        // Assign this drawing to the current player for guessing
        // We keep the original drawing data but mark who's guessing it
        const rotatedDrawing: DrawingData = {
          ...drawingToReceive,
          currentGuess: '', // Reset any previous guess
          guessedBy: undefined, // Reset guessed by
          completed: false // Reset completion status
        };
        
        rotatedDrawings.set(currentPlayerId, rotatedDrawing);
        console.log(`🔄 Player ${game.players.get(currentPlayerId)?.name} will guess drawing by ${game.players.get(nextPlayerId)?.name} (word: ${drawingToReceive.originalWord})`);
      }
    }
    
    // Update the game state with rotated drawing assignments
    // We'll use a new field to track which drawing each player is guessing
    if (!game.currentDrawingAssignments) {
      (game as any).currentDrawingAssignments = new Map();
    }
    (game as any).currentDrawingAssignments = rotatedDrawings;
  }

  private endGuessingRound(game: Game): void {
    // Guard against race conditions (timer + guess submission)
    if (game.phase !== 'guessing') {
      console.log(`⚠️ Attempted to end guessing round but game phase is ${game.phase}`);
      return;
    }
    
    console.log(`🔚 Ending guessing round for game ${game.id}, round ${game.currentRound}/${game.totalRounds}`);
    this.clearTimer(game);
    
    // Clear drawing assignments for next round
    if ((game as any).currentDrawingAssignments) {
      (game as any).currentDrawingAssignments.clear();
    }
    
    // Check if we have more rounds
    if (game.currentRound < game.totalRounds) {
      game.phase = 'results';
      game.timeRemaining = 3; // Shorter results display time
      
      console.log(`📊 Showing results for 3 seconds before round ${game.currentRound + 1}`);
      this.broadcastGameState(game);
      this.startTimer(game, () => {
        console.log(`▶️ Starting next drawing round: ${game.currentRound + 1}/${game.totalRounds}`);
        this.startDrawingRound(game);
      });
    } else {
      console.log(`🏁 Game ${game.id} finished after ${game.currentRound} rounds`);
      this.endGame(game);
    }
  }

  private endGame(game: Game): void {
    game.phase = 'finished';
    game.timeRemaining = 0;
    this.clearTimer(game);
    this.broadcastGameState(game);
  }

  submitDrawing(socketId: string, imageData: string): void {
    const playerId = this.getPlayerIdBySocket(socketId);
    if (!playerId) return;

    const gameId = this.playerToGame.get(playerId);
    if (!gameId) return;

    const game = this.games.get(gameId);
    if (!game || game.phase !== 'drawing') return;

    const drawing = game.drawings.get(playerId);
    if (!drawing) return;

    drawing.imageData = imageData;
    
    // Check if all players have submitted
    const allSubmitted = Array.from(game.drawings.values()).every(d => d.imageData);
    if (allSubmitted) {
      this.endDrawingRound(game);
    }
  }

  submitGuess(socketId: string, drawingId: string, guess: string): void {
    const playerId = this.getPlayerIdBySocket(socketId);
    if (!playerId) return;

    const gameId = this.playerToGame.get(playerId);
    if (!gameId) return;

    const game = this.games.get(gameId);
    if (!game || game.phase !== 'guessing') return;

    const drawing = game.drawings.get(drawingId);
    if (!drawing || drawing.completed) return;

    // Track that this player has submitted a guess
    if (!game.guessSubmissions) {
      game.guessSubmissions = new Set();
    }
    game.guessSubmissions.add(playerId);

    const isCorrect = guess.toLowerCase().trim() === drawing.originalWord.toLowerCase();
    
    if (isCorrect) {
      drawing.completed = true;
      drawing.guessedBy = playerId;
      
      // Award point to the guesser
      const guesser = game.players.get(playerId);
      if (guesser) {
        guesser.score++;
      }
      
      console.log(`✅ ${game.players.get(playerId)?.name} correctly guessed "${drawing.originalWord}"`);
    }

    this.broadcastGameState(game);

    // Add race condition protection - only check for early termination if still in guessing phase
    if (game.phase === 'guessing') {
      // Check if all players have submitted guesses OR all drawings are completed
      const allPlayersSubmitted = game.guessSubmissions.size >= game.players.size;
      const allCompleted = Array.from(game.drawings.values()).every(d => d.completed);
      
      if (allPlayersSubmitted || allCompleted) {
        console.log(`🏃‍♀️ Ending guessing round early: allPlayersSubmitted=${allPlayersSubmitted}, allCompleted=${allCompleted}`);
        // Add small delay to prevent race conditions with timer
        setTimeout(() => {
          if (game.phase === 'guessing') { // Double-check phase hasn't changed
            this.endGuessingRound(game);
          }
        }, 100);
      }
    }
  }

  continueDrawing(socketId: string, drawingId: string): void {
    const playerId = this.getPlayerIdBySocket(socketId);
    if (!playerId) return;

    const gameId = this.playerToGame.get(playerId);
    if (!gameId) return;

    const game = this.games.get(gameId);
    if (!game || game.phase !== 'guessing') return;

    // In a full implementation, this would let the player continue drawing
    // For now, we'll just mark it as completed
    const drawing = game.drawings.get(drawingId);
    if (drawing) {
      drawing.completed = true;
      this.broadcastGameState(game);
    }
  }

  private startTimer(game: Game, onComplete: () => void): void {
    this.clearTimer(game);
    
    game.timer = setInterval(() => {
      game.timeRemaining--;
      this.broadcastToGame(game.id, 'timerUpdate', game.timeRemaining);
      
      if (game.timeRemaining <= 0) {
        onComplete();
      }
    }, 1000);
  }

  private clearTimer(game: Game): void {
    if (game.timer) {
      clearInterval(game.timer);
      game.timer = undefined;
    }
  }

  private broadcastGameState(game: Game): void {
    const gameState = {
      id: game.id,
      players: Array.from(game.players.values()),
      phase: game.phase,
      currentRound: game.currentRound,
      totalRounds: game.totalRounds,
      timeRemaining: game.timeRemaining,
      drawings: Array.from(game.drawings.values()),
      currentWords: Object.fromEntries(game.currentWords),
      currentDrawingAssignments: (game as any).currentDrawingAssignments ? 
        Object.fromEntries((game as any).currentDrawingAssignments) : {},
      hostId: game.hostId,
      settings: game.settings
    };

    this.broadcastToGame(game.id, 'gameStateUpdate', gameState);
  }

  private broadcastToGame(gameId: string, event: string, data: any): void {
    const game = this.games.get(gameId);
    if (!game) return;

    Array.from(game.players.values()).forEach(player => {
      this.io.to(player.socketId).emit(event, data);
    });
  }

  private cleanupGame(gameId: string): void {
    const game = this.games.get(gameId);
    if (!game) return;

    this.clearTimer(game);
    
    Array.from(game.players.keys()).forEach(playerId => {
      this.playerToGame.delete(playerId);
    });

    this.games.delete(gameId);
  }

  private getPlayerIdBySocket(socketId: string): string | null {
    for (const [playerId, gameId] of Array.from(this.playerToGame.entries())) {
      const game = this.games.get(gameId);
      if (game) {
        const player = game.players.get(playerId);
        if (player && player.socketId === socketId) {
          return playerId;
        }
      }
    }
    return null;
  }

  private generatePlayerId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  getGameById(gameId: string): Game | undefined {
    return this.games.get(gameId);
  }

  handleDisconnect(socketId: string): void {
    this.leaveGame(socketId);
  }
}
