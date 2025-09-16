import React from 'react';
import { useGameState } from '../lib/stores/useGameState';
import { Trophy, Medal, Award } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const { players, phase, playerId } = useGameState();

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 0: return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1: return <Medal className="w-6 h-6 text-gray-400" />;
      case 2: return <Award className="w-6 h-6 text-orange-600" />;
      default: return <span className="w-6 h-6 flex items-center justify-center text-gray-600 font-bold">#{position + 1}</span>;
    }
  };

  const getPositionColor = (position: number) => {
    switch (position) {
      case 0: return 'bg-yellow-50 border-yellow-200';
      case 1: return 'bg-gray-50 border-gray-200';
      case 2: return 'bg-orange-50 border-orange-200';
      default: return 'bg-white border-gray-200';
    }
  };

  if (phase === 'lobby') {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Players</h2>
        <div className="space-y-2">
          {players.map((player, index) => (
            <div
              key={player.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                player.id === playerId ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold">{player.name[0].toUpperCase()}</span>
                </div>
                <span className="font-medium text-gray-800">{player.name}</span>
                {player.id === playerId && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">You</span>
                )}
              </div>
              <div className={`px-2 py-1 rounded-full text-xs ${
                player.isReady ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {player.isReady ? 'Ready' : 'Not Ready'}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Leaderboard</h2>
      <div className="space-y-2">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-3 rounded-lg border ${getPositionColor(index)} ${
              player.id === playerId ? 'ring-2 ring-blue-300' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              {getPositionIcon(index)}
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-semibold">{player.name[0].toUpperCase()}</span>
              </div>
              <span className="font-medium text-gray-800">{player.name}</span>
              {player.id === playerId && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">You</span>
              )}
            </div>
            <div className="text-lg font-bold text-gray-700">
              {player.score} point{player.score !== 1 ? 's' : ''}
            </div>
          </div>
        ))}
      </div>
      
      {phase === 'finished' && sortedPlayers.length > 0 && (
        <div className="mt-6 text-center">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg p-4">
            <h3 className="text-xl font-bold mb-2">🎉 Game Over! 🎉</h3>
            <p className="text-lg">
              <strong>{sortedPlayers[0].name}</strong> wins with {sortedPlayers[0].score} points!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
