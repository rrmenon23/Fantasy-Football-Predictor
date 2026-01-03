import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { SEND_MESSAGE } from '@/graphql/mutations';
import { Player } from '@/types/player';
import { X, Loader2, TrendingUp, Activity, Users, Trophy, BarChart3 } from 'lucide-react';
import { formatPlayerName, getInjuryStatusColor } from '@/utils/formatting';

interface PlayerAnalysisModalProps {
  player: Player;
  onClose: () => void;
}

const PlayerAnalysisModal = ({ player, onClose }: PlayerAnalysisModalProps) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [sendMessage, { loading }] = useMutation(SEND_MESSAGE);

  // Fetch analysis when modal opens
  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      const message = `Please provide a detailed fantasy football analysis for ${player.fullName || formatPlayerName(player.firstName, player.lastName)}. Include:
1. Current season outlook and performance
2. Strengths and weaknesses
3. Upcoming matchup considerations
4. Fantasy value and recommendation (start/sit, trade value)
5. Rest-of-season outlook`;

      const { data } = await sendMessage({
        variables: { message },
      });

      if (data?.sendMessage?.message) {
        setAnalysis(data.sendMessage.message);
      }
    } catch (error) {
      console.error('Error fetching analysis:', error);
      setAnalysis('Failed to load analysis. Please try again.');
    }
  };

  const injuryColor = getInjuryStatusColor(player.injuryStatus);

  // Mock stats - in a real app, you'd fetch these from an API
  const playerStats = {
    positionRank: player.searchRank || 'N/A',
    percentRostered: 'N/A', // Sleeper API doesn't provide this directly
    fantasyPoints: 'N/A',
    avgPoints: 'N/A',
    recentTrend: player.status === 'Active' ? 'Healthy' : player.status,
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 text-white">
                <h2 className="text-2xl font-bold">
                  {formatPlayerName(player.firstName, player.lastName, player.fullName)}
                </h2>
                <div className="flex items-center space-x-3 mt-2">
                  <span className="px-3 py-1 bg-white bg-opacity-20 rounded-lg text-sm font-medium backdrop-blur-sm">
                    {player.position}
                  </span>
                  <span className="text-primary-100">
                    {player.team || 'Free Agent'} • #{player.number || 'N/A'}
                  </span>
                  {player.injuryStatus && (
                    <span className="px-2 py-1 bg-red-500 rounded text-xs font-medium">
                      {player.injuryStatus}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto p-6 max-h-[calc(90vh-120px)]">
            {/* Key Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Trophy className="w-4 h-4 text-blue-600" />
                  <div className="text-xs text-blue-700 font-medium">Position Rank</div>
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {playerStats.positionRank}
                </div>
                <div className="text-xs text-blue-600 mt-1">{player.position}</div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <div className="text-xs text-green-700 font-medium">% Rostered</div>
                </div>
                <div className="text-2xl font-bold text-green-900">
                  {playerStats.percentRostered}
                </div>
                <div className="text-xs text-green-600 mt-1">In leagues</div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                  <div className="text-xs text-purple-700 font-medium">Total Points</div>
                </div>
                <div className="text-2xl font-bold text-purple-900">
                  {playerStats.fantasyPoints}
                </div>
                <div className="text-xs text-purple-600 mt-1">This season</div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  <div className="text-xs text-orange-700 font-medium">Avg Points</div>
                </div>
                <div className="text-2xl font-bold text-orange-900">
                  {playerStats.avgPoints}
                </div>
                <div className="text-xs text-orange-600 mt-1">Per game</div>
              </div>
            </div>

            {/* Player Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Player Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {player.age && (
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Age</div>
                    <div className="text-sm font-medium text-gray-900">{player.age}</div>
                  </div>
                )}
                
                {player.yearsExperience !== null && (
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Experience</div>
                    <div className="text-sm font-medium text-gray-900">
                      {player.yearsExperience} {player.yearsExperience === 1 ? 'yr' : 'yrs'}
                    </div>
                  </div>
                )}
                
                {player.height && (
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Height</div>
                    <div className="text-sm font-medium text-gray-900">{player.height}</div>
                  </div>
                )}
                
                {player.weight && (
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Weight</div>
                    <div className="text-sm font-medium text-gray-900">{player.weight} lbs</div>
                  </div>
                )}

                {player.college && (
                  <div className="col-span-2">
                    <div className="text-xs text-gray-600 mb-1">College</div>
                    <div className="text-sm font-medium text-gray-900">{player.college}</div>
                  </div>
                )}

                <div>
                  <div className="text-xs text-gray-600 mb-1">Status</div>
                  <div className={`text-sm font-medium inline-block px-2 py-1 rounded ${injuryColor}`}>
                    {player.status}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Analysis Section */}
            <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg p-6 border border-primary-200">
              <div className="flex items-center space-x-2 mb-4">
                <Activity className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">AI Fantasy Analysis</h3>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-10 h-10 animate-spin text-primary-600 mb-3" />
                  <span className="text-gray-600">Analyzing player performance...</span>
                  <span className="text-sm text-gray-500 mt-1">This may take a moment</span>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {analysis || 'No analysis available yet.'}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={fetchAnalysis}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
              >
                <TrendingUp className="w-5 h-5" />
                <span>{loading ? 'Analyzing...' : 'Refresh Analysis'}</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerAnalysisModal;