import { Player } from '@/types/player';

interface PlayerStatsProps {
  player: Player;
}

const PlayerStats = ({ player }: PlayerStatsProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Player Statistics
      </h3>

      <div className="text-center py-12 text-gray-500">
        <p>Detailed statistics coming soon!</p>
        <p className="text-sm mt-2">
          Player: {player.fullName}
        </p>
      </div>
    </div>
  );
};

export default PlayerStats;
