import { ReactNode, useEffect, useState } from "react";
import { DeepPartial, FieldPath, FieldValues, Resolver, SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { jsonIsoDateReviver } from "./helpers/dateUtils";
import { FormContext, FormContextProps } from "./context/FormContext";
import { AutoSubmitConfig, useAutoSubmit } from "./hooks/useAutoSubmit";

export interface FormMethods<T extends FieldValues> extends UseFormReturn<T, unknown>, FormContextProps<T> {}

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
  requiredFields?: FieldPath<T>[];

  /**
   * disable all fields inside the form making it readonly
   */
  disabled?: boolean;

  /**
   * enables the form to do an autosubmit on values changed
   */
  autoSubmitConfig?: AutoSubmitConfig;

  /**
   * the children that will be drawn inside the form
   */
  children: ((formMethods: FormMethods<T>) => ReactNode) | ReactNode;

  /**
   * the form ref
   */
  formRef?: React.MutableRefObject<HTMLFormElement | null>;

  /**
   * Prevents the form from being html-native submited by disabling the form till its client-side loaded
   */
  disableBeforeLoading?: boolean;
}

const Form = <T extends FieldValues>({
  children,
  onSubmit,
  resolver,
  defaultValues,
  requiredFields = [],
  disabled = false,
  autoSubmitConfig,
  formRef,
  disableBeforeLoading = true,
}: FormProps<T>) => {
  const revivedDefaultValues = defaultValues
    ? (JSON.parse(JSON.stringify(defaultValues), jsonIsoDateReviver) as DeepPartial<T>)
    : defaultValues;

  // prevents from sending the form wihtout being proberly loaded by react hook form
  const [disabledLoading, setDisabledLoading] = useState<boolean>(disableBeforeLoading);
  useEffect(() => {
    if (disabledLoading) {
      setDisabledLoading(false);
    }
  }, [setDisabledLoading, disabledLoading]);

  const formMethods = useForm<T>({ resolver, defaultValues: revivedDefaultValues });
  const autoSubmitHandler = useAutoSubmit({ onSubmit, formMethods, autoSubmitConfig });
  return (
    <FormContext.Provider value={{ requiredFields, disabled: disabled, ...formMethods }}>
      <form
        ref={(elem) => {
          if (formRef) {
            formRef.current = elem;
          }
        }}
        onSubmit={autoSubmitHandler}
        method="POST"
      >
        {children instanceof Function ? children({ ...formMethods, disabled, requiredFields }) : children}
      </form>
    </FormContext.Provider>
  );
};

export { Form, FormProps };
