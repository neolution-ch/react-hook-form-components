import { createContext, useContext } from "react";
import { FieldValues } from "react-hook-form";

export interface InternalFormContextProps<T extends FieldValues> {
  requiredFields: (keyof T)[];
  readonly: boolean;
}

export interface InternalFormContextProviderProps<T extends FieldValues>
  extends Pick<InternalFormContextProps<T>, "requiredFields" | "readonly"> {
  children: React.ReactNode;
}

export const InternalFormContext = createContext<InternalFormContextProps<never>>({
  requiredFields: [],
  readonly: false,
});

export const InternalFormProvider = <T extends FieldValues>(props: InternalFormContextProviderProps<T>) => {
  const { children, requiredFields, readonly } = props;

  return (
    <InternalFormContext.Provider
      value={{
        requiredFields,
        readonly,
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
