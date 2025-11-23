export { useAuthHook } from './useAuth';
export { useUserData } from './useUserData';
export { useGameCompletion } from './useGameCompletion';
// export { useAdMob } from './useAdMob'; // Disabled - requires dev build for native modules

// React Query hooks
export { useUserData as useUserDataQuery, useUserStats } from './queries';
export { useLeaderboard, useUserRank, useOptimisticLeaderboard } from './queries';
export { useCompleteGameMutation } from './mutations';

