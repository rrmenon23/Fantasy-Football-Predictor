import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { SEARCH_PLAYERS } from '@/graphql/queries';
import PlayerCard from './PlayerCard.tsx';
import { Player } from '@/types/player';
import { Search, Loader2 } from 'lucide-react';

const PlayerSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const { data, loading } = useQuery(SEARCH_PLAYERS, {
    variables: { query: debouncedQuery, limit: 20 },
    skip: debouncedQuery.length < 2,
  });

  // Debounce search input
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    
    // Debounce the actual query
    const timer = setTimeout(() => {
      setDebouncedQuery(value);
    }, 300);

    return () => clearTimeout(timer);
  };

  const players: Player[] = data?.searchPlayers || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Player Search</h2>
        <p className="text-gray-600 mt-1">
          Search for any NFL player to view stats and analysis
        </p>
      </div>

      {/* Search input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by player name (e.g., Patrick Mahomes)..."
          className="
            w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          "
        />
      </div>

      {/* Results */}
      <div>
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        )}

        {!loading && debouncedQuery.length >= 2 && players.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No players found matching "{debouncedQuery}"</p>
            <p className="text-sm text-gray-500 mt-2">Try searching for a different name</p>
          </div>
        )}

        {!loading && players.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        )}

        {!loading && debouncedQuery.length < 2 && searchQuery.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Start typing to search for players</p>
            <p className="text-sm text-gray-500 mt-2">
              Search by first name, last name, or full name
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerSearch;