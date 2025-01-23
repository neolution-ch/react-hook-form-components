import { ReactNode, useEffect, useMemo, useState } from "react";
import { FieldError, FieldValues, useController, get } from "react-hook-form";
import { CommonTypeaheadProps, TypeaheadOption } from "./types/Typeahead";
import { LabelValueOption } from "./types/LabelValueOption";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {
  bootstrapStyle,
  convertAutoCompleteOptionsToStringArray,
  getMultipleAutoCompleteValue,
  getSingleAutoCompleteValue,
  getUniqueOptions,
  groupOptions,
  isDisabledGroup,
  renderHighlightedOptionFunction,
} from "./helpers/typeahead";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import { useDebounceHook } from "./hooks/useDebounceHook";
import { MergedAddonProps } from "./types/CommonInputProps";
import { useSafeNameId } from "./hooks/useSafeNameId";
import DownloadingSharpIcon from "@mui/icons-material/DownloadingSharp";
import { IconButton } from "@mui/material";
import { useFormContext } from "./context/FormContext";

interface AsyncTypeaheadInputProps<T extends FieldValues, TRenderAddon = unknown> extends CommonTypeaheadProps<T> {
  queryFn: (query: string) => Promise<TypeaheadOption[]>;
  onQueryError?: (error: unknown) => void;
  delay?: number;
  loadingText?: string;
  addonProps?: MergedAddonProps<TRenderAddon>;
  disableCloseOnSelect?: boolean;
  defaultOptions?: TypeaheadOption[];
  autocompleteProps?: Omit<
    AutocompleteProps<LabelValueOption | string, boolean, boolean, boolean>,
    | "options"
    | "open"
    | "loading"
    | "loadingText"
    | "defaultValue"
    | "value"
    | "options"
    | "multiple"
    | "onChange"
    | "onInputChange"
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
    | "autoSelect"
    | "autoHighlight"
  >;
}

