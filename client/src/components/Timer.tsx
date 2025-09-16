import React from 'react';
import { useGameState } from '../lib/stores/useGameState';

export const Timer: React.FC = () => {
  const { timeRemaining, phase } = useGameState();

  if (phase === 'lobby' || phase === 'results' || phase === 'finished') {
    return null;
  }

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const getTimerColor = () => {
    if (timeRemaining <= 10) return 'text-red-500';
    if (timeRemaining <= 30) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg px-4 py-2 border">
        <div className={`text-2xl font-bold ${getTimerColor()}`}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
        <div className="text-sm text-gray-600 text-center">
          {phase === 'drawing' ? 'Drawing Time' : 'Guessing Time'}
        </div>
      </div>
    </div>
  );
};
