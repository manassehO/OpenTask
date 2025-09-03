import { api } from '~/hooks/queryClient';

export function useProfile() {
  const { data, error, isLoading } = api.profile.getProfile.useQuery();
  const user = data?.user;
  return { user, error, isLoading };
}

export function getUserStats() {
  const { data, error, isLoading } = api.profile.getUserStats.useQuery();
  const userStats = data?.stats;
  return { userStats, error, isLoading };
}
