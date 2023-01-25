import { Typeahead } from "react-bootstrap-typeahead";
import { Controller, FieldValues, useFormContext } from "react-hook-form";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { FormGroupLayout } from "./FormGroupLayout";
import { convertTypeaheadOptionsToStringArray } from "./helpers/typeahead";
import { CommonTypeaheadProps, TypeaheadOptions } from "./types/Typeahead";

interface StaticTypeaheadInputProps<T extends FieldValues> extends CommonTypeaheadProps<T> {
  options: TypeaheadOptions;
}

const StaticTypeaheadInput = <T extends FieldValues>(props: StaticTypeaheadInputProps<T>) => {
  const { disabled, label, helpText, labelToolTip, defaultSelected } = props;
  const { name, id } = useSafeNameId(props.name, props.id);

  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormGroupLayout helpText={helpText} name={name} id={id} label={label} labelToolTip={labelToolTip}>
          <Typeahead
            {...field}
            defaultSelected={defaultSelected}
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
            disabled={disabled}
          />
        </FormGroupLayout>
      )}
    />
  );
};

export { StaticTypeaheadInput, StaticTypeaheadInputProps };
