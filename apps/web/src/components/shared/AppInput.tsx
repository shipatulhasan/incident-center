import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import * as React from 'react'
import type {
  ControllerRenderProps,
  ControllerFieldState,
  FieldValues,
  Path,
} from "react-hook-form";

interface AppInputProps<
  T extends FieldValues,
  TName extends Path<T>
> extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelAccessory?: React.ReactNode;
  field: ControllerRenderProps<T, TName>;
  fieldState: ControllerFieldState;
}

function AppInput<
  T extends FieldValues,
  TName extends Path<T>
>({
  label,
  labelAccessory,
  field,
  fieldState,
  className,
  ...props
}: AppInputProps<T, TName>) {
  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel className="text-primary">
        {label}
        {labelAccessory}
      </FieldLabel>

      <Input
        {...field}
        {...props}
        className={cn(
          "text-primary h-11 focus-visible:ring-1 border-gray-700 mt-1",
          fieldState.error
            ? "border-red-500 focus-visible:ring-red-500 pr-9"
            : "focus-visible:ring-brand",
          className
        )}
      />

      {fieldState.invalid && (
        <FieldError errors={[fieldState.error]} />
      )}
    </Field>
  );
}

export default AppInput;


