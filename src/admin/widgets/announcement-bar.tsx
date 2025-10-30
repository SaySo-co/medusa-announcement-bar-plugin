import { defineWidgetConfig } from '@medusajs/admin-sdk';
import { Container, Toaster } from '@medusajs/ui';
import { AnnouncementBarDetails } from '../components/organisms/announcement-bar/announcement-bar-details';
import { AnnouncementBarFormWrapper } from '../components/organisms/forms/AnnouncementBar/announcement-bar-form-wrapper';
import { useAdminFetchAnnouncementBar } from '../hooks/announcement-bar/announcement-bar-queries';

const AnnouncementBarWidget = () => {
  const { data: announcementBar, isError } = useAdminFetchAnnouncementBar();

  if (isError) {
    return <div>Error loading announcement bar</div>;
  }

  return (
    <Container className="divide-y p-0 flex flex-col gap-y-4">
      <AnnouncementBarFormWrapper announcementBar={announcementBar} />
      {announcementBar && <AnnouncementBarDetails announcementBar={announcementBar} />}
      <Toaster />
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: 'promotion.list.after',
});

export default AnnouncementBarWidget;
