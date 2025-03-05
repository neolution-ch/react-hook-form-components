import { useEffect, useMemo, useState } from "react";
import { FieldValues, useController } from "react-hook-form";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { CommonTypeaheadProps, StaticTypeaheadAutocompleteProps, TypeaheadOption, TypeaheadOptions } from "./types/Typeahead";
import { useFormContext } from "./context/FormContext";
import Autocomplete from "@mui/material/Autocomplete";
import {
  convertAutoCompleteOptionsToStringArray,
  getMultipleAutoCompleteValue,
  getSingleAutoCompleteValue,
  isDisabledGroup,
  sortOptionsByGroup,
  groupOptions,
  renderHighlightedOptionFunction,
} from "./helpers/typeahead";
import { TypeaheadTextField } from "./TypeaheadTextField";
import { FormGroupLayout } from "./FormGroupLayout";

interface StaticTypeaheadInputProps<T extends FieldValues> extends CommonTypeaheadProps<T> {
  options: TypeaheadOptions;
  isLoading?: boolean;
  autocompleteProps?: StaticTypeaheadAutocompleteProps;
}

const StaticTypeaheadInput = <T extends FieldValues>(props: StaticTypeaheadInputProps<T>) => {
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
    paginationText,
    paginationIcon,
    limitResults,
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
    useBootstrapStyle = false,
    isLoading = false,
    autocompleteProps,
  } = props;

  const [page, setPage] = useState(1);
  const [loadMoreOptions, setLoadMoreOptions] = useState(limitResults !== undefined && limitResults < options.length);

  const { name, id } = useSafeNameId(props.name ?? "", props.id);
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

  const fieldValue = watch(name) as string | number | string[] | number[] | undefined;
  const value = useMemo(
    () =>
      !multiple
        ? getSingleAutoCompleteValue(options, fieldValue as string | number | undefined)
        : getMultipleAutoCompleteValue(options, fieldValue as string[] | number[] | undefined),
    [fieldValue, multiple, options],
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
      layout="typeahead"
    >
      <Autocomplete<TypeaheadOption, boolean, boolean, boolean>
        {...autocompleteProps}
        {...field}
        id={id}
        multiple={multiple}
        groupBy={useGroupBy ? groupOptions : undefined}
        options={useGroupBy ? sortOptionsByGroup(paginatedOptions) : paginatedOptions}
        getOptionKey={
          autocompleteProps?.getOptionKey ??
          ((option: TypeaheadOption) => (typeof option === "string" ? option : `${option.label}-${option.value ?? ""}`))
        }
        disableCloseOnSelect={multiple}
        value={(multiple ? value : value[0]) || null}
        getOptionLabel={(option: TypeaheadOption) => (typeof option === "string" ? option : option.label)}
        getOptionDisabled={(option) =>
          getOptionDisabled?.(option) ||
          (useGroupBy && isDisabledGroup(option)) ||
          (typeof option === "string" ? false : option.disabled ?? false)
        }
        disabled={isDisabled}
        readOnly={readOnly}
        selectOnFocus={markAllOnFocus}
        style={inputGroupStyle}
        className={className}
        autoSelect={autoSelect}
        autoHighlight={autoHighlight}
        onClose={readOnly ? undefined : onClose}
        onOpen={readOnly ? undefined : onOpen}
        onBlur={() => {
          if (onBlur) {
            onBlur();
          }
          field.onBlur();
        }}
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
        onInputChange={(_e, value, reason) => {
          if (onInputChange) {
            onInputChange(value, reason);
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

export { StaticTypeaheadInput, StaticTypeaheadInputProps };
