import { ReactNode, SyntheticEvent } from "react";
import { FieldValues } from "react-hook-form";
import { CommonInputProps } from "./CommonInputProps";
import { LabelValueOption } from "./LabelValueOption";
import { AutocompleteCloseReason, TextFieldVariants } from "@mui/material";
import { AutocompleteProps } from "@mui/material/Autocomplete";

export type TypeaheadOption = LabelValueOption | string;

interface CommonTypeaheadProps<T extends FieldValues>
  extends Omit<CommonInputProps<T>, "onChange" | "inputOnly" | "labelTooltip" | "minLength" | "maxLength"> {
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
  autoSelect?: boolean;
  autoHighlight?: boolean;
  disableClearable?: boolean;
  useBootstrapStyle?: boolean;
  getOptionDisabled?: (option: TypeaheadOption) => boolean;
  onChange?: (selected: string | string[]) => void;
  onInputChange?: (text: string) => void;
  onClose?: (event: SyntheticEvent, reason: AutocompleteCloseReason) => void;
  onOpen?: (event: SyntheticEvent) => void;
  onBlur?: () => void;
}

type AsyncTypeaheadAutocompleteProps = Omit<
  AutocompleteProps<LabelValueOption | string, boolean, boolean, boolean>,
  | "options"
  | "open"
  | "loading"
  | "loadingText"
  | "defaultValue"
  | "value"
  | "options"
  | "multiple"
  | "onChange"
  | "onInputChange"
  | "getOptionLabel"
  | "disabled"
  | "selectOnFocus"
  | "noOptionsText"
  | "renderInput"
  | "style"
  | "className"
  | "onClose"
  | "onOpen"
  | "clearIcon"
  | "clearText"
  | "openText"
  | "closeText"
  | "readOnly"
  | "openOnFocus"
  | "getOptionDisabled"
  | "limitTags"
  | "disableCloseOnSelect"
  | "autoSelect"
  | "autoHighlight"
  | "disableClearable"
>;

type StaticTypeaheadAutocompleteProps = Omit<
  AutocompleteProps<TypeaheadOption, boolean, boolean, boolean>,
  | "defaultValue"
  | "value"
  | "options"
  | "multiple"
  | "getOptionLabel"
  | "disabled"
  | "selectOnFocus"
  | "noOptionsText"
  | "renderInput"
  | "style"
  | "className"
  | "onClose"
  | "onOpen"
  | "clearIcon"
  | "clearText"
  | "openText"
  | "closeText"
  | "readOnly"
  | "openOnFocus"
  | "getOptionDisabled"
  | "limitTags"
  | "disableCloseOnSelect"
  | "onInputChange"
  | "onChange"
  | "autoSelect"
  | "autoHighlight"
  | "disableClearable"
>;

export { CommonTypeaheadProps, AsyncTypeaheadAutocompleteProps, StaticTypeaheadAutocompleteProps };
