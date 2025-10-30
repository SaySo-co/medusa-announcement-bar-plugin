import type { AdminAnnouncementBarResponse } from '@announcement-bar-types/api';
import { InformationCircleSolid } from '@medusajs/icons';
import { Heading, Text, Tooltip } from '@medusajs/ui';
import type { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { ControlledCheckbox } from '../../../atoms/ControlledFields/ControlledCheckbox';
import { ControlledColorPicker } from '../../../atoms/ControlledFields/ControlledColorPicker';
import { ControlledDatePicker } from '../../../atoms/ControlledFields/ControlledDatePicker';
import { ControlledInput } from '../../../atoms/ControlledFields/ControlledInput';
import { ControlledSelect } from '../../../atoms/ControlledFields/ControlledSelect';
import { ControlledTextArea } from '../../../atoms/ControlledFields/ControlledTextArea';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../atoms/Field/Select';

const POSITION_OPTIONS = [
  { label: 'Top Sticky', value: 'top-sticky', description: 'Fixed at top, always visible' },
  { label: 'Top Absolute', value: 'top-absolute', description: 'Top of page, scrolls away' },
  { label: 'Bottom Sticky', value: 'bottom-sticky', description: 'Fixed at bottom, always visible' },
  { label: 'Bottom Absolute', value: 'bottom-absolute', description: 'Bottom of page, scrolls away' },
];

export const AnnouncementBarForm: FC<{ initialValues?: AdminAnnouncementBarResponse | null }> = ({ initialValues }) => {
  const { watch } = useFormContext<AdminAnnouncementBarResponse>();

  const enabled = watch('enabled') ?? initialValues?.enabled ?? false;

  return (
    <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <Heading level="h3" className="text-ui-fg-base">
              Announcement Bar Configuration
            </Heading>
            <Text className="text-ui-fg-subtle text-sm">
              Configure your announcement bar to display important messages to customers
            </Text>
          </div>
        </div>

        {/* Enable/Disable Toggle */}
        <div className="flex items-center gap-2">
          <ControlledCheckbox name="enabled" label="Enable announcement bar" />
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-4">
        <div>
          <Text size="small" weight="plus" className="text-ui-fg-base mb-3 block">
            Content
          </Text>
          <div className="space-y-4">
            <ControlledTextArea
              name="text"
              label="Announcement Text (Required if enabled)"
              placeholder="Enter your announcement message..."
              rules={{
                required: enabled ? 'Announcement text is required' : false,
                maxLength: { value: 150, message: 'Text must be less than 150 characters' },
              }}
              required={enabled}
            />

            <ControlledInput
              name="linkUrl"
              label="Link URL (Optional)"
              placeholder="https://example.com/promotion"
              rules={{
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: 'Please enter a valid URL starting with http:// or https://',
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="space-y-4">
        <div>
          <Text size="small" weight="plus" className="text-ui-fg-base mb-3 block">
            Appearance
          </Text>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <ControlledColorPicker
              name="backgroundColor"
              label="Background Color"
              placeholder="#F68C2C"
              rules={{
                pattern: {
                  value: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                  message: 'Please enter a valid hex color (e.g., #F68C2C)',
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Position Section */}
      <div className="flex items-center gap-2">
        <ControlledSelect
          name="position"
          label="Position"
          rules={{
            required: { value: true, message: 'Position is required' },
          }}
          defaultValue={'top-sticky'}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose an option..." />
          </SelectTrigger>
          <SelectContent>
            {POSITION_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </ControlledSelect>
        <Tooltip
          content={
            <div className="space-y-2">
              {POSITION_OPTIONS.map((option) => (
                <div key={option.value}>
                  <strong>{option.label}:</strong> {option.description}
                </div>
              ))}
            </div>
          }
        >
          <InformationCircleSolid className="w-4 h-4" />
        </Tooltip>
      </div>

      {/* Behavior Section */}
      <div className="space-y-4">
        <div>
          <Text size="small" weight="plus" className="text-ui-fg-base mb-3 block">
            Behavior
          </Text>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ControlledCheckbox name="dismissible" label="Allow users to dismiss the bar" defaultValue={true} />
              <Tooltip content="Allow users to dismiss the bar by clicking the close button.">
                <InformationCircleSolid className="w-4 h-4" />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Section */}
      <div className="space-y-4">
        <div>
          <Text size="small" weight="plus" className="text-ui-fg-base mb-3 block">
            Schedule (Optional)
          </Text>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ControlledDatePicker
              name="startDateTime"
              label="Start Date & Time"
              placeholder="--/--/--"
              aria-label="Select start date and time for announcement bar"
              showTimePicker
              granularity="minute"
              aria-labelledby="Start Date & Time"
            />

            <ControlledDatePicker
              name="endDateTime"
              label="End Date & Time"
              placeholder="--/--/--"
              showTimePicker
              granularity="minute"
              aria-labelledby="End Date & Time"
              aria-label="Select end date and time for announcement bar"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
