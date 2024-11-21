import { Controller, FieldError, FieldValues, get } from "react-hook-form";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { CommonTypeaheadProps, TypeaheadOptions } from "./types/Typeahead";
import { useFormContext } from "./context/FormContext";
import { useRef } from "react";
import { LabelValueOption } from "./types/LabelValueOption";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

interface StaticTypeaheadInputProps<T extends FieldValues> extends CommonTypeaheadProps<T> {
  options: TypeaheadOptions;
  autocompleteProps?: Partial<AutocompleteProps<LabelValueOption | string, boolean, boolean, boolean>>;
}

const StaticTypeaheadInput = <T extends FieldValues>(props: StaticTypeaheadInputProps<T>) => {
  const {
    autocompleteProps,
    multiple,
    options,
    defaultValue,
    inputGroupStyle,
    noOptionsText,
    // FIXME useGroupBy,
    onChange,

    disabled,
    label,
    helpText,
    addonLeft,
    addonRight,
    style,
    className = "",
    placeholder,
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
      render={({ field }) => (
        <Autocomplete
          {...field}
          {...autocompleteProps}
          id={id}
          multiple={multiple}
          options={options}
          defaultValue={defaultValue}
          style={inputGroupStyle}
          noOptionsText={noOptionsText}
          // FIXME
          // groupBy={useGroupBy && options.every(x => typeof x !== "string") ? (option: LabelValueOption) => option.group?.name ?? "" : undefined}
          getOptionLabel={(option: LabelValueOption | string) => typeof option === "string" ? option : option.label}
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
              label={label}
              helperText={hasError && !hideValidationMessage ? fieldError?.message : helpText}
              placeholder={placeholder}
              disabled={isDisabled}
              className={className}
              style={style}
              ref={(elem) => {
                ref.current = elem;
                if (inputRef) {
                  inputRef.current = elem;
                }
              }}
              slotProps={{
                input: {
                  startAdornment: addonLeft && (
                    <InputAdornment position="start">
                      <>{addonLeft}</>
                    </InputAdornment>
                  ),
                  endAdornment: addonRight && (
                    <InputAdornment position="end">
                      <>{addonRight}</>
                    </InputAdornment>
                  ),
                }
              }}
            />
          )}
        />
      )}
    />
  );
};

export { StaticTypeaheadInput, StaticTypeaheadInputProps };
