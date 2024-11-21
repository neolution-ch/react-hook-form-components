import { Controller, FieldError, FieldValues, get } from "react-hook-form";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { FormGroupLayout } from "./FormGroupLayout";
import { CommonTypeaheadProps, TypeaheadOptions } from "./types/Typeahead";
import { useFormContext } from "./context/FormContext";
import { useRef } from "react";
import { LabelValueOption } from "./types/LabelValueOption";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

interface StaticTypeaheadInputProps<T extends FieldValues> extends CommonTypeaheadProps<T> {
  options: TypeaheadOptions;
  // FIXME
  // reactBootstrapTypeaheadProps?: Partial<TypeaheadComponentProps>;
}

const StaticTypeaheadInput = <T extends FieldValues>(props: StaticTypeaheadInputProps<T>) => {
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
    inputRef,
  } = props;
  const { name, id } = useSafeNameId(props.name, props.id);
  const {
    control,
    disabled: formDisabled,
    formState: { errors },
    clearErrors,
    getFieldState,
  } = useFormContext();

  const ref = useRef<HTMLDivElement | null>(null);
  const fieldError = get(errors, name) as FieldError | undefined;
  const hasError = !!fieldError;

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
            {...field}
            multiple={multiple}
            options={options}
            defaultValue={defaultValue}
            getOptionLabel={(option: LabelValueOption | string) =>
              typeof option === "string" ? option : option.label
            }
            noOptionsText={noOptionsText}
            onChange={(_, options) => {
              const transformedOptions = !Array.isArray(options)
                ? (typeof options === "string" ? options : String(options?.value || ""))
                : options.map(option => typeof option === "string" ? option : String(option.value));
              const finalValue = multiple ? transformedOptions : transformedOptions[0];
              clearErrors(name);
              if (onChange) {
                onChange(finalValue);
              }
              field.onChange(finalValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                error={hasError}
                helperText={!hideValidationMessage && fieldError?.message}
                placeholder={placeholder}
                disabled={isDisabled}
                variant="outlined" //FIXME
                fullWidth //FIXME
                className={`${className} ${error ? "is-invalid" : ""}`} // FIXME
                style={style}
                ref={(elem) => {
                  ref.current = elem;
                  if (inputRef) {
                    inputRef.current = elem;
                  }
                }}
              />
            )}
            disableClearable={!multiple}
          />
        </FormGroupLayout>
      )}
    />
  );
};

export { StaticTypeaheadInput, StaticTypeaheadInputProps };
