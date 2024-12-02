import { FieldValues } from "react-hook-form";
import { CommonInputProps } from "./CommonInputProps";
import { LabelValueOption } from "./LabelValueOption";
import { AutocompleteCloseReason, TextFieldVariants } from "@mui/material";

export type TypeaheadOption = LabelValueOption | string;

interface CommonTypeaheadProps<T extends FieldValues> extends Omit<CommonInputProps<T>, "onChange"> {
  multiple?: boolean;
  noOptionsText?: string;
  placeholder?: string;
  useGroupBy?: boolean;
  clearIcon?: React.ReactNode;
  clearText?: string;
  closeText?: string;
  openText?: string;
  readOnly?: boolean;
  openOnFocus?: boolean;
  limitTags?: number;
  variant?: TextFieldVariants;
  onChange?: (selected: string | string[]) => void;
  onInputChange?: (text: string) => void;
  onClose?: (event: React.SyntheticEvent, reason: AutocompleteCloseReason) => void;
  onOpen?: (event: React.SyntheticEvent) => void;
  getOptionDisabled?: (option: TypeaheadOption) => boolean;
  highlightOptions?: boolean;
  useBootstrapStyle?: boolean;
}

export { CommonTypeaheadProps };
