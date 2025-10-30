import { type MiddlewareRoute, validateAndTransformBody, validateAndTransformQuery } from '@medusajs/framework/http';
import { createFindParams } from '@medusajs/medusa/api/utils/validators';
import type { z } from 'zod';
import { announcementBarBaseSchema, validateAnnouncementBarDTO } from './validators';

const defaultAnnouncementBarFields = [
  'enabled',
  'text',
  'backgroundColor',
  'linkUrl',
  'position',
  'dismissible',
  'startDateTime',
  'endDateTime',
];

const defaultAnnouncementBarQueryConfig = {
  defaults: [...defaultAnnouncementBarFields],
  isList: false,
};

const getAnnouncementBarQuerySchema = createFindParams();
const updateAnnouncementBarDTOSchema = announcementBarBaseSchema.partial();

export type UpdateAnnouncementBarDTO = z.infer<typeof updateAnnouncementBarDTOSchema>;

export const adminAnnouncementBarMiddlewares: MiddlewareRoute[] = [
  {
    method: ['GET'],
    matcher: '/admin/announcement-bar',
    middlewares: [validateAndTransformQuery(getAnnouncementBarQuerySchema, defaultAnnouncementBarQueryConfig)],
  },
  {
    method: ['PUT'],
    matcher: '/admin/announcement-bar',
    middlewares: [validateAndTransformBody(updateAnnouncementBarDTOSchema), validateAnnouncementBarDTO],
  },
];
