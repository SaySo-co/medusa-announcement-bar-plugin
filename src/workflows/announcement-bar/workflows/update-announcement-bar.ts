import type { UpdateAnnouncementBarWorkflowInput } from '@announcement-bar-types/api';
import { createWorkflow, type WorkflowData, WorkflowResponse } from '@medusajs/framework/workflows-sdk';
import { updateAnnouncementBarStep } from '../steps/update-announcement-bar';

export const updateAnnouncementBarWorkflow = createWorkflow(
  'update-announcement-bar-workflow',
  (input: WorkflowData<UpdateAnnouncementBarWorkflowInput>) => {
    const announcementBar = updateAnnouncementBarStep(input);

    return new WorkflowResponse(announcementBar);
  },
);
