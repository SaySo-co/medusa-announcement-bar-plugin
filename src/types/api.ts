export type AdminAnnouncementBarResponse = {
  enabled: boolean;
  text: string;
  backgroundColor: string;
  linkUrl: string;
  position: string;
  dismissible: boolean;
  startDateTime?: Date | string | undefined;
  endDateTime?: Date | string | undefined;
};

export type AdminUpdateAnnouncementBarDTO = {
  enabled: boolean;
  text: string;
  backgroundColor: string;
  linkUrl: string;
  position: string;
  dismissible: boolean;
  startDateTime?: Date | string | undefined;
  endDateTime?: Date | string | undefined;
};

export type AnnouncementBarConfig = {
  enabled?: boolean | undefined;
  text?: string | undefined;
  backgroundColor?: string | undefined;
  linkUrl?: string | undefined;
  position?: AnnouncementBarPosition | undefined;
  dismissible?: boolean | undefined;
  startDateTime?: Date | undefined;
  endDateTime?: Date | undefined;
};
export type AnnouncementBarPosition = 'top-sticky' | 'top-absolute' | 'bottom-sticky' | 'bottom-absolute';

export type UpdateAnnouncementBarWorkflowInput = Partial<AnnouncementBarConfig>;
