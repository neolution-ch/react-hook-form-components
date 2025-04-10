/* eslint-disable max-lines */
import { useEffect, useMemo, useState, MutableRefObject, useImperativeHandle } from "react";
import { FieldValues, useController } from "react-hook-form";
import { AsyncTypeaheadAutocompleteProps, CommonTypeaheadProps, TypeaheadOption, TypeaheadOptions } from "./types/Typeahead";
import Autocomplete from "@mui/material/Autocomplete";
import {
  convertAutoCompleteOptionsToStringArray,
  groupOptions,
  isDisabledGroup,
  renderHighlightedOptionFunction,
} from "./helpers/typeahead";
import { useDebounceHook } from "./hooks/useDebounceHook";
import { useSafeNameId } from "./hooks/useSafeNameId";
import { useFormContext } from "./context/FormContext";
import { TypeaheadTextField } from "./components/Typeahead/TypeaheadTextField";
import { FormGroupLayout } from "./FormGroupLayout";
import { LabelValueOption } from "./types/LabelValueOption";

interface AsyncTypeaheadInputRef {
  resetValues: () => void;
  clearValues: () => void;
  updateValues: (values: TypeaheadOptions) => void;
}

interface AsyncTypeaheadInputProps<T extends FieldValues> extends CommonTypeaheadProps<T> {
  queryFn: (query: string) => Promise<TypeaheadOptions>;
  delay?: number;
  defaultOptions?: TypeaheadOptions;
  defaultSelected?: TypeaheadOptions;
  inputRef?: MutableRefObject<AsyncTypeaheadInputRef | null>;
  autocompleteProps?: AsyncTypeaheadAutocompleteProps;
}

const AsyncTypeaheadInput = <T extends FieldValues>(props: AsyncTypeaheadInputProps<T>) => {
  const {
    inputRef,
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
    defaultSelected = [],
    limitResults,
    paginationText,
    paginationIcon,
    useBootstrapStyle = false,
    autocompleteProps,
  } = props;

  const [options, setOptions] = useState<TypeaheadOption[]>(defaultOptions);
  const [value, setValue] = useState<TypeaheadOption[]>(defaultSelected);
  const [page, setPage] = useState(1);
  const [loadMoreOptions, setLoadMoreOptions] = useState(limitResults !== undefined && limitResults < defaultOptions.length);
  const { name, id } = useSafeNameId(props.name ?? "", props.id);
  const { setDebounceSearch, isLoading } = useDebounceHook(queryFn, setOptions);
  const { control, disabled: formDisabled, getFieldState, setValue: setFormValue } = useFormContext();

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

  useImperativeHandle(
    inputRef,
    () => ({
      clearValues: () => {
        setValue([]);
        setFormValue(name, undefined);
      },
      resetValues: () => {
        setValue(defaultSelected);
        setFormValue(
          name,
          defaultSelected.map((x) => (typeof x === "string" ? x : x.value)),
        );
      },
      updateValues: (options: TypeaheadOption[]) => {
        const values = convertAutoCompleteOptionsToStringArray(options);
        const finalValue = multiple ? values : values[0];
        setValue(options);
        setFormValue(name, finalValue);
      },
    }),
    [setFormValue, name, defaultSelected, multiple],
  );

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
      layout="muiInput"
    >
      <Autocomplete<TypeaheadOption, boolean, boolean, boolean>
        {...autocompleteProps}
        {...field}
        id={id}
        multiple={multiple}
        loading={isLoading}
        options={paginatedOptions}
        value={(multiple ? value : value[0]) || null}
        filterSelectedOptions={autocompleteProps?.filterSelectedOptions ?? multiple}
        filterOptions={(currentOptions) => currentOptions}
        isOptionEqualToValue={(option, value) => typeof option === "string" ? option === value : option.value === (value as LabelValueOption).value}
        getOptionKey={
          autocompleteProps?.getOptionKey ??
          ((option: TypeaheadOption) => (typeof option === "string" ? option : `${option.label}-${option.value ?? ""}`))
        }
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
          setValue(optionsArray ?? []);
          const values = convertAutoCompleteOptionsToStringArray(optionsArray);
          const finalValue = multiple ? values : values[0];
          if (onChange) {
            onChange(finalValue);
          }
          field.onChange(finalValue);
        }}
        onInputChange={(_e, query, reason) => {
          if (reason == "blur" || reason == "clear" || (reason == "selectOption" && !autocompleteProps?.disableCloseOnSelect)) {
            setOptions([]);
            setPage(1);
          } else if (reason == "input") {
            setDebounceSearch({ delay, query });
          }
          if (onInputChange) {
            onInputChange(query, reason);
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

export { AsyncTypeaheadInput, AsyncTypeaheadInputProps, AsyncTypeaheadInputRef };
