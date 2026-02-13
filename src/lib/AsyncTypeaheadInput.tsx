/* eslint-disable max-lines */
import { useEffect, useMemo, useState, MutableRefObject, useImperativeHandle } from "react";
import { FieldValues, useController } from "react-hook-form";
import { AsyncTypeaheadAutocompleteProps, CommonTypeaheadProps, TypeaheadOption, TypeaheadOptions } from "./types/Typeahead";
import Autocomplete from "@mui/material/Autocomplete";
import {
  convertAutoCompleteOptionsToStringArray,
  createTagRenderer,
  getOptionsFromValue,
  groupOptions,
  isDisabledGroup,
  renderHighlightedOptionFunction,
  resolveInputValue,
  validateFixedOptions,
} from "./helpers/typeahead";
import { useDebounceHook } from "./hooks/useDebounceHook";
import { useSafeNameId } from "./hooks/useSafeNameId";
import { useFormContext } from "./context/FormContext";
import { TypeaheadTextField } from "./components/Typeahead/TypeaheadTextField";
import { FormGroupLayout } from "./FormGroupLayout";
import { LabelValueOption } from "./types/LabelValueOption";
import { TypeaheadFitMenuPopper } from "./components/Typeahead/TypeaheadFitMenuPopper";

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

// eslint-disable-next-line complexity
const AsyncTypeaheadInput = <T extends FieldValues>(props: AsyncTypeaheadInputProps<T>) => {
  const {
    inputRef,
    innerRef,
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
    fixedOptions,
    withFixedOptionsInValue = true,
    fitMenuContent,
  } = props;

  const [options, setOptions] = useState<TypeaheadOptions>(defaultOptions);
  const [value, setValue] = useState<TypeaheadOptions>(defaultSelected);
  const [page, setPage] = useState(1);
  const [loadMoreOptions, setLoadMoreOptions] = useState(limitResults !== undefined && limitResults < defaultOptions.length);
  const { name, id } = useSafeNameId(props.name ?? "", props.id);
  const { setDebounceSearch, isLoading } = useDebounceHook(queryFn, setOptions);
  const { control, disabled: formDisabled, getFieldState, setValue: setFormValue } = useFormContext();

  validateFixedOptions(fixedOptions, multiple, autocompleteProps, withFixedOptionsInValue, value);

  const {
    field: { ref, ...field },
  } = useController({
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
    () => (limitResults === undefined ? options : options.slice(0, page * limitResults)),
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
      updateValues: (options: TypeaheadOptions) => {
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
        slots={{
          popper: fitMenuContent ? TypeaheadFitMenuPopper : undefined,
          ...autocompleteProps?.slots,
        }}
        id={id}
        multiple={multiple}
        loading={isLoading}
        options={paginatedOptions}
        value={resolveInputValue(multiple, fixedOptions, withFixedOptionsInValue, value)}
        filterSelectedOptions={autocompleteProps?.filterSelectedOptions ?? multiple}
        filterOptions={(currentOptions) => currentOptions}
        isOptionEqualToValue={
          autocompleteProps?.isOptionEqualToValue ??
          ((option, value) => (typeof option === "string" ? option === value : option.value === (value as LabelValueOption).value))
        }
        getOptionKey={
          autocompleteProps?.getOptionKey ??
          ((option: TypeaheadOption) => (typeof option === "string" ? option : `${option.label}-${option.value ?? ""}`))
        }
        getOptionLabel={(option: TypeaheadOption) => (typeof option === "string" ? option : option.label)}
        getOptionDisabled={(option) =>
          getOptionDisabled?.(option) ||
          (useGroupBy && isDisabledGroup(option)) ||
          (typeof option === "string" ? false : (option.disabled ?? false))
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
          // value is typed as Autocomplete<Value> (aka TypeaheadOption) or an array of Autocomplete<Value> (aka TypeaheadOption[])
          // however, the component is not intended to be used with mixed types
          const optionsArray = getOptionsFromValue(value, fixedOptions, withFixedOptionsInValue);
          setValue(optionsArray ?? []);
          const values = convertAutoCompleteOptionsToStringArray(optionsArray);
          const finalValue = multiple ? values : values[0];
          if (onChange) {
            onChange(finalValue);
          }
          field.onChange(finalValue);
        }}
        onInputChange={(_e, query, reason) => {
          if (reason === "blur" || reason === "clear" || (reason === "selectOption" && !autocompleteProps?.disableCloseOnSelect)) {
            setOptions([]);
            setPage(1);
          } else if (reason === "input") {
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
            placeholder={multiple && value.length > 0 ? undefined : placeholder}
            paginationIcon={paginationIcon}
            paginationText={paginationText}
            variant={variant}
            limitResults={limitResults}
            loadMoreOptions={loadMoreOptions}
            setPage={setPage}
            {...params}
            inputRef={(elem) => {
              if (innerRef) {
                innerRef.current = elem as HTMLInputElement;
              }
              ref(elem);
            }}
          />
        )}
        renderTags={createTagRenderer(fixedOptions, autocompleteProps)}
      />
    </FormGroupLayout>
  );
};

export { AsyncTypeaheadInput, AsyncTypeaheadInputProps, AsyncTypeaheadInputRef };
