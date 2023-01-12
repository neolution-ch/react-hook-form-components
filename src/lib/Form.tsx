import { ReactNode } from "react";
import { DeepPartial, FieldValues, FormProvider, Resolver, SubmitHandler, useForm, UseFormReturn } from "react-hook-form";

interface FormProps<T extends FieldValues> {
  onSubmit: SubmitHandler<T>;
  resolver?: Resolver<T>;
  defaultValues?: DeepPartial<T>;
  children: ((formMethods: UseFormReturn<T, unknown>) => ReactNode) | ReactNode;
}

const jsonParseReviver = (_key: string, value: unknown) => {
  console.log("reviving", value);
  console.log("reviving", typeof value);
  console.log("reviving", /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(([+-][0-2]\d:[0-5]\d)|Z)/.exec(value as string));

  if (
    typeof value == "string" &&
    /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/.exec(
      value,
    )
  ) {
    console.log("reviving2", value);
    return new Date(`${value}`);
  }

  return value;
};

const Form = <T extends FieldValues>({ children, onSubmit, resolver, defaultValues }: FormProps<T>) => {
  const revivedDefaultValues = defaultValues
    ? (JSON.parse(JSON.stringify(defaultValues), jsonParseReviver) as DeepPartial<T>)
    : defaultValues;

  console.log("revivedDefaultValues", revivedDefaultValues);

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
