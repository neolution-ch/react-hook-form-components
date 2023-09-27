import { createContext, useContext } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

export interface FormContextProps<T extends FieldValues> extends UseFormReturn<T, unknown> {
  requiredFields: (keyof T)[];
  disabled: boolean;
}

export interface InternalFormContextProviderProps<T extends FieldValues>
  extends Pick<FormContextProps<T>, "requiredFields" | "disabled"> {
  children: React.ReactNode;
  formMethods: UseFormReturn<T, unknown>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FormContext = createContext<FormContextProps<any>>({} as FormContextProps<any>);

export const InternalFormProvider = <T extends FieldValues>(props: InternalFormContextProviderProps<T>) => {
  const { children, requiredFields, disabled, formMethods } = props;

  return (
    <FormContext.Provider
      value={{
        ...formMethods,
        requiredFields,
        disabled,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = <T extends FieldValues>() => {
  const context = useContext(FormContext);

  return context as FormContextProps<T>;
};
