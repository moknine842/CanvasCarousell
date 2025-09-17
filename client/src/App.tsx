import React, { useEffect } from 'react';
import { GameLobby } from './components/GameLobby';
import { DrawingCanvas } from './components/DrawingCanvas';
import { GuessingPhase } from './components/GuessingPhase';
import { Leaderboard } from './components/Leaderboard';
import { Timer } from './components/Timer';
import { useGameState } from './lib/stores/useGameState';
import { socketManager } from './lib/socket';
import '@fontsource/inter';

function App() {
  const { 
    phase, 
    playerId, 
    currentWords, 
    drawings, 
    setGameState, 
    timeRemaining 
  } = useGameState();

  useEffect(() => {
    const socket = socketManager.connect();

    // Game state updates
    socket.on('gameStateUpdate', (gameState: any) => {
      setGameState(gameState);
    });

    socket.on('timerUpdate', (time: number) => {
      setGameState({ timeRemaining: time });
    });

    socket.on('roundStarted', (gameState: any) => {
      setGameState(gameState);
    });

    socket.on('roundEnded', (gameState: any) => {
      setGameState(gameState);
    });

    socket.on('gameEnded', (gameState: any) => {
      setGameState(gameState);
    });

    return () => {
      socket.off('gameStateUpdate');
      socket.off('timerUpdate');
      socket.off('roundStarted');
      socket.off('roundEnded');
      socket.off('gameEnded');
    };
  }, [setGameState]);

  const handleDrawingComplete = (imageData: string) => {
    if (phase === 'drawing' && playerId) {
      socketManager.emit('submitDrawing', { imageData });
    }
  };

  const renderGameContent = () => {
    switch (phase) {
      case 'lobby':
        return <GameLobby />;

      case 'drawing':
        const playerWord = playerId ? currentWords[playerId] : undefined;
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500">
            <div className="flex flex-col h-screen">
              {/* Mobile-optimized header */}
              <div className="text-center py-2 px-4 md:py-6">
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-1 md:mb-2">Drawing Time!</h1>
                <p className="text-sm md:text-base text-white/80">Draw your word in {timeRemaining} seconds</p>
              </div>
              
              <div className="flex-1 flex flex-col md:flex-row md:max-w-4xl md:mx-auto md:gap-6 md:px-4">
                {/* Canvas area - takes most space on mobile */}
                <div className="flex-1 px-2 md:px-0 md:flex-[3]">
                  <DrawingCanvas 
                    word={playerWord}
                    onDrawingComplete={handleDrawingComplete}
                  />
                </div>
                {/* Leaderboard - hidden on mobile, shown on desktop */}
                <div className="hidden md:block md:flex-[1]">
                  <Leaderboard />
                </div>
              </div>
            </div>
          </div>
        );

      case 'guessing':
        // Find the drawing this player should guess
        const drawingToGuess = drawings.find(d => 
          d.playerId !== playerId && !d.completed && d.guessedBy !== playerId
        );

        if (!drawingToGuess) {
          return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 p-4 flex items-center justify-center">
              <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Waiting for next round...</h2>
                <p className="text-gray-600">All drawings have been processed!</p>
              </div>
            </div>
          );
        }

        return (
          <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 p-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <GuessingPhase drawing={drawingToGuess} />
                </div>
                <div className="lg:col-span-1">
                  <Leaderboard />
                </div>
              </div>
            </div>
          </div>
        );

      case 'results':
      case 'finished':
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-500 p-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {phase === 'finished' ? 'Final Results!' : 'Round Complete!'}
                </h1>
                {phase === 'results' && (
                  <p className="text-white/80">Get ready for the next round...</p>
                )}
              </div>
              
              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <Leaderboard />
                </div>
                <div className="bg-white rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Round Summary</h3>
                  <div className="space-y-3">
                    {drawings.map(drawing => (
                      <div key={drawing.playerId} className="bg-gray-50 rounded-lg p-3">
                        <p className="font-medium text-gray-800">
                          Word: <strong>{drawing.originalWord}</strong>
                        </p>
                        {drawing.guessedBy ? (
                          <p className="text-green-600 text-sm">
                            ✓ Correctly guessed
                          </p>
                        ) : (
                          <p className="text-red-600 text-sm">
                            ✗ Not guessed correctly
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h2>
              <p className="text-gray-600">Setting up the game...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen font-sans">
      <Timer />
      {renderGameContent()}
    </div>
  );
}

export default App;
