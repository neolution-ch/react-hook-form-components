import { Typeahead } from "react-bootstrap-typeahead";
import { TypeaheadComponentProps } from "react-bootstrap-typeahead/types/components/Typeahead";
import TypeheadRef from "react-bootstrap-typeahead/types/core/Typeahead";
import { Controller, ControllerRenderProps, FieldValues } from "react-hook-form";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { FormGroupLayout } from "./FormGroupLayout";
import { convertTypeaheadOptionsToStringArray } from "./helpers/typeahead";
import { CommonTypeaheadProps, TypeaheadOptions } from "./types/Typeahead";
import { useMarkOnFocusHandler } from "./hooks/useMarkOnFocusHandler";
import { useFormContext } from "./context/FormContext";
import { useRef } from "react";
import { LabelValueOption } from "./types/LabelValueOption";

interface StaticTypeaheadInputProps<T extends FieldValues> extends CommonTypeaheadProps<T> {
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
    markAllOnFocus,
    addonLeft,
    addonRight,
    style,
    className = "",
    emptyLabel,
    placeholder,
    multiple,
    invalidErrorMessage,
  } = props;
  const { name, id } = useSafeNameId(props.name, props.id);
  const { control, disabled: formDisabled, setError, clearErrors, getValues, getFieldState } = useFormContext();
  const focusHandler = useMarkOnFocusHandler(markAllOnFocus);
  const ref = useRef<TypeheadRef>(null);

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
        >
          <Typeahead
            {...field}
            ref={ref}
            defaultSelected={defaultSelected}
            multiple={multiple}
            style={style}
            onChange={(options) => {
              const values = convertTypeaheadOptionsToStringArray(options);
              const finalValue = props.multiple ? values : values[0];
              clearErrors(name);

              if (onChange) {
                onChange(finalValue);
              }

              field.onChange(finalValue);
            }}
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
          />
        </FormGroupLayout>
      )}
    />
  );
};

export { StaticTypeaheadInput, StaticTypeaheadInputProps };
