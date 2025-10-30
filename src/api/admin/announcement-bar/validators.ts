import type { MedusaNextFunction, MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { MedusaError } from '@medusajs/framework/utils';
import { z } from 'zod';
import type { UpdateAnnouncementBarDTO } from './middlewares';

const HEX_RGBA = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const isHexRgba = (s: string) => HEX_RGBA.test(s);
const isDateTimeRangeValid = (startDateTime?: Date | undefined, endDateTime?: Date | undefined) => {
  if (startDateTime && endDateTime && startDateTime >= endDateTime) {
    return false;
  }
  return true;
};

export const announcementBarBaseSchema = z.object({
  enabled: z.boolean().optional(),
  text: z.string().optional(),
  backgroundColor: z.string().optional().default('#F68C2C'),
  linkUrl: z.string().optional(),
  position: z.enum(['top-sticky', 'top-absolute', 'bottom-sticky', 'bottom-absolute']).optional().default('top-sticky'),
  dismissible: z.boolean().optional().default(true),
  startDateTime: z.coerce.date().optional(),
  endDateTime: z.coerce.date().optional(),
});

export const announcementBarValidator = (data: z.infer<typeof announcementBarBaseSchema>, ctx: z.RefinementCtx) => {
  if (data.enabled === true && !data.text) {
    ctx.addIssue({
      path: ['text'],
      code: z.ZodIssueCode.custom,
      message: 'Text is required when enabled is true',
    });
  }

  if (data.backgroundColor && !isHexRgba(data.backgroundColor)) {
    ctx.addIssue({
      path: ['backgroundColor'],
      code: z.ZodIssueCode.custom,
      message: 'Background color must be a valid hex color',
    });
  }

  if (!isDateTimeRangeValid(data.startDateTime, data.endDateTime)) {
    ctx.addIssue({
      path: ['startDateTime'],
      code: z.ZodIssueCode.custom,
      message: 'Invalid date time range',
    });
  }
};

export const AnnouncementBarRefinedSchema = announcementBarBaseSchema.superRefine((data, ctx) =>
  announcementBarValidator(data, ctx),
);

export const validateAnnouncementBarDTO = (
  req: MedusaRequest<UpdateAnnouncementBarDTO>,
  _: MedusaResponse,
  next: MedusaNextFunction,
) => {
  const result = AnnouncementBarRefinedSchema.safeParse(req.body);
  if (!result.success) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, result.error.message);
  }

  req.validatedBody = result.data;
  next();
};
