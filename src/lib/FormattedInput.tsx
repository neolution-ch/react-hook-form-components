import classnames from "classnames";
import { Controller, FieldValues } from "react-hook-form";
import { NumericFormat, NumericFormatProps, PatternFormat, PatternFormatProps } from "react-number-format";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { FormGroupLayout } from "./FormGroupLayout";
import { CommonInputProps } from "./types/CommonInputProps";
import { useMarkOnFocusHandler } from "./hooks/useMarkOnFocusHandler";
import { useFormContext } from "./context/FormContext";

interface FormattedInputProps<T extends FieldValues> extends CommonInputProps<T> {
  patternFormat?: PatternFormatProps;
  numericFormat?: NumericFormatProps;
  placeholder?: string;
}

const FormattedInput = <T extends FieldValues>(props: FormattedInputProps<T>) => {
  if (props.patternFormat && props.numericFormat) {
    throw new Error("FormattedInput cannot have both patternFormat and numericFormat");
  }

  const {
    disabled,
    label,
    helpText,
    numericFormat,
    inputGroupStyle,
    patternFormat,
    onChange: propsOnChange,
    onBlur: propsOnBlur,
    labelToolTip,
    style,
    markAllOnFocus,
    addonLeft,
    addonRight,
    className = "",
    hideValidationMessage = false,
    placeholder,
  } = props;
  const { name, id } = useSafeNameId(props.name, props.id);
  const { control, disabled: formDisabled } = useFormContext();
  const focusHandler = useMarkOnFocusHandler(markAllOnFocus);

  const isDisabled = formDisabled || disabled;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { name, onBlur, onChange, ref, value }, fieldState: { error } }) => {
        const commonProps: NumericFormatProps = {
          name: name,

          value: value as string | number,
          getInputRef: ref,
          className: classnames("form-control", { "is-invalid": error }, className),
          "aria-invalid": !!error,
          id,
          onBlur: (e) => {
            if (propsOnBlur) propsOnBlur(e);
            onBlur();
          },
          disabled: isDisabled,
        };

        return (
          <FormGroupLayout
            helpText={helpText}
            name={name}
            id={id}
            label={label}
            labelToolTip={labelToolTip}
            inputGroupStyle={inputGroupStyle}
            addonLeft={addonLeft}
            addonRight={addonRight}
            addonProps={{
              isDisabled,
            }}
            hideValidationMessage={hideValidationMessage}
          >
            <>
              {numericFormat && (
                <NumericFormat
                  {...numericFormat}
                  {...commonProps}
                  valueIsNumericString={true}
                  onChange={(e) => {
                    if (propsOnChange) propsOnChange(e);
                  }}
                  onValueChange={(values) => {
                    onChange(values.value);
                  }}
                  onFocus={focusHandler}
                  style={style}
                  placeholder={placeholder}
                ></NumericFormat>
              )}

              {patternFormat && (
                <PatternFormat {...patternFormat} {...commonProps} onChange={onChange} style={style} onFocus={focusHandler}></PatternFormat>
              )}
            </>
          </FormGroupLayout>
        );
      }}
    />
  );
};

export { FormattedInput, FormattedInputProps };
