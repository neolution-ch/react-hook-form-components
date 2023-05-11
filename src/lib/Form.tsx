import { ReactNode, useCallback, useEffect, useRef } from "react";
import { DeepPartial, FieldValues, FormProvider, Resolver, SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { jsonIsoDateReviver } from "./helpers/dateUtils";
import { InternalFormContext } from "./context/InternalFormContext";
import { useDebouncedCallback } from "use-debounce";

interface FormProps<T extends FieldValues> {
  onSubmit: SubmitHandler<T>;
  resolver?: Resolver<T>;
  defaultValues?: DeepPartial<T>;
  requiredFields?: (keyof T)[];
  autoSubmitOnChangeDelayInMs?: number;
  children: ((formMethods: UseFormReturn<T, unknown>) => ReactNode) | ReactNode;
}

const Form = <T extends FieldValues>({
  children,
  onSubmit,
  resolver,
  defaultValues,
  requiredFields,
  autoSubmitOnChangeDelayInMs,
}: FormProps<T>) => {
  const revivedDefaultValues = defaultValues
    ? (JSON.parse(JSON.stringify(defaultValues), jsonIsoDateReviver) as DeepPartial<T>)
    : defaultValues;

  const formMethods = useForm<T>({ resolver, defaultValues: revivedDefaultValues });
  const { handleSubmit, watch } = formMethods;
  const isSubmitting = useRef(false);

  const submitHandler = useCallback(
    (e?: React.FormEvent<HTMLFormElement> | undefined) => {
      void (async () => {
        await handleSubmit(onSubmit)(e);
      })();
    },
    [handleSubmit, onSubmit],
  );

  const debouncedSubmitHandler = useDebouncedCallback((e?: React.FormEvent<HTMLFormElement> | undefined) => {
    if (isSubmitting.current) {
      debouncedSubmitHandler(e);
      return;
    }

    isSubmitting.current = true;
    submitHandler(e);
    isSubmitting.current = false;
  }, autoSubmitOnChangeDelayInMs);

  useEffect(() => {
    if (!autoSubmitOnChangeDelayInMs) {
      return;
    }

    const subscription = watch(() => {
      debouncedSubmitHandler();
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [watch, submitHandler, debouncedSubmitHandler, autoSubmitOnChangeDelayInMs]);

  return (
    <InternalFormContext.Provider value={{ requiredFields }}>
      <FormProvider {...formMethods}>
        <form onSubmit={autoSubmitOnChangeDelayInMs ? debouncedSubmitHandler : submitHandler}>
          {children instanceof Function ? children(formMethods) : children}
        </form>
      </FormProvider>
    </InternalFormContext.Provider>
  );
};

export { Form, FormProps };
