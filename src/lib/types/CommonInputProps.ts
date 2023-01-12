import { ReactNode } from "react";
import { FieldValues } from "react-hook-form";

interface CommonInputProps<T extends FieldValues> {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  label: string;
  name: keyof T;
  id?: string;
  helpText?: ReactNode;
  disabled?: boolean;
}

export { CommonInputProps };
