/* eslint-disable max-lines */
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
  isDisabledGroup,
  sortOptionsByGroup,
  groupOptions,
} from "./helpers/typeahead";
import { MergedAddonProps } from "./types/CommonInputProps";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

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
    | "clearIcon"
    | "clearText"
    | "openText"
    | "closeText"
    | "readOnly"
    | "openOnFocus"
    | "getOptionDisabled"
    | "limitTags"
    | "open"
  >;
}

const AutoCompleteInternal = <T extends FieldValues, TRenderAddon = unknown>(props: StaticTypeaheadInputProps<T, TRenderAddon>) => {
  const {
    options,
    multiple,
    disabled,
    variant,
    label,
    helpText,
    hideValidationMessage,
    onChange,
    onInputChange,
    onClose,
    onOpen,
    getOptionDisabled,
    openOnFocus,
    clearIcon,
    clearText,
    openText,
    closeText,
    limitTags,
    markAllOnFocus,
    addonLeft,
    addonRight,
    addonProps,
    style,
    className,
    noOptionsText,
    placeholder,
    useGroupBy = false,
    readOnly,
    highlightOptions,
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
    const fieldValue = watch(id) as string | string[] | undefined;
    if (fieldValue === undefined) {
      return undefined;
    }
    return typeof fieldValue === "string"
      ? getSingleAutoCompleteValue(options, fieldValue)
      : getMultipleAutoCompleteValue(options, fieldValue);
  }, [id, options, watch]);

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
      options={useGroupBy ? sortOptionsByGroup(options) : options}
      disableCloseOnSelect={!!multiple}
      value={value || (multiple ? [] : null)}
      getOptionLabel={(option: TypeaheadOption) =>
        typeof option === "string" ? option : option.label
      }
      disabled={isDisabled}
      readOnly={readOnly}
      limitTags={limitTags}
      noOptionsText={noOptionsText}
      selectOnFocus={markAllOnFocus}
      clearIcon={clearIcon}
      clearText={clearText}
      openText={openText}
      closeText={closeText}
      style={style}
      className={className}
      onChange={(_, newValue) => {
        const optionsArray = newValue
          ? Array.isArray(newValue)
            ? newValue
            : [newValue]
          : undefined;
        const values = convertAutoCompleteOptionsToStringArray(optionsArray);
        const finalValue = multiple ? values : values[0];
        clearErrors(field.name);
        if (onChange) {
          onChange(finalValue);
        }
        field.onChange(finalValue);
      }}
      openOnFocus={openOnFocus}
      onClose={readOnly ? undefined : onClose}
      onOpen={readOnly ? undefined : onOpen}
      groupBy={useGroupBy ? groupOptions : undefined}
      getOptionDisabled={
        getOptionDisabled || useGroupBy
          ? (option) =>
              (getOptionDisabled?.(option) ||
                (useGroupBy && isDisabledGroup(option))) ??
              false
          : undefined
      }
      renderOption={
        highlightOptions
          ? (props, option, { inputValue }) => {
              const finalOption = typeof option === "string" ? option : option.label;
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              const matches = match(finalOption, inputValue, { insideWords: true }) as Array<[number, number]>;
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              const parts = parse(finalOption, matches) as Array<{ text: string; highlight: boolean }>;
              return (
                <li {...props}>
                  <div>
                    {parts.map((part, index) => (
                      <span
                        key={index}
                        style={{
                          fontWeight: part.highlight ? 700 : 400,
                        }}
                      >
                        {part.text}
                      </span>
                    ))}
                  </div>
                </li>
              );
            }
          : undefined
      }
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
            variant={variant}
            label={label}
            error={hasError}
            helperText={
              hasError && !hideValidationMessage ? errorMessage : helpText
            }
            placeholder={placeholder}
            onChange={(e) => onInputChange && onInputChange(e.target.value)}
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
