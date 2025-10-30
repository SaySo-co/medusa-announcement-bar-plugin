import type { UpdateAnnouncementBarWorkflowInput } from '@announcement-bar-types/api';
import { MedusaError, Modules } from '@medusajs/framework/utils';
import { createStep, StepResponse } from '@medusajs/framework/workflows-sdk';

export const updateAnnouncementBarStepId = 'update-announcement-bar-step';

export const updateAnnouncementBarStep = createStep(
  updateAnnouncementBarStepId,
  async (data: UpdateAnnouncementBarWorkflowInput, { container }) => {
    const announcementBarService = container.resolve(Modules.STORE);

    const stores = await announcementBarService.listStores();

    if (!stores || stores.length === 0) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, 'Store not found');
    }

    const store = stores[0];
    const originalMetadata = store.metadata;

    const newMetadata = {
      ...store.metadata,
      ...data,
    };

    const updatedStore = await announcementBarService.updateStores(store.id, { metadata: newMetadata });

    return new StepResponse(updatedStore, { storeId: store.id, originalMetadata });
  },
  async (data, { container }) => {
    if (!data) return;

    const { storeId, originalMetadata } = data;
    if (!storeId || !originalMetadata) return;

    const announcementBarService = container.resolve(Modules.STORE);
    await announcementBarService.updateStores(storeId, {
      metadata: originalMetadata,
    });
  },
);
