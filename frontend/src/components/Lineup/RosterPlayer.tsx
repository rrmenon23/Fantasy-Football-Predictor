import { useQuery } from '@apollo/client';
import { GET_PLAYER } from '@/graphql/queries';
import { Loader2 } from 'lucide-react';
import { formatPlayerName, getInjuryStatusColor } from '@/utils/formatting';
import { POSITION_COLORS } from '@/utils/constants';

interface RosterPlayerProps {
  playerId: string;
  isStarter: boolean;
}

const RosterPlayer = ({ playerId, isStarter }: RosterPlayerProps) => {
  const { data, loading } = useQuery(GET_PLAYER, {
    variables: { playerId },
  });

  if (loading) {
    return (
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        <span className="text-sm text-gray-500">Loading player...</span>
      </div>
    );
  }

  const player = data?.getPlayer;

  if (!player) {
    return (
      <div className="p-3 bg-gray-50 rounded-lg">
        <span className="text-sm text-gray-500">Player {playerId}</span>
      </div>
    );
  }

  const positionColor = POSITION_COLORS[player.position] || 'bg-gray-100 text-gray-800';
  const injuryColor = getInjuryStatusColor(player.injuryStatus);

  return (
    <div className={`p-3 rounded-lg border ${isStarter ? 'bg-primary-50 border-primary-200' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <span className={`px-2 py-1 rounded text-xs font-medium ${positionColor}`}>
            {player.position}
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 truncate">
              {formatPlayerName(player.firstName, player.lastName, player.fullName)}
            </div>
            <div className="text-sm text-gray-600">
              {player.team || 'FA'}
            </div>
          </div>
        </div>
        {player.injuryStatus && (
          <span className={`px-2 py-1 rounded text-xs font-medium ${injuryColor}`}>
            {player.injuryStatus}
          </span>
        )}
      </div>
    </div>
  );
};

export default RosterPlayer;