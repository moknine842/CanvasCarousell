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

  createGame(hostSocketId: string, playerName: string, settings: { maxRounds: number }): string {
    console.log('Creating game for player:', playerName, 'with settings:', settings);
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
      totalRounds: settings.maxRounds,
      timeRemaining: 0,
      drawings: new Map(),
      currentWords: new Map(),
      hostId
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

    this.broadcastToGame(gameId, 'playerJoined', {
      playerId,
      players: Array.from(game.players.values())
    });

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

  private startDrawingRound(game: Game): void {
    game.phase = 'drawing';
    game.currentRound++;
    game.timeRemaining = 30;
    game.drawings.clear();
    game.currentWords.clear();

    // Assign random words to each player
    const playerIds = Array.from(game.players.keys());
    const words = getRandomWords(playerIds.length);
    
    playerIds.forEach((playerId, index) => {
      game.currentWords.set(playerId, words[index]);
      game.drawings.set(playerId, {
        playerId,
        originalWord: words[index],
        imageData: '',
        completed: false
      });
    });

    this.broadcastGameState(game);
    this.startTimer(game, () => this.endDrawingRound(game));
  }

  private endDrawingRound(game: Game): void {
    this.clearTimer(game);
    game.phase = 'guessing';
    game.timeRemaining = 30; // Changed from 60 to 30 seconds
    game.guessSubmissions = new Set(); // Initialize guess tracking

    // Rotate drawings between players
    this.rotateDrawings(game);

    this.broadcastGameState(game);
    this.startTimer(game, () => this.endGuessingRound(game));
  }

  private rotateDrawings(game: Game): void {
    const playerIds = Array.from(game.players.keys());
    const drawings = Array.from(game.drawings.values());
    
    // Create rotation mapping (each player gets next player's drawing)
    for (let i = 0; i < playerIds.length; i++) {
      const currentPlayerId = playerIds[i];
      const nextIndex = (i + 1) % playerIds.length;
      const drawingToReceive = drawings.find(d => d.playerId === playerIds[nextIndex]);
      
      if (drawingToReceive) {
        // This is a simplified rotation - in a full implementation,
        // you'd want to track which drawing each player is currently working on
        console.log(`Player ${currentPlayerId} receives drawing from ${drawingToReceive.playerId}`);
      }
    }
  }

  private endGuessingRound(game: Game): void {
    // Guard against race conditions (timer + guess submission)
    if (game.phase !== 'guessing') return;
    
    this.clearTimer(game);
    
    // Check if we have more rounds
    if (game.currentRound < game.totalRounds) {
      game.phase = 'results';
      game.timeRemaining = 5;
      
      this.broadcastGameState(game);
      this.startTimer(game, () => this.startDrawingRound(game));
    } else {
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
      
      // Award point
      const player = game.players.get(playerId);
      if (player) {
        player.score++;
      }
    }

    this.broadcastGameState(game);

    // Check if all players have submitted guesses OR all drawings are completed
    const allPlayersSubmitted = game.guessSubmissions.size >= game.players.size;
    const allCompleted = Array.from(game.drawings.values()).every(d => d.completed);
    
    if (allPlayersSubmitted || allCompleted) {
      console.log(`Ending guessing round early: allPlayersSubmitted=${allPlayersSubmitted}, allCompleted=${allCompleted}`);
      this.endGuessingRound(game);
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
      hostId: game.hostId
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
