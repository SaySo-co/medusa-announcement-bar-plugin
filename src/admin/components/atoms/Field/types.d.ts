import type { RefAttributes } from 'react';
import type { Props, SelectInstance } from 'react-select';
import type { CreatableProps } from 'react-select/creatable';

export interface BasicFieldProps {
  label?: ReactNode;
  labelClassName?: string;
  labelTooltip?: ReactNode;
  wrapperClassName?: string;
  errorClassName?: string;
  formErrors?: { [x: string]: unknown };
  name?: string;
}

export interface FieldWrapperProps<T> extends BasicFieldProps, T {
  children: (args: T) => ReactNode;
}

export type TextAreaProps = Omit<
  React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>,
  'ref'
> &
  React.RefAttributes<HTMLTextAreaElement>;

interface RawCurrencyInputProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Primitive>, 'prefix' | 'suffix' | 'size'>,
    VariantProps<typeof currencyInputVariants> {
  symbol: string;
  code: string;
}

export type MedusaCurrencyInputProps = RawCurrencyInputProps & React.RefAttributes<HTMLInputElement>;

export type MedusaInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  size?: 'small' | 'base';
};

export type SearchableSelectProps = Props<Option, IsMulti, Group> &
  RefAttributes<SelectInstance<Option, IsMulti, Group>>;

export type CreatableSelectProps = CreatableProps<Option, IsMulti, Group> &
  RefAttributes<SelectInstance<Option, IsMulti, Group>>;
