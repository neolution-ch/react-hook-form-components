import { FieldValues } from "react-hook-form";
import { CommonInputProps } from "./CommonInputProps";
import { LabelValueOption } from "./LabelValueOption";
import { AutocompleteCloseReason } from "@mui/material";

export type TypeaheadOption = LabelValueOption | string;

interface CommonTypeaheadProps<T extends FieldValues> extends Omit<CommonInputProps<T>, "onChange"> {
  multiple?: boolean;
  noOptionsText?: string;
  placeholder?: string;
  useGroupBy?: boolean;
  onChange?: (selected: string | string[]) => void;
  onInputChange?: (text: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClose?: (event: React.SyntheticEvent, reason: AutocompleteCloseReason) => void;
  onOpen?: (event: React.SyntheticEvent) => void;
  useBootstrapStyle?: boolean;
}

export { CommonTypeaheadProps };
