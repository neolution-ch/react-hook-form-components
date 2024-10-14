import { Typeahead } from "react-bootstrap-typeahead";
import { TypeaheadComponentProps } from "react-bootstrap-typeahead/types/components/Typeahead";
import TypeheadRef from "react-bootstrap-typeahead/types/core/Typeahead";
import { Controller, ControllerRenderProps, FieldError, FieldValues, get } from "react-hook-form";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { FormGroupLayout } from "./FormGroupLayout";
import { convertTypeaheadOptionsToStringArray, renderMenu } from "./helpers/typeahead";
import { CommonTypeaheadProps, TypeaheadOptions } from "./types/Typeahead";
import { useMarkOnFocusHandler } from "./hooks/useMarkOnFocusHandler";
import { useFormContext } from "./context/FormContext";
import { useRef } from "react";
import { LabelValueOption } from "./types/LabelValueOption";

type StaticTypeaheadInputProps<T extends FieldValues> = CommonTypeaheadProps<T> & {
  options: TypeaheadOptions;
  reactBootstrapTypeaheadProps?: Partial<TypeaheadComponentProps>;
}

const StaticTypeaheadInput = <T extends FieldValues>(props: StaticTypeaheadInputProps<T>) => {
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
    style,
    className = "",
    emptyLabel,
    placeholder,
    multiple,
    invalidErrorMessage,
    hideValidationMessage = false,
    inputRef,
    useGroupBy = false,
  } = props;
  const { name, id } = useSafeNameId(props?.name ?? "", props.id);
  const {
    control,
    disabled: formDisabled,
    formState: { errors },
    setError,
    clearErrors,
    getValues,
    getFieldState,
  } = useFormContext();
  const focusHandler = useMarkOnFocusHandler(markAllOnFocus);
  const ref = useRef<TypeheadRef | null>(null);
  const fieldError = get(errors, name) as FieldError | undefined;
  const hasError = !!fieldError;
  const handleOnBlur = (field: ControllerRenderProps<FieldValues, string>) => {
    const innerText = ref.current?.state.text;
    // only check if the text is not empty and the typeahead is multiple or the selected array is empty (for single select, if the selected array is not empty, it means the user has already selected an option)
    if (innerText && (!!multiple || !ref.current?.state.selected.length)) {
      const isMatchingOption = (option: string | LabelValueOption) => {
        const text = reactBootstrapTypeaheadProps?.caseSensitive ? innerText : innerText.toUpperCase();
        let label = typeof option === "string" ? option : option.label;
        label = reactBootstrapTypeaheadProps?.caseSensitive ? label : label.toUpperCase();
        const value = typeof option === "string" ? option : option.value;
        return !ref.current?.state.selected.find((x) => (typeof x === "string" ? x : x.value) === value) && label.includes(text);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const matchingOptions = (props.options as any).filter((o: string | LabelValueOption) => isMatchingOption(o)) as TypeaheadOptions;
      if (matchingOptions.length === 1) {
        ref.current?.setState({
          selected: [...(ref.current?.state.selected ?? []), ...matchingOptions],
          text: "",
          showMenu: false,
        });

        const newValue = typeof matchingOptions[0] == "string" ? matchingOptions[0] : matchingOptions[0].value;
        if (multiple) {
          field.onChange([...((getValues(name) as [] | undefined) ?? []), newValue]);
        } else {
          field.onChange(newValue);
        }
        clearErrors(name);
      } else {
        setError(name, { message: invalidErrorMessage ?? "Invalid Input" });
      }
    } else {
      clearErrors(name);
    }
  };

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
          <Typeahead
            {...field}
            ref={(elem) => {
              ref.current = elem;
              if (inputRef) {
                inputRef.current = elem;
              }
            }}
            defaultSelected={defaultSelected}
            multiple={multiple}
            style={style}
            isInvalid={hasError}
            onChange={(options) => {
              const values = convertTypeaheadOptionsToStringArray(options);
              const finalValue = props.multiple ? values : values[0];
              clearErrors(name);

              if (onChange) {
                onChange(finalValue);
              }

              field.onChange(finalValue);
            }}
            onInputChange={onInputChange}
            onBlur={() => handleOnBlur(field)}
            id={id}
            options={props.options}
            className={`${className} ${error ? "is-invalid" : ""}`}
            inputProps={{ id }}
            disabled={isDisabled}
            onFocus={focusHandler}
            emptyLabel={emptyLabel}
            placeholder={placeholder}
            {...reactBootstrapTypeaheadProps}
            renderMenu={useGroupBy ? (results, menuProps) => renderMenu(results as LabelValueOption[], menuProps) : undefined}
          />
        </FormGroupLayout>
      )}
    />
  );
};

export { StaticTypeaheadInput, StaticTypeaheadInputProps };
