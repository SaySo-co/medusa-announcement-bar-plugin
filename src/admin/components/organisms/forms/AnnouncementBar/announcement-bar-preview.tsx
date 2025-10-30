import type { AdminAnnouncementBarResponse } from '@announcement-bar-types/api';
import { Eye, XMark } from '@medusajs/icons';
import { Button, Text } from '@medusajs/ui';
import type { FC } from 'react';
import { useState } from 'react';

type PreviewProps = {
  formData: Partial<AdminAnnouncementBarResponse>;
};

export const AnnouncementBarPreview: FC<PreviewProps> = ({ formData }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPreviewDismissed, setIsPreviewDismissed] = useState(false);

  const {
    enabled = false,
    text = '',
    backgroundColor = '#F68C2C',
    linkUrl = '',
    position = 'top-sticky',
    dismissible = true,
    startDateTime = undefined,
    endDateTime = undefined,
  } = formData;

  if (!enabled || !text.trim()) {
    return (
      <Button variant="secondary" size="small" disabled className="gap-2">
        <Eye className="h-4 w-4" />
        Preview
      </Button>
    );
  }

  const getPositionStyles = () => {
    switch (position) {
      case 'top-sticky':
        return 'top-0 sticky';
      case 'top-absolute':
        return 'top-0 absolute';
      case 'bottom-sticky':
        return 'bottom-0 sticky';
      case 'bottom-absolute':
        return 'bottom-0 absolute';
      default:
        return 'top-0 sticky';
    }
  };

  const getScheduleMessageClassNames = () => {
    if (endDateTime && new Date() > endDateTime) {
      return 'text-red-500';
    }
    return 'text-gray-600';
  };

  const getScheduleMessage = () => {
    if (endDateTime && new Date() > endDateTime) {
      return `Schedule configuration is expired at ${endDateTime.toLocaleString()}`;
    }
    if (startDateTime && endDateTime) {
      return `This announcement bar is scheduled to be visible from ${startDateTime.toLocaleString()} to ${endDateTime.toLocaleString()}`;
    }
    return 'This is how your announcement bar will appear in the storefront';
  };

  const AnnouncementBar = ({ className, style }: { className?: string; style?: React.CSSProperties }) => {
    if (isPreviewDismissed) {
      return null;
    }

    return (
      <div
        className={`w-full px-4 py-3 flex items-center justify-between text-white text-sm font-medium ${className}`}
        style={style}
      >
        <div className="flex items-center gap-2 flex-1">
          {linkUrl ? (
            <a href={linkUrl} className="hover:underline" target="_blank" rel="noopener noreferrer">
              {text}
            </a>
          ) : (
            <span>{text}</span>
          )}
        </div>

        {dismissible && (
          <Button
            variant="transparent"
            size="small"
            onClick={() => setIsPreviewDismissed(true)}
            className="ml-4 hover:bg-white/20 rounded p-1 transition-colors bg-transparent border-none shadow-none"
            aria-label="Close announcement"
          >
            <XMark className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  };

  const PreviewContent = () => (
    <div className="relative min-h-screen bg-gray-50">
      {/* Top Announcement Bar */}
      {(position === 'top-sticky' || position === 'top-absolute') && (
        <AnnouncementBar className={`w-full ${getPositionStyles()}`} style={{ backgroundColor }} />
      )}

      {/* Simulated storefront header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <Text size="small" weight="plus" className="text-gray-600">
            Storefront Header
          </Text>
          <div className="flex gap-4 text-sm text-gray-600 justify-center">
            <span>Dining Room</span>
            <span>Living Room</span>
            <span>Mattresses</span>
            <span>Bedroom</span>
            <span>All Products</span>
          </div>
        </div>
      </div>

      {/* Simulated storefront content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {[1, 2, 3].map((k) => (
            <div key={k} className="bg-white rounded-lg shadow-sm p-6">
              <Text size="large" weight="plus" className="text-gray-600">
                Featured Products
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <div className="bg-gray-200 h-32 rounded mb-3">&nbsp;</div>
                    <div className="h-4 bg-gray-200 rounded mb-2">&nbsp;</div>
                    <div className="h-3 bg-gray-200 rounded w-2/3">&nbsp;</div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-white rounded-lg shadow-sm p-6">
            <Text size="large" weight="plus" className="text-gray-600">
              Latest News
            </Text>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="bg-gray-200 h-16 w-16 rounded">&nbsp;</div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2">&nbsp;</div>
                    <div className="h-3 bg-gray-200 rounded w-3/4">&nbsp;</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Announcement Bar */}
      {(position === 'bottom-sticky' || position === 'bottom-absolute') && (
        <AnnouncementBar className={`w-full ${getPositionStyles()}`} style={{ backgroundColor }} />
      )}
    </div>
  );

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="small"
        onClick={() => {
          setIsPreviewOpen(true);
          setIsPreviewDismissed(false);
        }}
        className="gap-2"
      >
        <Eye className="h-4 w-4" />
        Preview
      </Button>

      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <Text size="large" weight="plus" className="text-gray-600">
                  Announcement Bar Preview
                </Text>
                <Text size="small" className={`text-gray-600 ${getScheduleMessageClassNames()}`}>
                  {getScheduleMessage()}
                </Text>
              </div>
              <Button type="button" variant="primary" size="small" onClick={() => setIsPreviewOpen(false)}>
                Close Preview
              </Button>
            </div>

            <div className="overflow-auto max-h-[calc(90vh-80px)]">
              <PreviewContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
