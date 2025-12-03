import { ReactNode } from "react";
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
   * passed field names will be marked with "*"
   * field paths for arrays are supported as 0-based indexes (e.g. "items.0", "items.0.name") in compliance with react-hook-form types
   * @example ['firstName', 'address.street', 'items.0.name', 'items.0']
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
   * hide the validation messages for all form inputs.
   */
  hideValidationMessages?: boolean;

  /**
   * controls browser autocomplete behavior for the form.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
   */
  autoComplete?: string;
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
  hideValidationMessages = false,
  autoComplete,
}: FormProps<T>) => {
  const revivedDefaultValues = defaultValues
    ? (JSON.parse(JSON.stringify(defaultValues), jsonIsoDateReviver) as DeepPartial<T>)
    : defaultValues;

  const disableAriaAutocomplete = autoComplete === "off";
  const formMethods = useForm<T>({ resolver, defaultValues: revivedDefaultValues });
  const autoSubmitHandler = useAutoSubmit({ onSubmit, formMethods, autoSubmitConfig });

  return (
    <FormContext.Provider value={{ requiredFields, disabled, hideValidationMessages, disableAriaAutocomplete, ...formMethods }}>
      <form
        ref={(elem) => {
          if (formRef) {
            formRef.current = elem;
          }
        }}
        onSubmit={autoSubmitHandler}
        method="POST"
        autoComplete={autoComplete}
      >
        {children instanceof Function
          ? children({ ...formMethods, disabled, requiredFields, hideValidationMessages, disableAriaAutocomplete })
          : children}
      </form>
    </FormContext.Provider>
  );
};

export { Form, FormProps };
