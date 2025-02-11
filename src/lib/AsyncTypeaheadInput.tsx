import { useEffect, useMemo, useState, useRef } from "react";
import { FieldValues, useController } from "react-hook-form";
import { AsyncTypeaheadAutocompleteProps, CommonTypeaheadProps, TypeaheadOption } from "./types/Typeahead";
import Autocomplete from "@mui/material/Autocomplete";
import {
  convertAutoCompleteOptionsToStringArray,
  getMultipleAutoCompleteValue,
  getSingleAutoCompleteValue,
  groupOptions,
  isDisabledGroup,
  renderHighlightedOptionFunction,
} from "./helpers/typeahead";
import { useDebounceHook } from "./hooks/useDebounceHook";
import { useSafeNameId } from "./hooks/useSafeNameId";
import { useFormContext } from "./context/FormContext";
import { TypeaheadTextField } from "./TypeaheadTextField";
import { FormGroupLayout } from "./FormGroupLayout";

interface AsyncTypeaheadInputProps<T extends FieldValues> extends CommonTypeaheadProps<T> {
  queryFn: (query: string) => Promise<TypeaheadOption[]>;
  delay?: number;
  defaultOptions?: TypeaheadOption[];
  autocompleteProps?: AsyncTypeaheadAutocompleteProps;
}

const AsyncTypeaheadInput = <T extends FieldValues>(props: AsyncTypeaheadInputProps<T>) => {
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
    markAllOnFocus,
    addonLeft,
    addonRight,
    style,
    inputGroupStyle,
    className,
    placeholder,
    useGroupBy = false,
    readOnly,
    highlightOptions = true,
    autoHighlight = true,
    autoSelect,
    queryFn,
    delay = 200,
    defaultOptions = [],
    limitResults,
    paginationText,
    paginationIcon,
    useBootstrapStyle = false,
    autocompleteProps,
  } = props;

  const [options, setOptions] = useState<TypeaheadOption[]>([]);
  const [value, setValue] = useState<TypeaheadOption[]>(defaultOptions);
  const [page, setPage] = useState(1);
  const [loadMoreOptions, setLoadMoreOptions] = useState(limitResults !== undefined && limitResults < defaultOptions.length);
  const watchFieldValue = useRef<boolean>(true);

  const { name, id } = useSafeNameId(props.name ?? "", props.id);
  const { setDebounceSearch, isLoading } = useDebounceHook(queryFn, setOptions);
  const { control, disabled: formDisabled, getFieldState, clearErrors, watch } = useFormContext();
  const { field } = useController({
    name,
    control,
    rules: {
      validate: {
        required: () => getFieldState(name)?.error?.message,
      },
    },
  });

  const isDisabled = useMemo(() => formDisabled || disabled, [formDisabled, disabled]);
  const paginatedOptions = useMemo(
    () => (limitResults !== undefined ? options.slice(0, page * limitResults) : options),
    [limitResults, page, options],
  );

  // listen to changes coming from the external consumer
  const fieldValue = watch(name) as string | string[] | undefined;
  useEffect(() => {
    if (watchFieldValue.current) {
      setValue(
        typeof fieldValue === "string"
          ? getSingleAutoCompleteValue(defaultOptions, fieldValue)
          : getMultipleAutoCompleteValue(defaultOptions, fieldValue),
      );
    } else {
      watchFieldValue.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldValue]);

  useEffect(() => {
    if (limitResults !== undefined) {
      setLoadMoreOptions(page * limitResults < options.length);
    }
  }, [options, page, limitResults]);

  return (
    <FormGroupLayout
      name={name}
      label={useBootstrapStyle ? label : undefined}
      labelStyle={useBootstrapStyle ? { color: "#8493A5", fontSize: 14 } : undefined}
      layout="typeahead"
    >
      <Autocomplete<TypeaheadOption, boolean, boolean, boolean>
        {...autocompleteProps}
        {...field}
        id={id}
        multiple={multiple}
        loading={isLoading}
        options={paginatedOptions}
        value={(multiple ? value : value[0]) || null}
        filterOptions={(currentOptions) => currentOptions}
        getOptionLabel={(option: TypeaheadOption) => (typeof option === "string" ? option : option.label)}
        getOptionDisabled={(option) =>
          getOptionDisabled?.(option) ||
          (useGroupBy && isDisabledGroup(option)) ||
          (typeof option == "string" ? false : option.disabled ?? false)
        }
        disabled={isDisabled}
        readOnly={readOnly}
        selectOnFocus={markAllOnFocus}
        style={inputGroupStyle}
        className={className}
        autoSelect={autoSelect ?? options.length === 1}
        autoHighlight={autoHighlight}
        onClose={readOnly ? undefined : onClose}
        onOpen={readOnly ? undefined : onOpen}
        groupBy={useGroupBy ? groupOptions : undefined}
        onBlur={() => {
          if (onBlur) {
            onBlur();
          }
          field.onBlur();
        }}
        onChange={(_e, value) => {
          const optionsArray = value ? (Array.isArray(value) ? value : [value]) : undefined;
          const values = convertAutoCompleteOptionsToStringArray(optionsArray);
          const finalValue = multiple ? values : values[0];
          clearErrors(field.name);
          if (onChange) {
            onChange(finalValue);
          }
          // do not trigger the effect for the value update
          watchFieldValue.current = false;
          setValue(optionsArray ?? []);
          field.onChange(finalValue);
        }}
        onInputChange={(_e, query, reason) => {
          if (reason == "blur" || reason == "clear" || (reason == "selectOption" && !autocompleteProps?.disableCloseOnSelect)) {
            setOptions([]);
            setPage(1);
          } else if (reason == "input") {
            setDebounceSearch({ delay, query, value });
          }
          if (onInputChange) {
            onInputChange(query);
          }
        }}
        renderOption={highlightOptions ? renderHighlightedOptionFunction : undefined}
        renderInput={(params) => (
          <TypeaheadTextField
            isLoading={isLoading}
            name={name}
            label={label}
            addonLeft={addonLeft}
            addonRight={addonRight}
            addonProps={{
              isDisabled,
            }}
            style={style}
            hideValidationMessage={hideValidationMessage}
            useBootstrapStyle={useBootstrapStyle}
            helpText={helpText}
            placeholder={placeholder}
            paginationIcon={paginationIcon}
            paginationText={paginationText}
            variant={variant}
            limitResults={limitResults}
            loadMoreOptions={loadMoreOptions}
            setPage={setPage}
            {...params}
          />
        )}
      />
    </FormGroupLayout>
  );
};

export { AsyncTypeaheadInput, AsyncTypeaheadInputProps };
