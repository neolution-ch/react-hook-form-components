import { FieldValues } from "react-hook-form";
import { CommonInputProps } from "./CommonInputProps";
import { LabelValueOption } from "./LabelValueOption";

export type TypeaheadOptions = LabelValueOption[] | string[];

interface CommonTypeaheadProps<T extends FieldValues> extends CommonInputProps<T> {
  multiple?: boolean;
  defaultSelected?: TypeaheadOptions;
}

export { CommonTypeaheadProps };
