/* eslint-disable max-lines */
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
  getOptionLabel,
  getOptionValue,
  combineOptions,
} from "./helpers/typeahead";
import { TypeaheadTextField } from "./components/Typeahead/TypeaheadTextField";
import { FormGroupLayout } from "./FormGroupLayout";
import { LabelValueOption } from "./types/LabelValueOption";
import { Chip } from "@mui/material";

interface StaticTypeaheadInputProps<T extends FieldValues> extends CommonTypeaheadProps<T> {
  options: TypeaheadOptions;
  isLoading?: boolean;
  autocompleteProps?: StaticTypeaheadAutocompleteProps;
}

// eslint-disable-next-line complexity
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
    fixedOptions,
    withFixedOptionsInValue = true,
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
    () => (limitResults === undefined ? options : options.slice(0, page * limitResults)),
    [limitResults, page, options],
  );

  const fieldValue = watch(name) as string | number | string[] | number[] | undefined;
  const value = useMemo(
    () =>
      multiple
        ? getMultipleAutoCompleteValue(combineOptions(options, fixedOptions), fieldValue as string[] | number[] | undefined)
        : getSingleAutoCompleteValue(options, fieldValue as string | number | undefined),
    [fieldValue, multiple, options, fixedOptions],
  );

  // If fixedOptions are provided, ensure they are used with multiple typeahead inputs
  if (fixedOptions && !multiple) {
    throw new Error("Fixed options can only be used with multiple typeahead inputs.");
  }

  if (fixedOptions && withFixedOptionsInValue && fixedOptions.some((option) => getSingleAutoCompleteValue(value, option).length === 0)) {
    throw new Error("Fixed options must be included in the value if withFixedOptionsInValue is true.");
  }

  if (fixedOptions && !withFixedOptionsInValue && fixedOptions.some((option) => getSingleAutoCompleteValue(value, option).length > 0)) {
    throw new Error("Fixed options must not be included in the value if withFixedOptionsInValue is false.");
  }

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
        groupBy={useGroupBy ? groupOptions : undefined}
        options={useGroupBy ? sortOptionsByGroup(paginatedOptions) : paginatedOptions}
        isOptionEqualToValue={
          autocompleteProps?.isOptionEqualToValue ??
          ((option, value) => (typeof option === "string" ? option === value : option.value === (value as LabelValueOption).value))
        }
        getOptionKey={
          autocompleteProps?.getOptionKey ??
          ((option: TypeaheadOption) => (typeof option === "string" ? option : `${option.label}-${option.value ?? ""}`))
        }
        disableCloseOnSelect={multiple}
        value={(multiple ? (fixedOptions && !withFixedOptionsInValue ? combineOptions(fixedOptions, value) : value) : value[0]) || null}
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
          // value is typed as Autocomplete<Value> (aka TypeaheadOption) or an array of Autocomplete<Value> (aka TypeaheadOption[])
          // however, the component is not intended to be used with mixed types
          const optionsArray = value ? ((Array.isArray(value) ? value : [value]) as TypeaheadOptions) : undefined;
          const values = convertAutoCompleteOptionsToStringArray(optionsArray);
          const finalValue = multiple
            ? fixedOptions
              ? withFixedOptionsInValue
                ? [...convertAutoCompleteOptionsToStringArray(fixedOptions), ...values].filter(
                    (option, i, options) => options.indexOf(option) === i,
                  )
                : values.filter((option) => !fixedOptions.some((fixedOption) => getOptionValue(fixedOption) === option))
              : values
            : values[0];
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
            placeholder={multiple && value.length > 0 ? undefined : placeholder}
            paginationIcon={paginationIcon}
            paginationText={paginationText}
            variant={variant}
            limitResults={limitResults}
            loadMoreOptions={loadMoreOptions}
            setPage={setPage}
            {...params}
          />
        )}
        renderTags={
          fixedOptions
            ? (tagValue, getTagProps) =>
                tagValue.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  const optionValue = getOptionValue(option);
                  return (
                    <Chip
                      key={key}
                      label={getOptionLabel(option)}
                      {...tagProps}
                      disabled={getSingleAutoCompleteValue(fixedOptions, optionValue).length > 0}
                    />
                  );
                })
            : undefined
        }
      />
    </FormGroupLayout>
  );
};

export { StaticTypeaheadInput, StaticTypeaheadInputProps };
