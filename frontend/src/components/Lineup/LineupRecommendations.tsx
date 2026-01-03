import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { OPTIMIZE_LINEUP } from '@/graphql/mutations';
import { Loader2, TrendingUp, AlertCircle } from 'lucide-react';
import { getConfidenceColor } from '@/utils/formatting';

interface LineupRecommendationsProps {
  leagueId: string;
  userId: string;
  week: number;
}

const LineupRecommendations = ({ leagueId, userId, week }: LineupRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<any>(null);
  const [optimizeLineup, { loading }] = useMutation(OPTIMIZE_LINEUP);

  const handleOptimize = async () => {
    try {
      const { data } = await optimizeLineup({
        variables: { leagueId, userId, week },
      });

      if (data?.optimizeLineup) {
        setRecommendations(data.optimizeLineup);
      }
    } catch (error) {
      console.error('Error optimizing lineup:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
        <button
          onClick={handleOptimize}
          disabled={loading}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 flex items-center space-x-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <TrendingUp className="w-4 h-4" />
          )}
          <span>{loading ? 'Analyzing...' : 'Optimize Lineup'}</span>
        </button>
      </div>

      {!recommendations && !loading && (
        <div className="text-center py-8 text-gray-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>Click "Optimize Lineup" to get AI-powered recommendations</p>
          <p className="text-sm mt-2">Week {week} analysis</p>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-10 h-10 animate-spin text-primary-600 mb-3" />
          <span className="text-gray-600">Analyzing your roster...</span>
          <span className="text-sm text-gray-500 mt-1">This may take a moment</span>
        </div>
      )}

      {recommendations && !loading && (
        <div className="space-y-4">
          {/* AI Message */}
          <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg p-4 border border-primary-200">
            <div className="prose prose-sm max-w-none">
              <div className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">
                {recommendations.message}
              </div>
            </div>
          </div>

          {/* Recommendations List */}
          {recommendations.recommendations && recommendations.recommendations.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 text-sm">Key Recommendations:</h4>
              {recommendations.recommendations.map((rec: any, index: number) => {
                const confidenceColor = getConfidenceColor(rec.confidence);
                
                return (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {rec.type === 'start' && (
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                      )}
                      {rec.type === 'sit' && (
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {rec.type}
                        </span>
                        {rec.player && (
                          <span className="text-sm text-gray-600">• {rec.player}</span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${confidenceColor}`}>
                          {rec.confidence}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{rec.reason}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LineupRecommendations;