const AsyncTypeaheadInput = <T extends FieldValues, TRenderAddon = unknown>(props: AsyncTypeaheadInputProps<T, TRenderAddon>) => {
  const {
    multiple,
    disabled,
    variant,
    label,
    helpText,
    hideValidationMessage,
    onBlur,
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
    highlightOptions = true,
    autoHighlight = true,
    autoSelect = true,
    loadingText,
    queryFn,
    onQueryError,
    delay = 200,
    disableCloseOnSelect,
    defaultOptions = [],
    limitResults,
    paginationText,
    paginationIcon,
    useBootstrapStyle = false,
    autocompleteProps,
  } = props;

  const [options, setOptions] = useState<TypeaheadOption[]>(defaultOptions);
  const [selectedOptions, setSelectedOptions] = useState<TypeaheadOption[]>(defaultOptions);
  const [inputValue, setInputValue] = useState("");
  const [pageSize, setPageSize] = useState(limitResults);
  const [loadMoreOptions, setLoadMoreOptions] = useState(!!limitResults && limitResults < defaultOptions.length);

  const { name, id } = useSafeNameId(props.name ?? "", props.id);
  const { setDebounceSearch, loading } = useDebounceHook(queryFn, setOptions, onQueryError);
  const {
    control,
    requiredFields,
    getFieldState,
    formState: { errors },
    clearErrors,
    watch,
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

  const fieldError = get(errors, name) as FieldError | undefined;
  const hasError = !!fieldError;
  const errorMessage = String(fieldError?.message);

  // autocomplete requires consistency between the form value and the options types
  const fieldValue = watch(name) as string | string[] | undefined;

  const value = useMemo(() => {
    if (fieldValue == undefined) {
      return undefined;
    }
    const mergedArray = getUniqueOptions(selectedOptions, options);
    return typeof fieldValue === "string"
      ? getSingleAutoCompleteValue(options, fieldValue)
      : getMultipleAutoCompleteValue([...options, ...mergedArray], fieldValue);
  }, [fieldValue, options, selectedOptions]);

  const startAdornment = useMemo(
    () =>
      addonLeft instanceof Function && addonProps
        ? (addonLeft as unknown as (props: TRenderAddon) => ReactNode)(addonProps)
        : (addonLeft as ReactNode),
    [addonLeft, addonProps],
  );

  const endAdornment = useMemo(
    () =>
      addonRight instanceof Function && addonProps
        ? (addonRight as unknown as (props: TRenderAddon) => ReactNode)(addonProps)
        : (addonRight as ReactNode),
    [addonRight, addonProps],
  );

  const paginatedOptions = useMemo(() => (pageSize !== undefined ? options.slice(0, pageSize) : options), [pageSize, options]);

  useEffect(() => {
    if (inputValue === "") {
      setOptions(selectedOptions);
      setPageSize(limitResults);
    } else {
      setDebounceSearch({ delay, query: inputValue });
    }
  }, [delay, inputValue, limitResults, selectedOptions, setDebounceSearch]);

  useEffect(() => {
    if (pageSize !== undefined) {
      setLoadMoreOptions(pageSize < options.length);
    }
  }, [options, pageSize]);

  return (
    <Autocomplete<TypeaheadOption, boolean, boolean, boolean>
      {...autocompleteProps}
      {...field}
      id={id}
      multiple={multiple}
      disableCloseOnSelect={disableCloseOnSelect}
      loading={loading}
      loadingText={loadingText}
      options={paginatedOptions}
      filterOptions={(currentOptions) => (multiple ? getUniqueOptions(currentOptions, selectedOptions) : currentOptions)}
      getOptionLabel={(option: TypeaheadOption) => (typeof option === "string" ? option : option.label)}
      inputValue={multiple ? inputValue : undefined}
      value={value || (multiple ? [] : null)}
      getOptionDisabled={(option) =>
        getOptionDisabled?.(option) ||
        (useGroupBy && isDisabledGroup(option)) ||
        (typeof option == "string" ? false : option.disabled ?? false)
      }
      disabled={disabled}
      readOnly={readOnly}
      limitTags={limitTags}
      noOptionsText={noOptionsText}
      selectOnFocus={markAllOnFocus}
      clearIcon={clearIcon}
      clearText={clearText}
      openText={openText}
      closeText={closeText}
      style={useBootstrapStyle ? { ...style, marginBottom: "1rem", marginTop: "2rem" } : style}
      className={className}
      autoSelect={autoSelect}
      autoHighlight={autoHighlight}
      onBlur={() => {
        if (onBlur) {
          onBlur();
        }
        field.onBlur();
        if (multiple) {
          setInputValue("");
        }
      }}
      onChange={(_e, value) => {
        const optionsArray = value ? (Array.isArray(value) ? value : [value]) : undefined;
        const values = convertAutoCompleteOptionsToStringArray(optionsArray);
        const finalValue = multiple ? values : values[0];
        setSelectedOptions(optionsArray ?? defaultOptions);

        clearErrors(field.name);
        if (onChange) {
          onChange(finalValue);
        }

        field.onChange(finalValue);
        if (!disableCloseOnSelect) {
          setInputValue("");
        }
      }}
      onInputChange={(_e, query, reason) => {
        if (reason === "input") {
          setInputValue(query);
        }
        if (onInputChange) {
          onInputChange(query);
        }
      }}
      openOnFocus={openOnFocus}
      onClose={readOnly ? undefined : onClose}
      onOpen={readOnly ? undefined : onOpen}
      groupBy={useGroupBy ? groupOptions : undefined}
      renderOption={highlightOptions ? renderHighlightedOptionFunction : undefined}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{ ...(useBootstrapStyle && bootstrapStyle) }}
          variant={variant}
          error={hasError}
          label={finalLabel}
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
                  {loading ? (
                    <InputAdornment position="end">
                      <CircularProgress color="inherit" size={20} />
                    </InputAdornment>
                  ) : (
                    endAdornment && <InputAdornment position="end">{endAdornment}</InputAdornment>
                  )}
                  {loadMoreOptions && !!pageSize && !!limitResults && (
                    <IconButton
                      title={paginationText ?? `Load ${limitResults} more`}
                      size="small"
                      onClick={() => {
                        const nextChunk = options.slice(pageSize, pageSize + limitResults);
                        setPageSize(pageSize + nextChunk.length);
                        setLoadMoreOptions(pageSize + nextChunk.length < options.length);
                      }}
                    >
                      {paginationIcon ?? <DownloadingSharpIcon fontSize="small" />}
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

export { AsyncTypeaheadInput, AsyncTypeaheadInputProps };
