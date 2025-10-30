import type { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework';
import { ContainerRegistrationKeys } from '@medusajs/framework/utils';
import { updateAnnouncementBarWorkflow } from '../../../workflows/announcement-bar/workflows/update-announcement-bar';
import { getAnnouncementBarConfig } from '../../store/announcement-bar/route';
import type { UpdateAnnouncementBarDTO } from './middlewares';

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data } = await query.graph({
    entity: 'store',
    fields: ['id', 'metadata'],
  });

  const store = data[0];
  if (!store) {
    return res.status(200).json(null);
  }

  const metadata = store.metadata;
  const config = getAnnouncementBarConfig(metadata);

  res.status(200).json(config);
};

export const PUT = async (req: AuthenticatedMedusaRequest<UpdateAnnouncementBarDTO>, res: MedusaResponse) => {
  const { result } = await updateAnnouncementBarWorkflow(req.scope).run({
    input: req.validatedBody,
  });

  const announcementBar = result;

  res.status(201).json(announcementBar);
};
