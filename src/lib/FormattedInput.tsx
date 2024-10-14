import classnames from "classnames";
import { Controller, FieldValues } from "react-hook-form";
import { NumericFormat, NumericFormatProps, PatternFormat, PatternFormatProps } from "react-number-format";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { FormGroupLayout } from "./FormGroupLayout";
import { CommonInputProps } from "./types/CommonInputProps";
import { useMarkOnFocusHandler } from "./hooks/useMarkOnFocusHandler";
import { useFormContextInternal } from "./context/FormContext";

type FormattedInputProps<T extends FieldValues> = CommonInputProps<T> & {
  patternFormat?: PatternFormatProps;
  numericFormat?: NumericFormatProps;
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
    defaultValue
  } = props;
  const { name, id } = useSafeNameId(props?.name ?? "", props.id);
  const { control, disabled: formDisabled = false } = useFormContextInternal() ?? {};
  const focusHandler = useMarkOnFocusHandler(markAllOnFocus);

  const isDisabled = formDisabled || disabled;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const error = fieldState ? fieldState.error : undefined;
        const commonProps: NumericFormatProps = {
          name: name,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          value: field?.value,
          getInputRef: field?.ref,
          className: classnames("form-control", { "is-invalid": error }, className),
          "aria-invalid": !!error,
          id,
          onBlur: (e) => {
            if (propsOnBlur) propsOnBlur(e);
            field?.onBlur();
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
                    field?.onChange(values.value);
                  }}
                  onFocus={focusHandler}
                  defaultValue={defaultValue}
                  style={style}
                ></NumericFormat>
              )}

              {patternFormat && (
                <PatternFormat {...patternFormat} {...commonProps} onChange={field?.onChange} style={style} onFocus={focusHandler}></PatternFormat>
              )}
            </>
          </FormGroupLayout>
        );
      }}
    />
  );
};

export { FormattedInput, FormattedInputProps };
