import { createContext, useContext } from "react";
import { FieldValues } from "react-hook-form";

export interface InternalFormContextProps<T extends FieldValues> {
  requiredFields?: (keyof T)[];
}

export interface InternalFormContextProviderProps<T extends FieldValues> extends Pick<InternalFormContextProps<T>, "requiredFields"> {
  children: React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const InternalFormContext = createContext<InternalFormContextProps<any> | null>(null);

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
  if (context === null) {
    throw new Error("useInternalFormContext must be used within a InternalFormContextProvider");
  }
  return context;
};
