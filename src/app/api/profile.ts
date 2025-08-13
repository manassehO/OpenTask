import { api } from '~/hooks/queryClient';

export function useProfile() {
  const { data, error, isLoading } = api.profile.getProfile.useQuery();
  const user = data?.user;
  return { user, error, isLoading };
}
