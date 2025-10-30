import { clx, Input, Text } from '@medusajs/ui';
import { useEffect, useRef, useState } from 'react';
import {
  Controller,
  type ControllerProps,
  type FieldValues,
  type Path,
  type RegisterOptions,
  useFormContext,
} from 'react-hook-form';

type Props<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  rules?: Omit<RegisterOptions<T, Path<T>>, 'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
} & Omit<ControllerProps<T>, 'render'>;

const PREDEFINED_COLORS = [
  '#F68C2C', // Default orange
  '#3B82F6', // Blue
  '#10B981', // Green
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#EC4899', // Pink
  '#6B7280', // Gray
  '#1F2937', // Dark gray
];

export const ControlledColorPicker = <T extends FieldValues>({
  name,
  label,
  rules,
  onChange,
  placeholder = '#F68C2C',
  className,
}: Props<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules as Omit<RegisterOptions<T, Path<T>>, 'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>}
      render={({ field }) => (
        <div className={clx('space-y-2', className)}>
          {label && (
            <Text size="small" weight="plus" className="text-ui-fg-base">
              {label}
            </Text>
          )}

          <div className="relative">
            {/* Color Preview and Input */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="h-10 w-10 rounded border-2 border-ui-border-base hover:border-ui-border-strong transition-colors"
                  style={{ backgroundColor: field.value || '#F68C2C' }}
                  aria-label="Open color picker"
                >
                  <div className="absolute inset-0 rounded border border-ui-border-base" />
                </button>

                {/* Color Picker Dropdown */}
                {isOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-12 left-0 z-50 bg-ui-bg-base border border-ui-border-base rounded-lg shadow-lg p-4 min-w-[280px]"
                  >
                    <div className="space-y-4">
                      {/* Predefined Colors */}
                      <div>
                        <Text size="xsmall" weight="plus" className="text-ui-fg-subtle mb-2">
                          Quick Colors
                        </Text>
                        <div className="grid grid-cols-6 gap-2">
                          {PREDEFINED_COLORS.map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => {
                                field.onChange(color);
                                onChange?.(color);
                                setIsOpen(false);
                              }}
                              className={clx(
                                'h-8 w-8 rounded border-2 transition-all hover:scale-110',
                                field.value === color
                                  ? 'border-ui-border-strong ring-2 ring-ui-border-strong'
                                  : 'border-ui-border-base hover:border-ui-border-strong',
                              )}
                              style={{ backgroundColor: color }}
                              aria-label={`Select color ${color}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Custom Color Input */}
                      <div>
                        <Text size="xsmall" weight="plus" className="text-ui-fg-subtle mb-2">
                          Custom Color
                        </Text>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-8 w-8 rounded border border-ui-border-base flex-shrink-0"
                            style={{ backgroundColor: field.value || '#F68C2C' }}
                          />
                          <Input
                            value={field.value || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value);
                              onChange?.(value);
                            }}
                            placeholder={placeholder}
                            className="flex-1"
                            maxLength={7}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Close button */}
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="absolute top-2 right-2 text-ui-fg-muted hover:text-ui-fg-base transition-colors"
                      aria-label="Close color picker"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              {/* Hex Input Field */}
              <div className="flex-1">
                <Input
                  {...field}
                  placeholder={placeholder}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value);
                    onChange?.(value);
                  }}
                  maxLength={7}
                  className="font-mono"
                />
              </div>
            </div>

            {/* Error Message */}
            {errors && name && errors[name] && (
              <Text size="xsmall" className="text-ui-tag-red-text">
                {errors[name]?.message as string}
              </Text>
            )}

            {/* Help Text */}
            <Text size="xsmall" className="text-ui-fg-muted">
              Enter a hex color code (e.g., #F68C2C) or click to choose from predefined colors
            </Text>
          </div>
        </div>
      )}
    />
  );
};
