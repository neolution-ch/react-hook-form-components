import { ReactNode } from "react";
import { DeepPartial, FieldValues, FormProvider, Resolver, SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { jsonIsoDateReviver } from "./helpers/dateUtils";

interface FormProps<T extends FieldValues> {
  onSubmit: SubmitHandler<T>;
  resolver?: Resolver<T>;
  defaultValues?: DeepPartial<T>;
  children: ((formMethods: UseFormReturn<T, unknown>) => ReactNode) | ReactNode;
}

const Form = <T extends FieldValues>({ children, onSubmit, resolver, defaultValues }: FormProps<T>) => {
  const revivedDefaultValues = defaultValues
    ? (JSON.parse(JSON.stringify(defaultValues), jsonIsoDateReviver) as DeepPartial<T>)
    : defaultValues;

  const formMethods = useForm<T>({ resolver, defaultValues: revivedDefaultValues });
  const { handleSubmit } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={(e) => {
          void (async () => {
            await handleSubmit(onSubmit)(e);
          })();
        }}
      >
        {children instanceof Function ? children(formMethods) : children}
      </form>
    </FormProvider>
  );
};

export { Form, FormProps };
