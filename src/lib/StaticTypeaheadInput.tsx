import { ReactNode, useMemo } from "react";
import { get, FieldValues, FieldError, useController } from "react-hook-form";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { CommonTypeaheadProps, TypeaheadOption } from "./types/Typeahead";
import { useFormContext } from "./context/FormContext";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { FormControl, InputAdornment, InputLabel } from "@mui/material";
import {
  BootstrapInput,
  convertAutoCompleteOptionsToStringArray,
  getMultipleAutoCompleteValue,
  getSingleAutoCompleteValue,
} from "./helpers/typeahead";
import { MergedAddonProps } from "./types/CommonInputProps";

interface StaticTypeaheadInputProps<T extends FieldValues, TRenderAddon = unknown> extends CommonTypeaheadProps<T> {
  options: TypeaheadOption[];
  addonProps?: MergedAddonProps<TRenderAddon>;
  autocompleteProps?: Omit<
    AutocompleteProps<TypeaheadOption, boolean, boolean, boolean>,
    | "defaultValue"
    | "value"
    | "options"
    | "multiple"
    | "onChange"
    | "getOptionLabel"
    | "disabled"
    | "selectOnFocus"
    | "noOptionsText"
    | "renderInput"
    | "style"
    | "className"
    | "onClose"
    | "onOpen"
  >;
}

const AutoCompleteInternal = <T extends FieldValues, TRenderAddon = unknown>(props: StaticTypeaheadInputProps<T, TRenderAddon>) => {
  const {
    options,
    multiple,
    disabled,
    label,
    placeholder,
    helpText,
    noOptionsText,
    onChange,
    onInputChange,
    onClose,
    onOpen,
    markAllOnFocus,
    addonLeft,
    addonRight,
    addonProps,
    style,
    className,
    hideValidationMessage,
    // useGroupBy = false,
    autocompleteProps,
    useBootstrapStyle,
  } = props;

  const { name, id } = useSafeNameId(props?.name ?? "", props.id);
  const {
    control,
    disabled: formDisabled,
    getFieldState,
    clearErrors,
    watch,
    formState: { errors },
  } = useFormContext();
  const { field } = useController({
    name,
    control,
    rules: {
      validate: {
        required: () => getFieldState(name)?.error?.message,
      },
    },
  });

  const isDisabled = formDisabled || disabled;
  const fieldError = get(errors, name) as FieldError | undefined;
  const hasError = !!fieldError;
  const errorMessage = String(fieldError?.message);

  // autocomplete requires consistency between the form value and the options types
  // need to watch value form the form since controller field value is not consistent
  const value = useMemo(() => {
    const fieldValue = watch("id") as string | string[] | undefined;
    if (fieldValue === undefined) {
      return undefined;
    }
    return typeof fieldValue === "string"
      ? getSingleAutoCompleteValue(options, fieldValue)
      : getMultipleAutoCompleteValue(options, fieldValue);
  }, [options, watch]);

  const startAdornment = useMemo(
    () =>
      addonLeft instanceof Function && addonProps
        ? (addonLeft as (props: TRenderAddon) => ReactNode)(addonProps)
        : (addonLeft as ReactNode),
    [addonLeft, addonProps],
  );

  const endAdornment = useMemo(
    () =>
      addonRight instanceof Function && addonProps
        ? (addonRight as (props: TRenderAddon) => ReactNode)(addonProps)
        : (addonRight as ReactNode),
    [addonRight, addonProps],
  );

  return (
    <Autocomplete<TypeaheadOption, boolean, boolean, boolean>
      {...autocompleteProps}
      {...field}
      id={id}
      multiple={multiple}
      options={options}
      value={value || null}
      getOptionLabel={(option: TypeaheadOption) => (typeof option === "string" ? option : option.label)}
      disabled={isDisabled}
      selectOnFocus={markAllOnFocus}
      noOptionsText={noOptionsText}
      style={style}
      className={className}
      disableCloseOnSelect={multiple}
      onChange={(_, newValue) => {
        const optionsArray = newValue ? (Array.isArray(newValue) ? newValue : [newValue]) : undefined;
        const values = convertAutoCompleteOptionsToStringArray(optionsArray);
        const finalValue = multiple ? values : values[0];
        clearErrors(field.name);
        if (onChange) {
          onChange(finalValue);
        }
        field.onChange(finalValue);
      }}
      onClose={onClose}
      onOpen={onOpen}
      renderInput={(params) =>
        useBootstrapStyle ? (
          <FormControl variant="standard">
            <InputLabel shrink htmlFor="bootstrap-input">
              {label}
            </InputLabel>
            <BootstrapInput {...params} ref={params.InputProps.ref} defaultValue="react-bootstrap" id="bootstrap-input" />
          </FormControl>
        ) : (
          <TextField
            {...params}
            label={label}
            error={hasError}
            helperText={
              hasError && !hideValidationMessage ? errorMessage : helpText
            }
            placeholder={placeholder}
            onChange={(event) => onInputChange && onInputChange(event.target.value, event)}
            slotProps={{
              input: {
                ...params.InputProps,
                startAdornment: startAdornment && (
                  <>
                    <InputAdornment position="start">
                      {startAdornment}
                    </InputAdornment>
                    {params.InputProps.startAdornment}
                  </>
                ),
                endAdornment: endAdornment && (
                  <>
                    <InputAdornment position="end">{endAdornment}</InputAdornment>
                    {params.InputProps.endAdornment}
                  </>
                ),
              },
            }}
          />
        )
      }
    />
  );
};

const StaticTypeaheadInput = <T extends FieldValues>(props: StaticTypeaheadInputProps<T>) => <AutoCompleteInternal {...props} />;

export { StaticTypeaheadInput, StaticTypeaheadInputProps };
