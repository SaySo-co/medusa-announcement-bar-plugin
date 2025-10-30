import type { AdminAnnouncementBarResponse } from '@announcement-bar-types/api';
import { useQuery } from '@tanstack/react-query';
import { sdk } from '../../lib/sdk';

export const ANNOUNCEMENT_BAR_QUERY_KEYS = ['announcement-bar'];

export const useAdminFetchAnnouncementBar = () => {
  return useQuery<AdminAnnouncementBarResponse>({
    queryKey: [...ANNOUNCEMENT_BAR_QUERY_KEYS],
    queryFn: async () => {
      return sdk.client.fetch<AdminAnnouncementBarResponse>('admin/announcement-bar');
    },
  });
};
