import React, { useState, useEffect } from 'react';
import { socketManager } from '../lib/socket';
import { useGameState } from '../lib/stores/useGameState';
import { Users, Play, Settings } from 'lucide-react';

export const GameLobby: React.FC = () => {
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [maxRounds, setMaxRounds] = useState(3);
  
  const {
    playerId,
    players,
    isHost,
    phase,
    setPlayerId,
    setPlayerName: setStorePlayerName,
    setIsHost,
    setGameState,
  } = useGameState();

  useEffect(() => {
    const socket = socketManager.connect();

    // Connection confirmation
    socket.on('connectionConfirmed', (data: { socketId: string }) => {
      console.log('✅ Connection confirmed by server:', data.socketId);
    });

    socket.on('playerJoined', (data: { playerId: string; players: any[] }) => {
      console.log('👤 Player joined:', data);
      if (!playerId) {
        setPlayerId(data.playerId);
        setStorePlayerName(playerName);
      }
      setGameState({ players: data.players });
    });

    socket.on('gameCreated', (data: { gameId: string; hostId: string; players: any[] }) => {
      console.log('🎮 Game created response:', data);
      setIsCreating(false);
      
      // Find the current player in the players array to get their ID
      const currentPlayer = data.players?.[0]; // Host is first player
      if (currentPlayer) {
        setPlayerId(currentPlayer.id);
        setStorePlayerName(currentPlayer.name);
      }
      
      setIsHost(true); // Game creator is always host
      setGameState({ 
        id: data.gameId,
        hostId: data.hostId,
        players: data.players || [],
        phase: 'lobby'
      });
    });

    socket.on('gameStarted', (gameState: any) => {
      setGameState(gameState);
    });

    socket.on('playerLeft', (data: { players: any[] }) => {
      setGameState({ players: data.players });
    });

    socket.on('error', (error: string) => {
      console.error('🚨 Socket error:', error);
      alert('Error: ' + error);
      setIsJoining(false);
      setIsCreating(false);
    });

    // Cleanup function

    return () => {
      socket.off('connectionConfirmed');
      socket.off('playerJoined');
      socket.off('gameCreated');
      socket.off('gameStarted');
      socket.off('playerLeft');
      socket.off('error');
      // Cleanup handled by useEffect
    };
  }, [playerId, playerName, setPlayerId, setStorePlayerName, setIsHost, setGameState]);

  const createGame = () => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }

    console.log('🚀 Starting game creation process...');
    console.log('Player name:', playerName, 'Settings:', { maxRounds });
    
    setIsCreating(true);
    
    // Ensure socket is connected
    const socket = socketManager.connect();
    console.log('Socket status:', {
      exists: !!socket,
      connected: socket.connected,
      id: socket.id
    });
    
    if (!socket.connected) {
      console.error('❌ Socket not connected, waiting for connection...');
      socket.on('connect', () => {
        console.log('🔌 Socket connected, retrying game creation');
        socketManager.emit('createGame', { 
          playerName: playerName.trim(),
          settings: { maxRounds }
        });
      });
      return;
    }
    
    socketManager.emit('createGame', { 
      playerName: playerName.trim(),
      settings: { maxRounds }
    });
    console.log('✅ Create game event sent');
    
    // Add timeout to prevent hanging
    setTimeout(() => {
      if (isCreating) {
        console.error('⏰ Game creation timeout');
        setIsCreating(false);
        alert('Game creation timed out. Please try again.');
      }
    }, 10000); // 10 second timeout
  };

  const joinGame = () => {
    if (!playerName.trim() || !gameId.trim()) {
      alert('Please enter your name and game ID');
      return;
    }

    setIsJoining(true);
    socketManager.emit('joinGame', {
      gameId: gameId.trim().toUpperCase(),
      playerName: playerName.trim()
    });
  };

  const startGame = () => {
    if (!players || players.length < 2) {
      alert('Need at least 2 players to start');
      return;
    }

    socketManager.emit('startGame');
  };

  const toggleReady = () => {
    socketManager.emit('toggleReady');
  };

  const leaveGame = () => {
    socketManager.emit('leaveGame');
    setGameState({ 
      id: '',
      players: [],
      phase: 'lobby',
      hostId: '',
      currentRound: 0,
      timeRemaining: 0,
      drawings: [],
      currentWords: {}
    });
    setIsHost(false);
  };

  if (phase !== 'lobby' || !players || players.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Draw & Guess</h1>
            <p className="text-gray-600">A multiplayer drawing game</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                maxLength={20}
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={createGame}
                disabled={isCreating || !playerName.trim()}
                className="flex-1 bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isCreating ? 'Creating...' : 'Create Game'}
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {showSettings && (
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Rounds: {maxRounds}
                </label>
                <input
                  type="range"
                  min="2"
                  max="5"
                  value={maxRounds}
                  onChange={(e) => setMaxRounds(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Game ID
              </label>
              <input
                type="text"
                value={gameId}
                onChange={(e) => setGameId(e.target.value.toUpperCase())}
                placeholder="Enter game ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 uppercase"
                maxLength={6}
              />
            </div>

            <button
              onClick={joinGame}
              disabled={isJoining || !playerName.trim() || !gameId.trim()}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isJoining ? 'Joining...' : 'Join Game'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const readyPlayers = players ? players.filter(p => p.isReady).length : 0;
  const currentPlayer = players ? players.find(p => p.id === playerId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Game Lobby</h1>
            <div className="bg-gray-100 rounded-lg px-4 py-2 inline-block">
              <p className="text-gray-600">Game ID: <strong className="text-2xl font-mono">{gameId || 'LOADING'}</strong></p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Players List */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Users className="w-6 h-6 mr-2" />
                  Players ({players ? players.length : 0}/8)
                </h2>
              </div>

              <div className="space-y-3">
                {players && players.map((player) => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      player.id === playerId 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{player.name[0].toUpperCase()}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">{player.name}</span>
                        {player.id === playerId && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2">You</span>
                        )}
                        {isHost && player.id === playerId && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full ml-2">Host</span>
                        )}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      player.isReady 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {player.isReady ? 'Ready' : 'Not Ready'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Game Controls */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Game Settings</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Players:</span>
                    <span className="font-medium">{players ? players.length : 0}/8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ready Players:</span>
                    <span className="font-medium">{readyPlayers}/{players ? players.length : 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rounds:</span>
                    <span className="font-medium">{maxRounds}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {!isHost && (
                  <button
                    onClick={toggleReady}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                      currentPlayer?.isReady
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {currentPlayer?.isReady ? 'Cancel Ready' : 'Ready to Play'}
                  </button>
                )}

                {isHost && (
                  <button
                    onClick={startGame}
                    disabled={!players || players.length < 2}
                    className="w-full bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Game
                  </button>
                )}

                <button
                  onClick={leaveGame}
                  className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 font-medium"
                >
                  Leave Game
                </button>
              </div>
            </div>
          </div>

          {/* Game Rules */}
          <div className="mt-8 bg-blue-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-blue-800 mb-4">How to Play</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <p className="font-semibold mb-2">1. Drawing Phase (30s)</p>
                <p>Each player gets a secret word and draws it on the canvas.</p>
              </div>
              <div>
                <p className="font-semibold mb-2">2. Passing Drawings</p>
                <p>Drawings rotate to the next player in the circle.</p>
              </div>
              <div>
                <p className="font-semibold mb-2">3. Guessing Phase</p>
                <p>Try to guess what the drawing represents, or continue drawing it.</p>
              </div>
              <div>
                <p className="font-semibold mb-2">4. Scoring</p>
                <p>Earn 1 point for each correct guess. Most points wins!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
