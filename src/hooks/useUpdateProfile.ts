import { api } from '~/trpc/react';

export const useUpdateProfile = () => {
  const { mutate: updateProfile, isPending } =
    api.profile.updateExtendedProfile.useMutation();
  return { updateProfile, isPending };
};

export const useGetProfile = () => {
  const { data: profile, isLoading } =
    api.profile.getExtendedProfile.useQuery();
  return { profile, isLoading };
};
