import { createContext, useContext } from "react";
import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

export interface FormContextProps<T extends FieldValues> extends UseFormReturn<T, unknown> {
  requiredFields: FieldPath<T>[];
  disabled: boolean;
  hideValidationMessages: boolean;
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
