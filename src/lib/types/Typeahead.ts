import { FieldValues } from "react-hook-form";
import { CommonInputProps } from "./CommonInputProps";
import { LabelValueOption } from "./LabelValueOption";
import { MutableRefObject } from "react";

export type TypeaheadOptions = LabelValueOption[] | string[];

interface CommonTypeaheadProps<T extends FieldValues> extends Omit<CommonInputProps<T>, "onChange"> {
  multiple?: boolean;
  noOptionsText?: string;
  invalidErrorMessage?: string;
  placeholder?: string;
  defaultValue?: TypeaheadOptions;
  inputRef?: MutableRefObject<HTMLDivElement | null>;
  useGroupBy?: boolean;
  onChange?: (selected: string | string[]) => void;
  onInputChange?: (text: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  useBootstrapStyle?: boolean;
}

export { CommonTypeaheadProps };
