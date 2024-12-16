import { ReactNode, SyntheticEvent } from "react";
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
  clearIcon?: ReactNode;
  clearText?: string;
  closeText?: string;
  openText?: string;
  readOnly?: boolean;
  openOnFocus?: boolean;
  limitTags?: number;
  limitResults?: number;
  paginationText?: string;
  paginationIcon?: ReactNode;
  variant?: TextFieldVariants;
  highlightOptions?: boolean;
  useBootstrapStyle?: boolean;
  getOptionDisabled?: (option: TypeaheadOption) => boolean;
  onChange?: (selected: string | string[]) => void;
  onInputChange?: (text: string) => void;
  onClose?: (event: SyntheticEvent, reason: AutocompleteCloseReason) => void;
  onOpen?: (event: SyntheticEvent) => void;
  onBlur?: () => void;
}

export { CommonTypeaheadProps };
