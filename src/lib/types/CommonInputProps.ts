import { ReactNode } from "react";
import { FieldValues } from "react-hook-form";

interface CommonInputProps<T extends FieldValues> {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  label: string;
  // todo: change this to a ReactNode so that the caller can pass in anything they want
  name: keyof T;
  id?: string;
  helpText?: ReactNode;
  disabled?: boolean;
  // todo: add labelToolTip here as an optional string property
}

export { CommonInputProps };
