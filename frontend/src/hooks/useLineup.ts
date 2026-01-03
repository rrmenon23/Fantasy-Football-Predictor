import { useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_USER, GET_USER_LEAGUES, GET_LEAGUE_ROSTERS, GET_NFL_STATE } from '@/graphql/queries';
import { LineupState } from '@/types/lineup';

export const useLineup = () => {
  const [lineupState, setLineupState] = useState<LineupState>({
    userId: null,
    username: null,
    leagueId: null,
    leagueName: null,
    rosterId: null,
    starters: [],
    bench: [],
    week: 18,
  });

  // Get NFL state for current week
  const { data: nflState } = useQuery(GET_NFL_STATE);

  // Lazy queries - only run when called
  const [getUser, { loading: userLoading }] = useLazyQuery(GET_USER);
  const [getUserLeagues, { data: leaguesData, loading: leaguesLoading }] = useLazyQuery(GET_USER_LEAGUES);
  const [getRosters, { data: rostersData, loading: rostersLoading }] = useLazyQuery(GET_LEAGUE_ROSTERS);

  const connectUser = async (username: string) => {
    try {
      const { data } = await getUser({ variables: { username } });
      
      if (data?.getUser) {
        const userId = data.getUser.userId;
        setLineupState(prev => ({ ...prev, userId, username }));
        
        // Fetch leagues for this user
        const season = nflState?.getNFLState?.season || '2024';
        await getUserLeagues({ 
          variables: { userId, season, sport: 'nfl' } 
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error connecting user:', error);
      return false;
    }
  };

  const selectLeague = async (leagueId: string, leagueName: string) => {
    setLineupState(prev => ({ ...prev, leagueId, leagueName }));
    
    // Fetch rosters for this league
    await getRosters({ variables: { leagueId } });
  };

  const selectRoster = (rosterId: number) => {
    const roster = rostersData?.getLeagueRosters?.find((r: any) => r.id === rosterId);
    
    if (roster) {
      setLineupState(prev => ({
        ...prev,
        rosterId,
        starters: roster.starters,
        bench: roster.players.filter((p: string) => !roster.starters.includes(p)),
      }));
    }
  };

  return {
    lineupState,
    leagues: leaguesData?.getUserLeagues || [],
    rosters: rostersData?.getLeagueRosters || [],
    currentWeek: nflState?.getNFLState?.week || 18,
    connectUser,
    selectLeague,
    selectRoster,
    loading: userLoading || leaguesLoading || rostersLoading,
  };
};