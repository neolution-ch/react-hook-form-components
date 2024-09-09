import { Typeahead } from "react-bootstrap-typeahead";
import { TypeaheadComponentProps } from "react-bootstrap-typeahead/types/components/Typeahead";
import TypeheadRef from "react-bootstrap-typeahead/types/core/Typeahead";
import { Controller, FieldValues } from "react-hook-form";
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
  const { control, disabled: formDisabled, setError, setValue, clearErrors, getValues, getFieldState } = useFormContext();
  const focusHandler = useMarkOnFocusHandler(markAllOnFocus);
  const ref = useRef<TypeheadRef>(null);

  const handleOnBlur = () => {
    const innerText = ref.current?.state.text;
    if (innerText) {
      const isMatchingOption = (option: string | LabelValueOption) => {
        const text = reactBootstrapTypeaheadProps?.caseSensitive ? innerText : innerText.toUpperCase();
        let label = typeof option === "string" ? option : option.label;
        label = reactBootstrapTypeaheadProps?.caseSensitive ? label : label.toUpperCase();
        return label.includes(text);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const matchingOptions = (props.options as any).filter((o: string | LabelValueOption) => isMatchingOption(o)) as TypeaheadOptions;
      if (matchingOptions.length === 1) {
        
        ref.current?.setState({
          selected: [...ref.current?.state.selected ?? [], ...matchingOptions],
          text: "",
          showMenu: false,
        });

        const newValue = typeof matchingOptions[0] == "string" ? matchingOptions[0] : matchingOptions[0].value;
        if (multiple) {      
          setValue(name, [...getValues(name) as [] | undefined ?? [] , newValue]);
        } else {
          setValue(name, newValue);
        }
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
        }
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

              if (onChange) {
                onChange(finalValue);
              }

              field.onChange(finalValue);
              clearErrors(name);
            }}
            onBlur={handleOnBlur}
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
