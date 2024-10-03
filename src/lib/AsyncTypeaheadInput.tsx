import { useRef, useState } from "react";
import { AsyncTypeahead, UseAsyncProps } from "react-bootstrap-typeahead";
import { Controller, FieldError, FieldValues, get } from "react-hook-form";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { FormGroupLayout } from "./FormGroupLayout";
import { convertTypeaheadOptionsToStringArray } from "./helpers/typeahead";
import { CommonTypeaheadProps, TypeaheadOptions } from "./types/Typeahead";
import { useMarkOnFocusHandler } from "./hooks/useMarkOnFocusHandler";
import { useFormContext } from "./context/FormContext";
import TypeheadRef from "react-bootstrap-typeahead/types/core/Typeahead";

interface AsyncTypeaheadProps<T extends FieldValues> extends CommonTypeaheadProps<T> {
  queryFn: (query: string) => Promise<TypeaheadOptions>;
  reactBootstrapTypeaheadProps?: Partial<UseAsyncProps>;
}

const AsyncTypeaheadInput = <T extends FieldValues>(props: AsyncTypeaheadProps<T>) => {
  const {
    disabled,
    label,
    helpText,
    labelToolTip,
    defaultSelected,
    reactBootstrapTypeaheadProps,
    onChange,
    onInputChange,
    markAllOnFocus,
    addonLeft,
    addonRight,
    className = "",
    style,
    emptyLabel,
    placeholder,
    multiple,
    invalidErrorMessage,
    hideValidationMessage = false,
    inputRef,
  } = props;
  const { name, id } = useSafeNameId(props.name, props.id);
  const ref = useRef<TypeheadRef | null>(null);

  const {
    control,
    disabled: formDisabled,
    formState: { errors },
    setError,
    clearErrors,
    getValues,
    getFieldState,
  } = useFormContext();
  const fieldError = get(errors, name) as FieldError | undefined;
  const hasError = !!fieldError;
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<TypeaheadOptions>([]);
  const focusHandler = useMarkOnFocusHandler(markAllOnFocus);

  const isDisabled = formDisabled || disabled;

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        validate: {
          required: () => getFieldState(name)?.error?.message,
        },
      }}
      render={({ field, fieldState: { error } }) => (
        <FormGroupLayout
          helpText={helpText}
          name={name}
          id={id}
          label={label}
          labelToolTip={labelToolTip}
          addonLeft={addonLeft}
          addonRight={addonRight}
          addonProps={{
            isDisabled,
          }}
          inputGroupStyle={props.inputGroupStyle}
          hideValidationMessage={hideValidationMessage}
        >
          <AsyncTypeahead
            {...field}
            id={id}
            ref={(elem) => {
              ref.current = elem;
              if (inputRef) {
                inputRef.current = elem;
              }
            }}
            multiple={multiple}
            defaultSelected={defaultSelected}
            isInvalid={hasError}
            onChange={(e) => {
              const values = convertTypeaheadOptionsToStringArray(e);
              const finalValue = multiple ? values : values[0];
              clearErrors(name);

              if (onChange) {
                onChange(finalValue);
              }

              field.onChange(finalValue);

              // if not multiple, clear options to prevent the dropdown from showing multiple again when activating
              if (!multiple) setOptions([]);
            }}
            onInputChange={onInputChange}
            className={`${className} ${error ? "is-invalid" : ""}`}
            inputProps={{ id }}
            isLoading={isLoading}
            options={options}
            filterBy={() => true}
            onSearch={(query) => {
              void (async () => {
                setIsLoading(true);
                const results = await props.queryFn(query);
                setOptions(results);
                setIsLoading(false);
              })();
            }}
            onBlur={() => {
              if (options.length === 1 && ref.current?.state.text.length) {
                ref.current?.setState({
                  selected: [...(ref.current?.state.selected ?? []), ...options],
                  text: "",
                  showMenu: false,
                });

                const newValue = typeof options[0] == "string" ? options[0] : options[0].value;
                if (multiple) {
                  field.onChange([...((getValues(name) as [] | undefined) ?? []), newValue]);
                } else {
                  field.onChange(newValue);
                }
                clearErrors(name);
              } else if (ref.current?.state.text.length && (!!multiple || !ref.current?.state.selected.length)) {
                // only set error if the text is not empty and the typeahead is multiple or the selected array is empty (for single select, if the selected array is not empty, it means the user has already selected an option)
                setError(name, { message: invalidErrorMessage ?? "Invalid Input" });
              } else {
                clearErrors(name);
              }
            }}
            disabled={isDisabled}
            onFocus={(event) => {
              focusHandler?.(event);
            }}
            {...reactBootstrapTypeaheadProps}
            style={style}
            emptyLabel={emptyLabel}
            placeholder={placeholder}
          />
        </FormGroupLayout>
      )}
    />
  );
};

export { AsyncTypeaheadInput, AsyncTypeaheadProps };
