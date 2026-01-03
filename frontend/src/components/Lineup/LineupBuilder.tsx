import { useLineup } from '@/hooks/useLineup';
import LeagueConnector from './LeagueConnector';
import RosterPlayer from './RosterPlayer';
import LineupRecommendations from './LineupRecommendations';
import { Users, Loader2 } from 'lucide-react';

const LineupBuilder = () => {
  const {
    lineupState,
    leagues,
    rosters,
    currentWeek,
    connectUser,
    selectLeague,
    selectRoster,
    loading,
  } = useLineup();

  const hasLineup = lineupState.starters.length > 0 || lineupState.bench.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Lineup Builder</h2>
        <p className="text-gray-600 mt-1">
          Connect your Sleeper account to optimize your lineup with AI
        </p>
      </div>

      {/* League Connector */}
      {!lineupState.leagueId && (
        <LeagueConnector
          onConnect={connectUser}
          onSelectLeague={selectLeague}
          leagues={leagues}
          loading={loading}
        />
      )}

      {/* Roster Selection */}
      {lineupState.leagueId && !lineupState.rosterId && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Select Your Team in "{lineupState.leagueName}"
          </h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : (
            <div className="grid gap-3">
              {rosters.map((roster: any) => (
                <button
                  key={roster.id}
                  onClick={() => selectRoster(roster.id)}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">
                        Team {roster.id} - Owner: {roster.ownerId}
                      </div>
                      <div className="text-sm text-gray-600">
                        {roster.wins}-{roster.losses}-{roster.ties} • {roster.points.toFixed(2)} pts
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lineup Display */}
      {hasLineup && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Starters Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Week Info */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90">Current Week</div>
                  <div className="text-2xl font-bold">Week {currentWeek}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm opacity-90">{lineupState.leagueName}</div>
                  <div className="font-medium">{lineupState.username}</div>
                </div>
              </div>
            </div>

            {/* Starters */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Starting Lineup ({lineupState.starters.length})
              </h3>
              <div className="space-y-2">
                {lineupState.starters.length > 0 ? (
                  lineupState.starters.map((playerId) => (
                    <RosterPlayer key={playerId} playerId={playerId} isStarter={true} />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No starters set</p>
                )}
              </div>
            </div>

            {/* Bench */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Bench ({lineupState.bench.length})
              </h3>
              <div className="space-y-2">
                {lineupState.bench.length > 0 ? (
                  lineupState.bench.map((playerId) => (
                    <RosterPlayer key={playerId} playerId={playerId} isStarter={false} />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No bench players</p>
                )}
              </div>
            </div>
          </div>

          {/* AI Recommendations Column */}
          <div className="lg:col-span-1">
            {lineupState.userId && lineupState.leagueId && (
              <div className="sticky top-6">
                <LineupRecommendations
                  leagueId={lineupState.leagueId}
                  userId={lineupState.userId}
                  week={currentWeek}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LineupBuilder;