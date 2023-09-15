import { ReactNode } from "react";
import { DeepPartial, FieldValues, FormProvider, Resolver, SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { jsonIsoDateReviver } from "./helpers/dateUtils";
import { InternalFormContext, InternalFormContextProps } from "./context/InternalFormContext";
import { AutoSubmitConfig, useAutoSubmit } from "./hooks/useAutoSubmit";

interface ExposedFormMethods<T extends FieldValues>
  extends UseFormReturn<T, unknown>,
    Omit<InternalFormContextProps<T>, "requiredFields"> {}

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
   * disable all fields inside the form making it readonly
   */
  readonly?: boolean;

  /**
   * enables the form to do an autosubmit on values changed
   */
  autoSubmitConfig?: AutoSubmitConfig;

  /**
   * the children that will be drawn inside the form
   */
  children: ((formMethods: ExposedFormMethods<T>) => ReactNode) | ReactNode;
}

const Form = <T extends FieldValues>({
  children,
  onSubmit,
  resolver,
  defaultValues,
  requiredFields,
  readonly = false,
  autoSubmitConfig,
}: FormProps<T>) => {
  const revivedDefaultValues = defaultValues
    ? (JSON.parse(JSON.stringify(defaultValues), jsonIsoDateReviver) as DeepPartial<T>)
    : defaultValues;

  const formMethods = useForm<T>({ resolver, defaultValues: revivedDefaultValues });
  const autoSubmitHandler = useAutoSubmit({ onSubmit, formMethods, autoSubmitConfig });

  return (
    <InternalFormContext.Provider value={{ requiredFields: requiredFields || [], readonly }}>
      <FormProvider {...formMethods}>
        <form onSubmit={autoSubmitHandler}>{children instanceof Function ? children({ ...formMethods, readonly }) : children}</form>
      </FormProvider>
    </InternalFormContext.Provider>
  );
};

export { Form, FormProps };
