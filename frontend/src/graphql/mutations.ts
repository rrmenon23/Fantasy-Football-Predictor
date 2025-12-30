import { gql } from '@apollo/client';

// Chat mutations
export const SEND_MESSAGE = gql`
  mutation SendMessage(
    $message: String!
    $leagueId: String
    $userId: String
    $conversationHistory: [MessageInput!]
  ) {
    sendMessage(
      message: $message
      leagueId: $leagueId
      userId: $userId
      conversationHistory: $conversationHistory
    ) {
      message
      recommendations {
        type
        player
        reason
        confidence
      }
      timestamp
    }
  }
`;

// Analysis mutations
export const OPTIMIZE_LINEUP = gql`
  mutation OptimizeLineup($leagueId: String!, $userId: String!, $week: Int) {
    optimizeLineup(leagueId: $leagueId, userId: $userId, week: $week) {
      message
      recommendations {
        type
        player
        reason
        confidence
      }
      timestamp
    }
  }
`;

export const GET_WAIVER_RECOMMENDATIONS = gql`
  mutation GetWaiverRecommendations($leagueId: String!, $userId: String!, $limit: Int) {
    getWaiverRecommendations(leagueId: $leagueId, userId: $userId, limit: $limit) {
      message
      recommendations {
        type
        player
        reason
        confidence
      }
      timestamp
    }
  }
`;

export const EVALUATE_TRADE = gql`
  mutation EvaluateTrade($message: String!, $leagueId: String, $userId: String) {
    evaluateTrade(message: $message, leagueId: $leagueId, userId: $userId) {
      message
      recommendations {
        type
        player
        reason
        confidence
      }
      timestamp
    }
  }
`;