import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketServer } from "socket.io";
import { GameManager } from "./gameManager";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Setup Socket.IO
  const io = new SocketServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    transports: ['websocket', 'polling']
  });

  const gameManager = new GameManager(io);

  io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);
    
    // Test event to verify socket communication
    socket.emit('connectionConfirmed', { socketId: socket.id });

    socket.on('createGame', (data: { playerName: string; settings: { maxRounds: number; drawingTime: number; guessingTime: number } }) => {
      console.log('📋 Create game request received:', {
        socketId: socket.id,
        playerName: data.playerName,
        settings: data.settings
      });
      
      try {
        const result = gameManager.createGame(socket.id, data.playerName, data.settings);
        console.log('✅ Game created successfully:', result);
        
        // Get the player ID from the game manager to send proper response
        const gameState = gameManager.getGameById(result);
        if (gameState) {
          const player = Array.from(gameState.players.values())[0];
          socket.emit('gameCreated', { 
            gameId: result, 
            hostId: player.id,
            players: Array.from(gameState.players.values()),
            settings: gameState.settings
          });
        }
      } catch (error) {
        console.error('❌ Error creating game:', error);
        socket.emit('error', 'Failed to create game: ' + (error as Error).message);
      }
    });

    socket.on('joinGame', (data: { gameId: string; playerName: string }) => {
      try {
        const playerId = gameManager.joinGame(data.gameId, socket.id, data.playerName);
        if (playerId) {
          // Get the updated game state to include settings
          const gameState = gameManager.getGameById(data.gameId);
          if (gameState) {
            socket.emit('playerJoined', { 
              playerId,
              gameId: data.gameId,
              players: Array.from(gameState.players.values()),
              settings: gameState.settings,
              hostId: gameState.hostId
            });
          } else {
            socket.emit('playerJoined', { playerId });
          }
        } else {
          socket.emit('error', 'Game not found or full');
        }
      } catch (error) {
        socket.emit('error', 'Failed to join game');
      }
    });

    socket.on('leaveGame', () => {
      gameManager.leaveGame(socket.id);
    });

    socket.on('toggleReady', () => {
      gameManager.toggleReady(socket.id);
    });

    socket.on('startGame', () => {
      gameManager.startGame(socket.id);
    });

    socket.on('submitDrawing', (data: { imageData: string }) => {
      gameManager.submitDrawing(socket.id, data.imageData);
    });

    socket.on('submitGuess', (data: { drawingId: string; guess: string }) => {
      gameManager.submitGuess(socket.id, data.drawingId, data.guess);
    });

    socket.on('continueDrawing', (data: { drawingId: string }) => {
      gameManager.continueDrawing(socket.id, data.drawingId);
    });

    socket.on('disconnect', () => {
      console.log('Player disconnected:', socket.id);
      gameManager.handleDisconnect(socket.id);
    });
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  return httpServer;
}
