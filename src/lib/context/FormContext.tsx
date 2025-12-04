import { createContext, useContext } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { RequiredFieldPath } from "../types/Form";

export interface FormContextProps<T extends FieldValues> extends UseFormReturn<T, unknown> {
  requiredFields: RequiredFieldPath<T>[];
  disabled: boolean;
  hideValidationMessages: boolean;
  disableAriaAutocomplete: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FormContext = createContext<FormContextProps<any> | null>(null);

export const useFormContext = <T extends FieldValues>() => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormContextProvider");
  }
  return context as FormContextProps<T>;
};
