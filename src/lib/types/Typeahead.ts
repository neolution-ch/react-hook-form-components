import { FieldValues } from "react-hook-form";
import { CommonInputProps } from "./CommonInputProps";
import { LabelValueOption } from "./LabelValueOption";
import { MutableRefObject } from "react";
import TypeheadRef from "react-bootstrap-typeahead/types/core/Typeahead";

export type TypeaheadOptions = LabelValueOption[] | string[];

type CommonTypeaheadProps<T extends FieldValues> = Omit<CommonInputProps<T>, "onChange"> & {
  multiple?: boolean;
  emptyLabel?: string;
  invalidErrorMessage?: string;
  placeholder?: string;
  defaultSelected?: TypeaheadOptions;
  inputRef?: MutableRefObject<TypeheadRef | null>;
  useGroupBy?: boolean;
  onChange?: (selected: string | string[]) => void;
  onInputChange?: (text: string, event: React.ChangeEvent<HTMLInputElement>) => void;
}

export { CommonTypeaheadProps };
