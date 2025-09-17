import React, { useState } from 'react';
import { DrawingCanvas } from './DrawingCanvas';
import { Leaderboard } from './Leaderboard';
import { socketManager } from '../lib/socket';
import { useGameState } from '../lib/stores/useGameState';
// import { useTranslation } from '../lib/i18n/context'; // Temporarily disabled
import { useIsMobile } from '../hooks/use-is-mobile';
import { DrawingData } from '../types/game';
import { Send } from 'lucide-react';

interface GuessingPhaseProps {
  drawing: DrawingData;
}

export const GuessingPhase: React.FC<GuessingPhaseProps> = ({ drawing }) => {
  const [guess, setGuess] = useState('');
  const [hasGuessed, setHasGuessed] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const { playerId } = useGameState();
  
  // Temporary fallback function
  const t = (key: string) => key;
  
  const isMobile = useIsMobile();

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim() || hasGuessed) return;

    socketManager.emit('submitGuess', {
      drawingId: drawing.playerId,
      guess: guess.trim(),
    });

    setHasGuessed(true);
  };

  const handleContinueDrawing = () => {
    setShowAnswer(true);
    // Let the player see the answer for a moment before continuing
    setTimeout(() => {
      socketManager.emit('continueDrawing', {
        drawingId: drawing.playerId,
      });
    }, 2000);
  };

  if (drawing.completed || drawing.guessedBy === playerId) {
    return (
      <div className={`${isMobile ? 'space-y-4' : 'space-y-6'}`}>
        {/* Success message */}
        <div className={`bg-green-100 rounded-lg ${isMobile ? 'p-3' : 'p-4'} text-center`}>
          <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-green-800 mb-2`}>
            {drawing.guessedBy === playerId ? 'Correct!' : 'Already Guessed'}
          </h2>
          <p className={`${isMobile ? 'text-base' : 'text-lg'} text-green-700`}>
            The word was: <strong>{drawing.originalWord}</strong>
          </p>
          {drawing.guessedBy === playerId && (
            <p className="text-sm text-green-600 mt-2">+1 point!</p>
          )}
        </div>
        
        {/* Mobile layout: stacked, Desktop layout: side by side with leaderboard */}
        {isMobile ? (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-3">
              <DrawingCanvas 
                initialImage={drawing.imageData}
                readonly={true}
              />
            </div>
            
            <div className="text-center bg-white rounded-lg p-4">
              <p className="text-gray-600 font-medium mb-3">Waiting for other players...</p>
              <Leaderboard />
            </div>
          </div>
        ) : (
          <>
            <DrawingCanvas 
              initialImage={drawing.imageData}
              readonly={true}
            />
            
            <div className="text-center">
              <p className="text-gray-600">Waiting for other players...</p>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="bg-blue-100 rounded-lg p-4 text-center">
        <h2 className="text-2xl font-bold text-blue-800 mb-2">Guess the Drawing!</h2>
        <p className="text-sm text-blue-600">
          Look at this drawing and try to guess what word it represents
        </p>
      </div>

      <DrawingCanvas 
        initialImage={drawing.imageData}
        readonly={true}
      />

      {!hasGuessed ? (
        <form onSubmit={handleGuess} className="flex flex-col items-center space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter your guess..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Guess</span>
            </button>
          </div>
          
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleContinueDrawing}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Continue Drawing Instead
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center space-y-4">
          <div className={`bg-yellow-100 rounded-lg ${isMobile ? 'p-3' : 'p-4'}`}>
            <p className={`text-yellow-800 font-medium ${isMobile ? 'text-sm' : ''}`}>Guess submitted!</p>
            <p className="text-sm text-yellow-600">Waiting for results...</p>
          </div>
          
          {showAnswer && (
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-gray-800">
                The word was: <strong>{drawing.originalWord}</strong>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Get ready to continue drawing!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
