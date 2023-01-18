import { useState } from "react";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { Controller, FieldValues, useFormContext } from "react-hook-form";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { FormGroupLayout } from "./FormGroupLayout";
import { convertTypeaheadOptionsToStringArray } from "./helpers/typeahead";
import { CommonInputProps } from "./types/CommonInputProps";
import { TypeaheadOptions } from "./types/Typeahead";

interface AsyncTypeaheadProps<T extends FieldValues> extends CommonInputProps<T> {
  multiple?: boolean;
  queryFn: (query: string) => Promise<TypeaheadOptions>;
}

const AsyncTypeaheadInput = <T extends FieldValues>(props: AsyncTypeaheadProps<T>) => {
  const { disabled, label, helpText } = props;
  const { name, id } = useSafeNameId(props.name, props.id);

  const { control } = useFormContext();

  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<TypeaheadOptions>([]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        // todo: pass in the labelToolTip here and also in all other components that use FormGroupLayout
        <FormGroupLayout helpText={helpText} name={name} id={id} label={label}>
          <AsyncTypeahead
            {...field}
            id={id}
            multiple={props.multiple}
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
                console.log(results, "results");
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
