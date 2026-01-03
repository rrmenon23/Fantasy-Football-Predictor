import { useState } from 'react';
import { Search, Loader2, Trophy } from 'lucide-react';

interface LeagueConnectorProps {
  onConnect: (username: string) => Promise<boolean>;
  onSelectLeague: (leagueId: string, leagueName: string) => void;
  leagues: any[];
  loading: boolean;
}

const LeagueConnector = ({ onConnect, onSelectLeague, leagues, loading }: LeagueConnectorProps) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);

  const handleConnect = async () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setError('');
    const success = await onConnect(username.trim());
    
    if (success) {
      setConnected(true);
    } else {
      setError('User not found. Please check the username.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConnect();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect to Your League</h3>
      
      {/* Username Input */}
      {!connected && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sleeper Username
            </label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your Sleeper username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button
                onClick={handleConnect}
                disabled={loading}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 flex items-center space-x-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                <span>Find Leagues</span>
              </button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>
        </div>
      )}

      {/* League Selection */}
      {connected && leagues.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Select a league to view your lineup:</p>
          <div className="grid gap-2">
            {leagues.map((league: any) => (
              <button
                key={league.id}
                onClick={() => onSelectLeague(league.id, league.name)}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <Trophy className="w-5 h-5 text-primary-600" />
                  <div>
                    <div className="font-medium text-gray-900">{league.name}</div>
                    <div className="text-sm text-gray-600">
                      {league.season} • {league.totalRosters} teams
                    </div>
                  </div>
                </div>
                <div className="text-xs font-medium text-primary-600 uppercase">
                  {league.status}
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setConnected(false);
              setUsername('');
            }}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Change username
          </button>
        </div>
      )}

      {connected && leagues.length === 0 && !loading && (
        <div className="text-center py-6 text-gray-600">
          <p>No leagues found for this user in the current season.</p>
          <button
            onClick={() => {
              setConnected(false);
              setUsername('');
            }}
            className="mt-2 text-primary-600 hover:text-primary-700"
          >
            Try a different username
          </button>
        </div>
      )}
    </div>
  );
};

export default LeagueConnector;