/* eslint-disable max-lines */
import { useEffect, useMemo, useState } from "react";
import { FieldValues, Controller, Path, PathValue } from "react-hook-form";
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
  combineOptions,
  validateFixedOptions,
  createTagRenderer,
  resolveInputValue,
  getOptionsFromValue,
} from "./helpers/typeahead";
import { TypeaheadTextField } from "./components/Typeahead/TypeaheadTextField";
import { FormGroupLayout } from "./FormGroupLayout";
import { LabelValueOption } from "./types/LabelValueOption";

interface StaticTypeaheadInputProps<T extends FieldValues> extends CommonTypeaheadProps<T> {
  options: TypeaheadOptions;
  isLoading?: boolean;
  autocompleteProps?: StaticTypeaheadAutocompleteProps;
}

const AutoComplete = <T extends FieldValues>(props: StaticTypeaheadInputProps<T>) => {
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
    innerRef,
    name,
    id,
  } = props;

  const [page, setPage] = useState(1);
  const [loadMoreOptions, setLoadMoreOptions] = useState(limitResults !== undefined && limitResults < options.length);

  const { control, disabled: formDisabled, clearErrors, setValue } = useFormContext<T>();

  const isDisabled = useMemo(() => formDisabled || disabled, [formDisabled, disabled]);
  const paginatedOptions = useMemo(
    () => (limitResults === undefined ? options : options.slice(0, page * limitResults)),
    [limitResults, page, options],
  );

  // Validate fixed options upfront
  useEffect(() => {
    validateFixedOptions(fixedOptions, multiple, autocompleteProps, withFixedOptionsInValue, []);
  }, [fixedOptions, multiple, autocompleteProps, withFixedOptionsInValue]);

  useEffect(() => {
    if (limitResults !== undefined) {
      setLoadMoreOptions(page * limitResults < options.length);
    }
  }, [options, page, limitResults]);

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: {
          required: () => {
            const fieldState = control.getFieldState(name);
            return fieldState?.error?.message;
          },
        },
      }}
      render={({ field }) => {
        const fieldValue = field.value;
        const value = multiple
          ? getMultipleAutoCompleteValue(combineOptions(options, fixedOptions), fieldValue as string[] | number[] | undefined)
          : getSingleAutoCompleteValue(options, fieldValue as string | number | undefined);

        return (
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
            value={resolveInputValue(multiple, fixedOptions, withFixedOptionsInValue, value)}
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
            onChange={(_, selectedValue) => {
              const optionsArray = getOptionsFromValue(selectedValue, fixedOptions, withFixedOptionsInValue);
              const values = convertAutoCompleteOptionsToStringArray(optionsArray);
              const finalValue = multiple ? values : values[0];
              clearErrors(field.name);
              if (onChange) {
                onChange(finalValue);
              }
              setValue(field.name, finalValue as PathValue<T, Path<T>>, { shouldValidate: true });
            }}
            onInputChange={(_e, value, reason) => {
              onInputChange?.(value, reason);
            }}
            renderOption={highlightOptions ? renderHighlightedOptionFunction : undefined}
            renderInput={(params) => (
              <TypeaheadTextField
                {...params}
                isLoading={isLoading}
                name={name}
                label={label}
                addonLeft={addonLeft}
                addonRight={addonRight}
                addonProps={{ isDisabled }}
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
                inputRef={(elem) => {
                  if (innerRef) innerRef.current = elem as HTMLInputElement;
                  field.ref(elem);
                }}
              />
            )}
            renderTags={createTagRenderer(fixedOptions, autocompleteProps)}
          />
        );
      }}
    />
  );
};

const StaticTypeaheadInput = <T extends FieldValues>(props: StaticTypeaheadInputProps<T>) => {
  const { label, useBootstrapStyle = false } = props;
  const { name, id } = useSafeNameId(props.name ?? "", props.id);

  return (
    <FormGroupLayout
      name={name}
      label={useBootstrapStyle ? label : undefined}
      labelStyle={useBootstrapStyle ? { color: "#8493A5", fontSize: 14 } : undefined}
      layout="muiInput"
    >
      <AutoComplete<T> {...props} id={id} name={props.name} />
    </FormGroupLayout>
  );
};

export { StaticTypeaheadInput, StaticTypeaheadInputProps };
