import { ReactNode } from "react";
import { DeepPartial, FieldValues, FormProvider, Resolver, SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { jsonIsoDateReviver } from "./helpers/dateUtils";
import { InternalFormContext } from "./context/InternalFormContext";
import { AutoSubmitConfig, useAutoSubmit } from "./hooks/useAutoSubmit";

interface FormProps<T extends FieldValues> {
  onSubmit: SubmitHandler<T>;
  resolver?: Resolver<T>;
  defaultValues?: DeepPartial<T>;
  requiredFields?: (keyof T)[];
  autoSubmitConfig?: AutoSubmitConfig;
  children: ((formMethods: UseFormReturn<T, unknown>) => ReactNode) | ReactNode;
}

const Form = <T extends FieldValues>({ children, onSubmit, resolver, defaultValues, requiredFields, autoSubmitConfig }: FormProps<T>) => {
  const revivedDefaultValues = defaultValues
    ? (JSON.parse(JSON.stringify(defaultValues), jsonIsoDateReviver) as DeepPartial<T>)
    : defaultValues;

  const formMethods = useForm<T>({ resolver, defaultValues: revivedDefaultValues });
  const autoSubmitHandler = useAutoSubmit({ onSubmit, formMethods, autoSubmitConfig });

  return (
    <InternalFormContext.Provider value={{ requiredFields }}>
      <FormProvider {...formMethods}>
        <form onSubmit={autoSubmitHandler}>{children instanceof Function ? children(formMethods) : children}</form>
      </FormProvider>
    </InternalFormContext.Provider>
  );
};

export { Form, FormProps };
