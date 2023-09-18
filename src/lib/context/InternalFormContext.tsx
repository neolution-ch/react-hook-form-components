import { createContext, useContext } from "react";
import { FieldValues } from "react-hook-form";

export interface InternalFormContextProps<T extends FieldValues> {
  requiredFields: (keyof T)[];
  disabled: boolean;
}

export interface InternalFormContextProviderProps<T extends FieldValues>
  extends Pick<InternalFormContextProps<T>, "requiredFields" | "disabled"> {
  children: React.ReactNode;
}

export const InternalFormContext = createContext<InternalFormContextProps<never>>({
  requiredFields: [],
  disabled: false,
});

export const InternalFormProvider = <T extends FieldValues>(props: InternalFormContextProviderProps<T>) => {
  const { children, requiredFields, disabled } = props;

  return (
    <InternalFormContext.Provider
      value={{
        requiredFields,
        disabled,
      }}
    >
      {children}
    </InternalFormContext.Provider>
  );
};

export const useInternalFormContext = <T extends FieldValues>() => {
  const context = useContext(InternalFormContext);

  return context as InternalFormContextProps<T>;
};
