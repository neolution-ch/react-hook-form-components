
import { Controller, FieldValues } from "react-hook-form";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { FormGroupLayout } from "./FormGroupLayout";
import { CommonTypeaheadProps, TypeaheadOption } from "./types/Typeahead";
import { useFormContext } from "./context/FormContext";
import TextField from "@mui/material/TextField";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";

interface StaticTypeaheadInputProps<T extends FieldValues, Multiple extends boolean | undefined, FreeSolo extends boolean | undefined> extends CommonTypeaheadProps<T, Multiple, FreeSolo> {
  autoCompleteProps?: Partial<AutocompleteProps<TypeaheadOption, Multiple, FreeSolo, false>>;
}

const StaticTypeaheadInput = <T extends FieldValues, Multiple extends boolean | undefined, FreeSolo extends boolean | undefined>(props: StaticTypeaheadInputProps<T, Multiple, FreeSolo>) => {
  const {
    options,
    disabled,
    label,
    helpText,
    labelToolTip,
    defaultValue,
    onChange,

    addonLeft,
    addonRight,
    style,
    className = "",
    noOptionsText,
    placeholder,
    multiple,
    hideValidationMessage = false,
    useGroupBy = false,

    autoCompleteProps,
  } = props;
  const { name, id } = useSafeNameId(props.name, props.id);
  const {
    control,
    disabled: formDisabled,
    clearErrors,
    getFieldState,
  } = useFormContext();
  const isDisabled = formDisabled || disabled;

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        validate: {
          required: () => getFieldState(name)?.error?.message,
        },
      }}
      render={({ field, fieldState: { error } }) => (
        <FormGroupLayout
          helpText={helpText}
          name={name}
          id={id}
          label={label}
          labelToolTip={labelToolTip}
          addonLeft={addonLeft}
          addonRight={addonRight}
          addonProps={{
            isDisabled,
          }}
          inputGroupStyle={props.inputGroupStyle}
          hideValidationMessage={hideValidationMessage}
        >
          <Autocomplete
            id={id}
            options={options}
            defaultValue={defaultValue}
            multiple={multiple}
            disabled={isDisabled}
            noOptionsText={noOptionsText}
            style={style}
            className={`${className} ${error ? "is-invalid" : ""}`}
            onChange={(_event, value) => {
              const finalValue = !value ? [] : (multiple ? (value as LabelValueOption[]).map(x => x.value) as string[] : (value as LabelValueOption).value as string);
              clearErrors(name);

              if (onChange) {
                onChange(finalValue);
              }

              field.onChange(finalValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                placeholder={placeholder}
                error={!!error}
                helperText={error?.message}
              />
            )}
            {...autoCompleteProps}
          />
        </FormGroupLayout>
      )}
    />
  );
};

export { StaticTypeaheadInput, StaticTypeaheadInputProps };
