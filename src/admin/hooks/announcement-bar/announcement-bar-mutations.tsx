import type { AdminAnnouncementBarResponse, AdminUpdateAnnouncementBarDTO } from '@announcement-bar-types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sdk } from '../../lib/sdk';

const QUERY_KEY = ['announcement-bar'];

export const useAdminUpdateAnnouncementBar = () => {
  const queryClient = useQueryClient();
  return useMutation<AdminAnnouncementBarResponse, Error, AdminUpdateAnnouncementBarDTO>({
    mutationFn: async (body) => {
      return sdk.client.fetch<AdminUpdateAnnouncementBarDTO>('admin/announcement-bar', {
        method: 'PUT',
        body,
      });
    },
    mutationKey: [...QUERY_KEY],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY] });
    },
  });
};
