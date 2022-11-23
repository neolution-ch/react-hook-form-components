import { Typeahead } from "react-bootstrap-typeahead";
import { Controller, FieldValues, useFormContext } from "react-hook-form";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { FormGroupLayout } from "./FormGroupLayout";
import { convertTypeaheadOptionsToStringArray } from "./helpers/typeahead";
import { CommonInputProps } from "./types/CommonInputProps";
import { TypeaheadOptions } from "./types/Typeahead";

interface StaticTypeaheadInputProps<T extends FieldValues> extends CommonInputProps<T> {
  multiple?: boolean;
  options: TypeaheadOptions;
}

const StaticTypeaheadInput = <T extends FieldValues>(props: StaticTypeaheadInputProps<T>) => {
  const { label, helpText } = props;
  const { name, id } = useSafeNameId(props.name, props.id);

  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormGroupLayout helpText={helpText} name={name} id={id} label={label}>
          <Typeahead
            {...field}
            multiple={props.multiple}
            onChange={(e) => {
              const values = convertTypeaheadOptionsToStringArray(e);
              const finalValue = props.multiple ? values : values[0];

              field.onChange(finalValue);
            }}
            id={id}
            options={props.options}
            className={error ? "is-invalid" : ""}
            inputProps={{ id }}
          />
        </FormGroupLayout>
      )}
    />
  );
};

export { StaticTypeaheadInput, StaticTypeaheadInputProps };
