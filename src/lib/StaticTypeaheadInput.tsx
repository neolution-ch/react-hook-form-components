import { ReactNode, useMemo, useState } from "react";
import { get, FieldValues, FieldError, useController } from "react-hook-form";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { CommonTypeaheadProps, TypeaheadOption } from "./types/Typeahead";
import { useFormContext } from "./context/FormContext";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { InputAdornment, IconButton } from "@mui/material";
import {
  convertAutoCompleteOptionsToStringArray,
  getMultipleAutoCompleteValue,
  getSingleAutoCompleteValue,
  isDisabledGroup,
  sortOptionsByGroup,
  groupOptions,
  renderHighlightedOptionFunction,
  bootstrapStyle,
} from "./helpers/typeahead";
import { MergedAddonProps } from "./types/CommonInputProps";
import DownloadingSharpIcon from "@mui/icons-material/DownloadingSharp";

interface StaticTypeaheadInputProps<T extends FieldValues, TRenderAddon = unknown> extends CommonTypeaheadProps<T> {
  options: TypeaheadOption[];
  addonProps?: MergedAddonProps<TRenderAddon>;
  autocompleteProps?: Omit<
    AutocompleteProps<TypeaheadOption, boolean, boolean, boolean>,
    | "defaultValue"
    | "value"
    | "options"
    | "multiple"
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
    | "disableCloseOnSelect"
    | "onInputChange"
    | "onChange"
  >;
}

const StaticTypeaheadInput = <T extends FieldValues, TRenderAddon = unknown>(props: StaticTypeaheadInputProps<T, TRenderAddon>) => {
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
    onBlur,
    openOnFocus,
    clearIcon,
    clearText,
    openText,
    closeText,
    paginationText,
    paginationIcon,
    limitResults = options.length,
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
    highlightOptions = true,
    useBootstrapStyle = false,
    autocompleteProps,
  } = props;

  const [pageSize, setPageSize] = useState(limitResults);
  const [loadMoreOptions, setLoadMoreOptions] = useState<boolean>(limitResults < options.length);

  const { name, id } = useSafeNameId(props.name ?? "", props.id);
  const {
    requiredFields,
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

  const fieldIsRequired = label && typeof label == "string" && requiredFields.includes(props.name);
  const finalLabel = fieldIsRequired ? `${String(label)} *` : label;

  const isDisabled = formDisabled || disabled;
  const fieldError = get(errors, name) as FieldError | undefined;
  const hasError = !!fieldError;
  const errorMessage = String(fieldError?.message);

  // autocomplete requires consistency between the form value and the options types
  const fieldValue = watch(id) as string | string[] | undefined;

  const value = useMemo(() => {
    if (fieldValue === undefined) {
      return undefined;
    }
    return typeof fieldValue === "string"
      ? getSingleAutoCompleteValue(options, fieldValue)
      : getMultipleAutoCompleteValue(options, fieldValue);
  }, [fieldValue, options]);

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

  const paginatedOptions = useMemo(() => options.slice(0, pageSize), [pageSize, options]);

  return (
    <Autocomplete<TypeaheadOption, boolean, boolean, boolean>
      {...autocompleteProps}
      {...field}
      id={id}
      multiple={multiple}
      groupBy={useGroupBy ? groupOptions : undefined}
      options={useGroupBy ? sortOptionsByGroup(paginatedOptions) : paginatedOptions}
      disableCloseOnSelect={!!multiple || loadMoreOptions}
      value={value || (multiple ? [] : null)}
      getOptionLabel={(option: TypeaheadOption) => (typeof option === "string" ? option : option.label)}
      getOptionDisabled={(option) =>
        getOptionDisabled?.(option) ||
        (useGroupBy && isDisabledGroup(option)) ||
        (typeof option === "string" ? false : option.disabled ?? false)
      }
      disabled={isDisabled}
      readOnly={readOnly}
      limitTags={limitTags}
      selectOnFocus={markAllOnFocus}
      clearIcon={clearIcon}
      clearText={clearText}
      openText={openText}
      closeText={closeText}
      noOptionsText={noOptionsText}
      style={useBootstrapStyle ? { ...style, marginBottom: "2rem" } : style}
      className={className}
      onChange={(_, value) => {
        const optionsArray = value ? (Array.isArray(value) ? value : [value]) : undefined;
        const values = convertAutoCompleteOptionsToStringArray(optionsArray);
        const finalValue = multiple ? values : values[0];

        clearErrors(field.name);
        if (onChange) {
          onChange(finalValue);
        }
        field.onChange(finalValue);
      }}
      onInputChange={(_e, value) => {
        if (onInputChange) {
          onInputChange(value);
        }
      }}
      onBlur={() => {
        if (onBlur) {
          onBlur();
        }
        field.onBlur();
      }}
      openOnFocus={openOnFocus}
      onClose={readOnly ? undefined : onClose}
      onOpen={readOnly ? undefined : onOpen}
      renderOption={highlightOptions ? renderHighlightedOptionFunction : undefined}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{ ...(useBootstrapStyle && bootstrapStyle) }}
          variant={variant}
          label={finalLabel}
          error={hasError}
          helperText={hasError && !hideValidationMessage ? errorMessage : helpText}
          placeholder={placeholder}
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <>
                  {startAdornment && <InputAdornment position="start">{startAdornment}</InputAdornment>}
                  {params.InputProps.startAdornment}
                </>
              ),
              endAdornment: (
                <>
                  {endAdornment && <InputAdornment position="start">{endAdornment}</InputAdornment>}
                  {loadMoreOptions && (
                    <IconButton
                      title={paginationText ?? `Load ${limitResults} more`}
                      size="small"
                      onClick={() => {
                        const nextChunk = options.slice(pageSize, pageSize + limitResults);
                        setPageSize(pageSize + nextChunk.length);
                        setLoadMoreOptions(pageSize + nextChunk.length < options.length);
                      }}
                    >
                      {paginationIcon ?? <DownloadingSharpIcon />}
                    </IconButton>
                  )}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
};

export { StaticTypeaheadInput, StaticTypeaheadInputProps };
