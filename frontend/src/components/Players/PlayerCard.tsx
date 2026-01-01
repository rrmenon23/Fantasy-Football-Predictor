import { Player } from '@/types/player';
import { formatPlayerName, getInjuryStatusColor } from '@/utils/formatting';
import { POSITION_COLORS } from '@/utils/constants';

interface PlayerCardProps {
  player: Player;
}

const PlayerCard = ({ player }: PlayerCardProps) => {
  const positionColor = POSITION_COLORS[player.position] || 'bg-gray-100 text-gray-800';
  const injuryColor = getInjuryStatusColor(player.injuryStatus);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Player header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {formatPlayerName(player.firstName, player.lastName, player.fullName)}
          </h3>
          <p className="text-sm text-gray-600">
            {player.team || 'Free Agent'} • #{player.number || 'N/A'}
          </p>
        </div>
        
        <span className={`px-2 py-1 rounded text-xs font-medium ${positionColor}`}>
          {player.position}
        </span>
      </div>

      {/* Player details */}
      <div className="space-y-2">
        {player.injuryStatus && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${injuryColor}`}>
              {player.injuryStatus}
            </span>
          </div>
        )}

        {player.age && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Age:</span>
            <span className="text-sm font-medium text-gray-900">{player.age} years</span>
          </div>
        )}

        {player.college && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">College:</span>
            <span className="text-sm font-medium text-gray-900">{player.college}</span>
          </div>
        )}

        {player.yearsExperience !== null && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Experience:</span>
            <span className="text-sm font-medium text-gray-900">
              {player.yearsExperience} {player.yearsExperience === 1 ? 'year' : 'years'}
            </span>
          </div>
        )}
      </div>

      {/* Action button */}
      <button className="
        w-full mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg
        hover:bg-primary-700 transition-colors text-sm font-medium
      ">
        View Analysis
      </button>
    </div>
  );
};

export default PlayerCard;