import {
  CSSProperties,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FieldError, FieldValues, useController, get } from "react-hook-form";
import { CommonTypeaheadProps, TypeaheadOption } from "./types/Typeahead";
import { useFormContext } from "react-hook-form";
import { LabelValueOption } from "./types/LabelValueOption";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Chip, FormControl, InputLabel } from "@mui/material";
import {
  BootstrapInput,
  convertAutoCompleteOptionsToStringArray,
  getMultipleAutoCompleteValue,
  getSingleAutoCompleteValue,
  groupOptions,
  isDisabledGroup,
} from "./helpers/typeahead";
import InputAdornment from "@mui/material/InputAdornment";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import { debounce } from "@mui/material/utils";
import CircularProgress from "@mui/material/CircularProgress";
import { useDebounceHook } from "./helpers/useDebounceHook";

interface UseSafeNameIdResult {
  name: string;
  id: string;
}

const useSafeNameId = <T extends FieldValues>(
  name: keyof T,
  id?: string
): UseSafeNameIdResult => {
  const safeName = String(name);
  const safeId = id || safeName;

  return {
    name: safeName,
    id: safeId,
  };
};

// common input props
interface DefaultAddonProps {
  isDisabled?: boolean;
}
export type MergedAddonProps<TRenderAddon> = TRenderAddon & DefaultAddonProps;

interface AsyncTypeAheadInputProps<
  T extends FieldValues,
  TRenderAddon = unknown
> extends CommonTypeaheadProps<T> {
  queryFn: (query: string) => Promise<TypeaheadOption[]>;
  onQueryError?: (error: unknown) => void;
  delay?: number;
  loadingText?: string;
  addonProps?: MergedAddonProps<TRenderAddon>;
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
  >;

  // common input props
  addonLeft?: React.ReactNode;
  addonRight?: React.ReactNode;
  markAllOnFocus?: boolean;
  disabled?: boolean;
  label?: string;
  helpText?: string;
  style?: CSSProperties;
  className?: React.HTMLAttributes<T>["className"];
  hideValidationMessage?: boolean;
}

const AutoCompleteInternal = <T extends FieldValues, TRenderAddon = unknown>(
  props: AsyncTypeAheadInputProps<T, TRenderAddon>
) => {
  const {
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
    autocompleteProps,
    highlightOptions = true,
    useBootstrapStyle,
    loadingText,
    queryFn,
    delay = 200,
  } = props;

  const [options, setOptions] = useState<TypeaheadOption[]>([]);

  const { name, id } = useSafeNameId(props?.name ?? "", props.id);
  const {
    control,
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

  const fieldError = get(errors, name) as FieldError | undefined;
  const hasError = !!fieldError;
  const errorMessage = String(fieldError?.message);

  // autocomplete requires consistency between the form value and the options types
  const fieldValue = watch(name);

  const value = useMemo(() => {
    if (fieldValue == undefined) {
      return undefined;
    }
    const formValue = fieldValue as string | string[];
    return typeof formValue === "string"
      ? getSingleAutoCompleteValue(options, formValue)
      : getMultipleAutoCompleteValue(options, formValue);
  }, [fieldValue]);

  const startAdornment = useMemo(
    () =>
      addonLeft instanceof Function && addonProps
        ? (addonLeft as unknown as (props: TRenderAddon) => ReactNode)(
            addonProps
          )
        : (addonLeft as ReactNode),
    [addonLeft, addonProps]
  );

  const endAdornment = useMemo(
    () =>
      addonRight instanceof Function && addonProps
        ? (addonRight as unknown as (props: TRenderAddon) => ReactNode)(
            addonProps
          )
        : (addonRight as ReactNode),
    [addonRight, addonProps]
  );

  const { setDebounceSearch, loading } = useDebounceHook(queryFn, setOptions);

  return (
    <Autocomplete<TypeaheadOption, boolean, boolean, boolean>
      {...autocompleteProps}
      {...field}
      id={id}
      multiple={multiple}
      disableCloseOnSelect={!!multiple}
      loading={loading}
      loadingText={loadingText}
      options={options}
      filterOptions={(x) => x}
      filterSelectedOptions
      getOptionLabel={(option: TypeaheadOption) =>
        typeof option === "string" ? option : option.label
      }
      value={value || (multiple ? [] : null)}
      getOptionDisabled={
        getOptionDisabled || useGroupBy
          ? (option) =>
              (getOptionDisabled?.(option) ||
                (useGroupBy && isDisabledGroup(option))) ??
              false
          : undefined
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
      onInputChange={(_e, query, reason) => {
        setDebounceSearch({ delay, query });
        if (!query || query === "") {
          setOptions([]);
        } else if (reason !== "selectOption") {
          setOptions([]);
          setDebounceSearch({ delay, query });
        }
      }}
      renderOption={
        highlightOptions
          ? (props, option, { inputValue }) => {
              const { key, ...optionProps } = props;
              const finalOption =
                typeof option === "string" ? option : option.label;
              const matches = match(finalOption, inputValue, {
                insideWords: true,
              });
              const parts = parse(finalOption, matches);
              return (
                <li key={key} {...optionProps}>
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
      renderInput={(params) => {
        return useBootstrapStyle ? (
          <FormControl variant="standard">
            <InputLabel shrink htmlFor="bootstrap-input">
              {label}
            </InputLabel>
            <BootstrapInput
              {...params}
              ref={params.InputProps.ref}
              defaultValue="react-bootstrap"
              id="bootstrap-input"
            />
          </FormControl>
        ) : (
          <TextField
            {...params}
            variant={variant}
            error={hasError}
            label={label}
            helperText={
              hasError && !hideValidationMessage ? errorMessage : helpText
            }
            placeholder={placeholder}
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
                endAdornment: (
                  <>
                    {loading ? (
                      <InputAdornment position="start">
                        <CircularProgress color="inherit" size={20} />
                      </InputAdornment>
                    ) : (
                      endAdornment && (
                        <InputAdornment position="start">
                          {endAdornment}
                        </InputAdornment>
                      )
                    )}
                    {params.InputProps.endAdornment}
                  </>
                ),
              },
            }}
          />
        );
      }}
    />
  );
};

const AsyncTypeAheadInput = <T extends FieldValues>(
  props: AsyncTypeAheadInputProps<T>
) => {
  const { id } = useSafeNameId(props?.name ?? "", props.id);
  return <AutoCompleteInternal id={id} {...props} />;
};

export { AsyncTypeAheadInput, AsyncTypeAheadInputProps };
