import { ReactNode, SyntheticEvent } from "react";
import { FieldValues } from "react-hook-form";
import { CommonInputProps } from "./CommonInputProps";
import { LabelValueOption } from "./LabelValueOption";
import { AutocompleteCloseReason, TextFieldVariants } from "@mui/material";
import { AutocompleteInputChangeReason, AutocompleteProps } from "@mui/material/Autocomplete";

export type TypeaheadOptions = LabelValueOption[] | string[];
export type TypeaheadOption = LabelValueOption | string;

interface CommonTypeaheadProps<T extends FieldValues>
  extends Omit<CommonInputProps<T>, "onChange" | "inputOnly" | "labelTooltip" | "minLength" | "maxLength"> {
  multiple?: boolean;
  placeholder?: string;
  useGroupBy?: boolean;
  readOnly?: boolean;
  limitResults?: number;
  paginationText?: string;
  paginationIcon?: ReactNode;
  variant?: TextFieldVariants;
  highlightOptions?: boolean;
  autoSelect?: boolean;
  autoHighlight?: boolean;
  useBootstrapStyle?: boolean;
  getOptionDisabled?: (option: TypeaheadOption) => boolean;
  onChange?: (selected: string | string[]) => void;
  onInputChange?: (text: string, reason: AutocompleteInputChangeReason) => void;
  onClose?: (event: SyntheticEvent, reason: AutocompleteCloseReason) => void;
  onOpen?: (event: SyntheticEvent) => void;
  onBlur?: () => void;
}

type AsyncTypeaheadAutocompleteProps = Omit<
  AutocompleteProps<LabelValueOption | string, boolean, boolean, boolean>,
  | "options"
  | "open"
  | "loading"
  | "defaultValue"
  | "value"
  | "multiple"
  | "onChange"
  | "onInputChange"
  | "getOptionLabel"
  | "disabled"
  | "renderInput"
  | "style"
  | "className"
  | "onClose"
  | "onOpen"
  | "readOnly"
  | "getOptionDisabled"
  | "autoSelect"
  | "autoHighlight"
>;

type StaticTypeaheadAutocompleteProps = Omit<
  AutocompleteProps<TypeaheadOption, boolean, boolean, boolean>,
  | "defaultValue"
  | "value"
  | "options"
  | "multiple"
  | "getOptionLabel"
  | "disabled"
  | "renderInput"
  | "loading"
  | "style"
  | "className"
  | "onClose"
  | "onOpen"
  | "readOnly"
  | "getOptionDisabled"
  | "disableCloseOnSelect"
  | "onInputChange"
  | "onChange"
  | "autoSelect"
  | "autoHighlight"
>;

export { CommonTypeaheadProps, AsyncTypeaheadAutocompleteProps, StaticTypeaheadAutocompleteProps };
