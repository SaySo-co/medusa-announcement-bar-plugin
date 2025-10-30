import type { AnnouncementBarConfig, AnnouncementBarPosition } from '@announcement-bar-types/api';
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { ContainerRegistrationKeys, MedusaError } from '@medusajs/framework/utils';

/**
 * Validate the announcement bar config.
 * If the announcement bar config is not found or disabled, throw an error.
 * If the schedule time has expired, throw an error.
 * @param metadata - The metadata to validate.
 * @throws {MedusaError} - If the announcement bar config is not found or disabled.
 * @throws {MedusaError} - If the schedule time is out of range.
 */
function validateAnnouncementBarConfig(metadata?: Record<string, unknown>) {
  if (!metadata || !('enabled' in metadata) || metadata.enabled === false) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, 'Announcement bar config not found or disabled');
  }

  const now = new Date();
  const { startDateTime, endDateTime } = metadata;
  if (startDateTime) {
    const startDate = new Date(startDateTime as string);
    if (now < startDate) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, 'Schedule time has not started');
    }
  }
  if (endDateTime) {
    const endDate = new Date(endDateTime as string);
    if (now > endDate) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, 'Schedule time has expired');
    }
  }
}

/**
 * Get the announcement bar config from the metadata.
 * @param metadata - The metadata to get the announcement bar config from.
 * @returns The announcement bar config.
 * @throws {MedusaError} - If the metadata is not found.
 */
export function getAnnouncementBarConfig(metadata?: Record<string, unknown> | null): AnnouncementBarConfig | null {
  if (!metadata) {
    return null;
  }

  return {
    enabled: metadata?.enabled as boolean | undefined,
    text: metadata?.text as string | undefined,
    backgroundColor: metadata?.backgroundColor as string | undefined,
    linkUrl: metadata?.linkUrl as string | undefined,
    position: metadata?.position as AnnouncementBarPosition | undefined,
    dismissible: metadata?.dismissible as boolean | undefined,
    startDateTime: metadata?.startDateTime as Date | undefined,
    endDateTime: metadata?.endDateTime as Date | undefined,
  };
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
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

  try {
    validateAnnouncementBarConfig(metadata);
  } catch (_error) {
    return res.status(200).json(null);
  }

  const config = getAnnouncementBarConfig(metadata);

  res.status(200).json(config);
};
