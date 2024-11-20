import { FieldValues } from "react-hook-form";
import { CommonInputProps } from "./CommonInputProps";
import { LabelValueOption } from "./LabelValueOption";
import { ReactNode } from "react";

export type TypeaheadOption = LabelValueOption;

interface CommonTypeaheadProps<
  T extends FieldValues,
  Multiple extends boolean | undefined,
  FreeSolo extends boolean | undefined
> extends Omit<CommonInputProps<T>, "onChange"> {
  defaultValue?: Multiple extends true
  ? TypeaheadOption[] 
  : FreeSolo extends true
  ? TypeaheadOption | string | null 
  : TypeaheadOption | null;

  options: TypeaheadOption[];
  multiple?: boolean;
  noOptionsText?: ReactNode;
  invalidErrorMessage?: string;
  placeholder?: string;

  useGroupBy?: boolean;
  onChange?: (selected: string | string[]) => void;
}

export { CommonTypeaheadProps };
