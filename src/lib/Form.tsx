import { PropsWithChildren } from "react";
import { DeepPartial, FieldValues, FormProvider, Resolver, SubmitHandler, useForm } from "react-hook-form";

interface FormProps<T extends FieldValues> {
  onSubmit: SubmitHandler<T>;
  resolver?: Resolver<T>;
  defaultValues?: DeepPartial<T>;
}

const Form = <T extends FieldValues>({ children, onSubmit, resolver, defaultValues }: PropsWithChildren<FormProps<T>>) => {
  const formMethods = useForm<T>({ resolver, defaultValues });
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
        {children}
      </form>
    </FormProvider>
  );
};

export { Form, FormProps };
