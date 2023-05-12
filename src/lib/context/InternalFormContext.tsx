import { createContext, useContext } from "react";
import { FieldValues } from "react-hook-form";

export interface InternalFormContextProps<T extends FieldValues> {
  requiredFields?: (keyof T)[];
}

export interface InternalFormContextProviderProps<T extends FieldValues> extends Pick<InternalFormContextProps<T>, "requiredFields"> {
  children: React.ReactNode;
}

export const InternalFormContext = createContext<InternalFormContextProps<never>>({
  requiredFields: [],
});

export const InternalFormProvider = <T extends FieldValues>(props: InternalFormContextProviderProps<T>) => {
  const { children, requiredFields } = props;

  return (
    <InternalFormContext.Provider
      value={{
        requiredFields,
      }}
    >
      {children}
    </InternalFormContext.Provider>
  );
};

export const useInternalFormContext = () => {
  const context = useContext(InternalFormContext);

  return context;
};
