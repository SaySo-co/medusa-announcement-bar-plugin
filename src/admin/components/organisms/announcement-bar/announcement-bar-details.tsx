import type { AdminAnnouncementBarResponse } from '@announcement-bar-types/api';
import { Calendar, CheckCircle, Clock, Eye, XCircle } from '@medusajs/icons';
import { Container, clx, StatusBadge, Text } from '@medusajs/ui';

interface DetailFieldProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const DetailField = ({ label, value, icon, className }: DetailFieldProps) => (
  <div className={clx('flex flex-col gap-2', className)}>
    <div className="flex items-center gap-2">
      {icon && <div className="text-ui-fg-muted">{icon}</div>}
      <Text size="small" weight="plus" className="text-ui-fg-subtle">
        {label}
      </Text>
    </div>
    <div className="pl-6">{value}</div>
  </div>
);

const StatusDisplay = ({ enabled }: { enabled: boolean }) => (
  <div className="flex items-center gap-2">
    <StatusBadge color={enabled ? 'green' : 'red'}>{enabled ? 'Active' : 'Inactive'}</StatusBadge>
    {enabled ? (
      <CheckCircle className="h-4 w-4 text-ui-tag-green-icon" />
    ) : (
      <XCircle className="h-4 w-4 text-ui-tag-red-icon" />
    )}
  </div>
);

const DateTimeDisplay = ({ dateTime }: { dateTime: Date | string | undefined }) => {
  if (!dateTime) {
    return (
      <Text size="small" className="text-ui-fg-muted italic">
        Not set
      </Text>
    );
  }

  const date = new Date(dateTime);
  const isValidDate = !Number.isNaN(date.getTime());

  if (!isValidDate) {
    return (
      <Text size="small" className="text-ui-fg-muted italic">
        Invalid date format
      </Text>
    );
  }

  const now = new Date();
  const isPast = date < now;
  const isFuture = date > now;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Text size="small" className="text-ui-fg-base">
          {date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
        <StatusBadge color={isPast ? 'red' : isFuture ? 'blue' : 'green'}>
          {isPast ? 'Past' : isFuture ? 'Future' : 'Now'}
        </StatusBadge>
      </div>
      <Text size="small" className="text-ui-fg-muted">
        {date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })}
      </Text>
    </div>
  );
};

const ColorDisplay = ({ color }: { color: string }) => (
  <div className="flex items-center gap-3">
    <div className="h-6 w-6 rounded border border-ui-border-base" style={{ backgroundColor: color }} />
    <Text size="small" className="text-ui-fg-base font-mono">
      {color}
    </Text>
  </div>
);

const LinkDisplay = ({ url }: { url: string }) => {
  if (!url) {
    return (
      <Text size="small" className="text-ui-fg-muted italic">
        No link set
      </Text>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-ui-fg-interactive hover:text-ui-fg-interactive-hover transition-colors"
      >
        <Text size="small" className="truncate max-w-xs">
          {url}
        </Text>
        <Eye className="h-3 w-3 flex-shrink-0" />
      </a>
    </div>
  );
};

const TextDisplay = ({ text }: { text: string }) => {
  if (!text) {
    return (
      <Text size="small" className="text-ui-fg-muted italic">
        No text set
      </Text>
    );
  }

  return (
    <div className="bg-ui-bg-subtle border border-ui-border-base rounded p-3">
      <Text size="small" className="text-ui-fg-base">
        {text}
      </Text>
    </div>
  );
};

const PositionDisplay = ({ position }: { position: string }) => {
  const positionMap: Record<string, { label: string; color: 'green' | 'blue' | 'orange' | 'purple' | 'grey' }> = {
    top: { label: 'Top', color: 'blue' },
    bottom: { label: 'Bottom', color: 'green' },
    sticky: { label: 'Sticky', color: 'purple' },
    fixed: { label: 'Fixed', color: 'orange' },
  };

  const config = positionMap[position] || { label: position, color: 'grey' };

  return (
    <div className="flex items-center gap-2">
      <StatusBadge color={config.color}>{config.label}</StatusBadge>
      <Text size="small" className="text-ui-fg-base capitalize">
        {position}
      </Text>
    </div>
  );
};

const DismissibleDisplay = ({ dismissible }: { dismissible: boolean }) => (
  <div className="flex items-center gap-2">
    <StatusBadge color={dismissible ? 'green' : 'red'}>{dismissible ? 'Dismissible' : 'Persistent'}</StatusBadge>
    {dismissible ? (
      <Eye className="h-4 w-4 text-ui-tag-green-icon" />
    ) : (
      <XCircle className="h-4 w-4 text-ui-tag-red-icon" />
    )}
  </div>
);

export const AnnouncementBarDetails = ({ announcementBar }: { announcementBar: AdminAnnouncementBarResponse }) => {
  return (
    <Container className="p-6">
      <div className="space-y-6">
        {/* Main Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <DetailField
              label="Status"
              value={<StatusDisplay enabled={announcementBar.enabled} />}
              icon={<CheckCircle className="h-4 w-4" />}
            />

            <DetailField
              label="Announcement Text"
              value={<TextDisplay text={announcementBar.text} />}
              icon={<Eye className="h-4 w-4" />}
            />

            <DetailField
              label="Background Color"
              value={<ColorDisplay color={announcementBar.backgroundColor} />}
              icon={<Eye className="h-4 w-4" />}
            />

            <DetailField
              label="Position"
              value={<PositionDisplay position={announcementBar.position} />}
              icon={<Eye className="h-4 w-4" />}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <DetailField
              label="Link URL"
              value={<LinkDisplay url={announcementBar.linkUrl} />}
              icon={<Eye className="h-4 w-4" />}
            />

            <DetailField
              label="Dismissible"
              value={<DismissibleDisplay dismissible={announcementBar.dismissible} />}
              icon={<Eye className="h-4 w-4" />}
            />

            <DetailField
              label="Start Date & Time"
              value={<DateTimeDisplay dateTime={announcementBar.startDateTime} />}
              icon={<Calendar className="h-4 w-4" />}
            />

            <DetailField
              label="End Date & Time"
              value={<DateTimeDisplay dateTime={announcementBar.endDateTime} />}
              icon={<Calendar className="h-4 w-4" />}
            />
          </div>
        </div>

        {/* Additional Info */}
        <div className="border-t border-ui-border-base pt-4">
          <div className="flex items-center gap-2 text-ui-fg-muted">
            <Clock className="h-4 w-4" />
            <Text size="small" className="text-ui-fg-subtle">
              Last updated: {new Date().toLocaleString()}
            </Text>
          </div>
        </div>
      </div>
    </Container>
  );
};
