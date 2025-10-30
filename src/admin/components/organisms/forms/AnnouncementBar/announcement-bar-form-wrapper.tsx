import type { AdminAnnouncementBarResponse } from '@announcement-bar-types/api';
import { PencilSquare, Plus } from '@medusajs/icons';
import { Button, Container, Drawer, Heading, Text, Toaster, toast } from '@medusajs/ui';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useAdminUpdateAnnouncementBar } from '../../../../hooks/announcement-bar/announcement-bar-mutations';
import { AnnouncementBarForm } from './announcement-bar-form';
import { AnnouncementBarPreview } from './announcement-bar-preview';

type WrapperProps = {
  announcementBar?: AdminAnnouncementBarResponse | null;
};

const defaultValues: AdminAnnouncementBarResponse = {
  enabled: false,
  text: '',
  backgroundColor: '#F68C2C',
  linkUrl: '',
  position: 'top-sticky',
  dismissible: true,
  startDateTime: undefined,
  endDateTime: undefined,
};

const buildDefaultValues = (announcementBar?: AdminAnnouncementBarResponse | null): AdminAnnouncementBarResponse => {
  return {
    enabled: announcementBar?.enabled ?? defaultValues.enabled,
    text: announcementBar?.text ?? defaultValues.text,
    backgroundColor: announcementBar?.backgroundColor ?? defaultValues.backgroundColor,
    linkUrl: announcementBar?.linkUrl ?? defaultValues.linkUrl,
    position: announcementBar?.position ?? defaultValues.position,
    dismissible: announcementBar?.dismissible ?? defaultValues.dismissible,
    startDateTime: announcementBar?.startDateTime ? new Date(announcementBar.startDateTime) : undefined,
    endDateTime: announcementBar?.endDateTime ? new Date(announcementBar.endDateTime) : undefined,
  };
};

export const AnnouncementBarFormWrapper = (wrapperProps: WrapperProps) => {
  const { announcementBar } = wrapperProps;

  const form = useForm<AdminAnnouncementBarResponse>({
    mode: 'onBlur',
    defaultValues: buildDefaultValues(announcementBar),
  });
  const {
    handleSubmit,
    reset,
    formState: { isValid, isDirty },
    watch,
  } = form;

  const formData = watch();

  const { mutateAsync: updateAnnouncementBar } = useAdminUpdateAnnouncementBar();

  useEffect(() => {
    if (announcementBar) {
      reset(buildDefaultValues(announcementBar));
    } else {
      reset(defaultValues);
    }
  }, [announcementBar, reset]);

  const onSubmit = async (data: AdminAnnouncementBarResponse) => {
    try {
      await updateAnnouncementBar(data, {
        onSuccess: () => {
          toast.success('Announcement bar updated successfully');
        },
        onError: (error) => {
          toast.error(`Error updating announcement bar: ${error}`);
        },
      });
    } catch (error) {
      toast.error(`Error updating announcement bar: ${error}`);
    }
  };

  const isEditing = !!announcementBar;

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>Announcement Bar</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {isEditing ? 'Manage your announcement bar' : 'Create and configure your announcement bar'}
          </Text>
        </div>

        <Drawer>
          <Drawer.Trigger asChild>
            <Button variant="secondary" className="gap-2">
              {isEditing ? (
                <>
                  <PencilSquare className="h-4 w-4" />
                  Edit
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Announcement Bar
                </>
              )}
            </Button>
          </Drawer.Trigger>

          <Drawer.Content className="max-w-2xl">
            <FormProvider {...form}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Drawer.Header>
                  <Drawer.Title>{isEditing ? 'Edit Announcement Bar' : 'Create Announcement Bar'}</Drawer.Title>
                  <Drawer.Description>
                    {isEditing
                      ? 'Update your announcement bar settings and content'
                      : 'Configure your new announcement bar to display important messages to customers'}
                  </Drawer.Description>
                </Drawer.Header>

                <Drawer.Body className="p-6">
                  <AnnouncementBarForm initialValues={announcementBar} />
                </Drawer.Body>

                <Drawer.Footer className="gap-2">
                  <AnnouncementBarPreview formData={formData} />

                  <Drawer.Close asChild>
                    <Button variant="secondary">Cancel</Button>
                  </Drawer.Close>

                  <Drawer.Close asChild>
                    <Button variant="primary" type="submit" disabled={!isValid || !isDirty}>
                      {isEditing ? 'Save Changes' : 'Create Announcement Bar'}
                    </Button>
                  </Drawer.Close>
                </Drawer.Footer>
              </form>
            </FormProvider>
          </Drawer.Content>
        </Drawer>
      </div>
      <Toaster />
    </Container>
  );
};
