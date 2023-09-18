import { Typeahead } from "react-bootstrap-typeahead";
import { TypeaheadComponentProps } from "react-bootstrap-typeahead/types/components/Typeahead";
import { Controller, FieldValues, useFormContext } from "react-hook-form";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { FormGroupLayout } from "./FormGroupLayout";
import { convertTypeaheadOptionsToStringArray } from "./helpers/typeahead";
import { CommonTypeaheadProps, TypeaheadOptions } from "./types/Typeahead";
import { useMarkOnFocusHandler } from "./hooks/useMarkOnFocusHandler";
import { useInternalFormContext } from "./context/InternalFormContext";

interface StaticTypeaheadInputProps<T extends FieldValues> extends CommonTypeaheadProps<T> {
  options: TypeaheadOptions;
  reactBootstrapTypeaheadProps?: Partial<TypeaheadComponentProps>;
}

const StaticTypeaheadInput = <T extends FieldValues>(props: StaticTypeaheadInputProps<T>) => {
  const {
    disabled,
    label,
    helpText,
    labelToolTip,
    defaultSelected,
    reactBootstrapTypeaheadProps,
    onChange,
    markAllOnFocus,
    addonLeft,
    addonRight,
    style,
    className = "",
  } = props;
  const { name, id } = useSafeNameId(props.name, props.id);

  const { control } = useFormContext();
  const focusHandler = useMarkOnFocusHandler(markAllOnFocus);
  const { disabled : formDisabled } = useInternalFormContext<T>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormGroupLayout
          helpText={helpText}
          name={name}
          id={id}
          label={label}
          labelToolTip={labelToolTip}
          addonLeft={addonLeft}
          addonRight={addonRight}
          inputGroupStyle={props.inputGroupStyle}
        >
          <Typeahead
            {...field}
            defaultSelected={defaultSelected}
            multiple={props.multiple}
            style={style}
            onChange={(e) => {
              const values = convertTypeaheadOptionsToStringArray(e);
              const finalValue = props.multiple ? values : values[0];

              if (onChange) {
                onChange(finalValue);
              }

              field.onChange(finalValue);
            }}
            id={id}
            options={props.options}
            className={`${className} ${error ? "is-invalid" : ""}`}
            inputProps={{ id }}
            disabled={formDisabled || disabled}
            onFocus={focusHandler}
            {...reactBootstrapTypeaheadProps}
          />
        </FormGroupLayout>
      )}
    />
  );
};

export { StaticTypeaheadInput, StaticTypeaheadInputProps };
