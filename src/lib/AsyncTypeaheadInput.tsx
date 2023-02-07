import { useState } from "react";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { Controller, FieldValues, useFormContext } from "react-hook-form";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { FormGroupLayout } from "./FormGroupLayout";
import { convertTypeaheadOptionsToStringArray } from "./helpers/typeahead";
import { CommonTypeaheadProps, TypeaheadOptions } from "./types/Typeahead";

interface AsyncTypeaheadProps<T extends FieldValues> extends CommonTypeaheadProps<T> {
  queryFn: (query: string) => Promise<TypeaheadOptions>;
}

const AsyncTypeaheadInput = <T extends FieldValues>(props: AsyncTypeaheadProps<T>) => {
  const { disabled, label, helpText, labelToolTip, defaultSelected } = props;
  const { name, id } = useSafeNameId(props.name, props.id);

  const { control } = useFormContext();

  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<TypeaheadOptions>([]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormGroupLayout helpText={helpText} name={name} id={id} label={label} labelToolTip={labelToolTip}>
          <AsyncTypeahead
            {...field}
            id={id}
            multiple={props.multiple}
            defaultSelected={defaultSelected}
            onChange={(e) => {
              const values = convertTypeaheadOptionsToStringArray(e);
              const finalValue = props.multiple ? values : values[0];
              field.onChange(finalValue);
            }}
            className={error ? "is-invalid" : ""}
            inputProps={{ id }}
            isLoading={isLoading}
            options={options}
            onSearch={(query) => {
              void (async () => {
                setIsLoading(true);
                const results = await props.queryFn(query);
                setOptions(results);
                setIsLoading(false);
              })();
            }}
            disabled={disabled}
          />
        </FormGroupLayout>
      )}
    />
  );
};

export { AsyncTypeaheadInput, AsyncTypeaheadProps };
