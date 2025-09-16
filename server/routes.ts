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

    socket.on('createGame', (data: { playerName: string; settings: { maxRounds: number } }) => {
      try {
        const gameId = gameManager.createGame(socket.id, data.playerName, data.settings);
        socket.emit('gameCreated', { gameId, hostId: socket.id });
      } catch (error) {
        socket.emit('error', 'Failed to create game');
      }
    });

    socket.on('joinGame', (data: { gameId: string; playerName: string }) => {
      try {
        const playerId = gameManager.joinGame(data.gameId, socket.id, data.playerName);
        if (playerId) {
          socket.emit('playerJoined', { playerId });
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
