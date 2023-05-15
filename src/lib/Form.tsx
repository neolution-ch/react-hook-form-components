import { ReactNode } from "react";
import { DeepPartial, FieldValues, FormProvider, Resolver, SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { jsonIsoDateReviver } from "./helpers/dateUtils";
import { InternalFormContext } from "./context/InternalFormContext";
import { AutoSubmitConfig, useAutoSubmit } from "./hooks/useAutoSubmit";

interface FormProps<T extends FieldValues> {
  /**
   * will be executed when an submit action was triggered
   */
  onSubmit: SubmitHandler<T>;

  /**
   * the resolver for the validation
   */
  resolver?: Resolver<T>;

  /**
   * the default values of the form
   */
  defaultValues?: DeepPartial<T>;

  /**
   * passed fieldnames will be marked with "*"
   */
  requiredFields?: (keyof T)[];

  /**
   * enables the form to do an autosubmit on values changed
   */
  autoSubmitConfig?: AutoSubmitConfig;

  /**
   * the children that will be drawn inside the form
   */
  children: ((formMethods: UseFormReturn<T, unknown>) => ReactNode) | ReactNode;
}

const Form = <T extends FieldValues>({ children, onSubmit, resolver, defaultValues, requiredFields, autoSubmitConfig }: FormProps<T>) => {
  const revivedDefaultValues = defaultValues
    ? (JSON.parse(JSON.stringify(defaultValues), jsonIsoDateReviver) as DeepPartial<T>)
    : defaultValues;

  const formMethods = useForm<T>({ resolver, defaultValues: revivedDefaultValues });
  const autoSubmitHandler = useAutoSubmit({ onSubmit, formMethods, autoSubmitConfig });

  return (
    <InternalFormContext.Provider value={{ requiredFields: requiredFields || [] }}>
      <FormProvider {...formMethods}>
        <form onSubmit={autoSubmitHandler}>{children instanceof Function ? children(formMethods) : children}</form>
      </FormProvider>
    </InternalFormContext.Provider>
  );
};

export { Form, FormProps };
