/**
 * Format a date string to a readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format a timestamp to time ago (e.g., "5 minutes ago")
 */
export const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  
  return formatDate(timestamp);
};

/**
 * Format a player's full name
 */
export const formatPlayerName = (
  firstName: string,
  lastName: string,
  fullName?: string
): string => {
  return fullName || `${firstName} ${lastName}`;
};

/**
 * Format fantasy points with decimal
 */
export const formatPoints = (points: number): string => {
  return points.toFixed(2);
};

/**
 * Format player position with fantasy positions
 */
export const formatPosition = (
  position: string,
  fantasyPositions?: string[]
): string => {
  if (fantasyPositions && fantasyPositions.length > 0) {
    return fantasyPositions.join('/');
  }
  return position;
};

/**
 * Get injury status badge color
 */
export const getInjuryStatusColor = (status: string | null): string => {
  if (!status) return 'bg-green-100 text-green-800';
  
  const lowerStatus = status.toLowerCase();
  if (lowerStatus.includes('out')) return 'bg-red-100 text-red-800';
  if (lowerStatus.includes('doubtful')) return 'bg-red-100 text-red-800';
  if (lowerStatus.includes('questionable')) return 'bg-yellow-100 text-yellow-800';
  if (lowerStatus.includes('probable')) return 'bg-green-100 text-green-800';
  
  return 'bg-gray-100 text-gray-800';
};

/**
 * Get confidence level color
 */
export const getConfidenceColor = (confidence: 'high' | 'medium' | 'low'): string => {
  switch (confidence) {
    case 'high':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Format record (wins-losses-ties)
 */
export const formatRecord = (wins: number, losses: number, ties: number): string => {
  return `${wins}-${losses}${ties > 0 ? `-${ties}` : ''}`;
};