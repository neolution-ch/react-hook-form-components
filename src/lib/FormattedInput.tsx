import classnames from "classnames";
import { Controller, ControllerRenderProps, FieldValues } from "react-hook-form";
import { NumericFormat, NumericFormatProps, PatternFormat, PatternFormatProps } from "react-number-format";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { FormGroupLayout } from "./FormGroupLayout";
import { CommonInputProps } from "./types/CommonInputProps";
import { useMarkOnFocusHandler } from "./hooks/useMarkOnFocusHandler";
import { UnknownType, useFormContextInternal } from "./context/FormContext";

type FormattedInputInternalProps<T extends FieldValues = UnknownType> = Omit<FormattedInputProps<T>, "name" | "disabled"> & {
  name: string;
  isDisabled?: boolean;
  commonProps?: NumericFormatProps;
  fieldOnChange?: ControllerRenderProps<FieldValues, string>["onChange"];
};
const FormattedInputInternal = <T extends FieldValues = UnknownType>(props: FormattedInputInternalProps<T>) => {
  const {
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
    defaultValue,
    name,
    id,
    isDisabled,
    commonProps,
    fieldOnChange,
  } = props;

  const focusHandler = useMarkOnFocusHandler(markAllOnFocus);
  const commonPropsInternal = commonProps ?? {
    onBlur: (e) => {
      if (propsOnBlur) {
        propsOnBlur(e);
      }
    },
    disabled: isDisabled,
    className:  classnames("form-control", className),
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
            defaultValue={defaultValue}
            {...numericFormat}
            {...commonPropsInternal}
            valueIsNumericString={true}
            onChange={(e) => {
              if (propsOnChange) propsOnChange(e);
            }}
            onValueChange={(values) => {
              fieldOnChange && fieldOnChange(values.value);
            }}
            onFocus={focusHandler}
            style={style}
          ></NumericFormat>
        )}

        {patternFormat && (
          <PatternFormat
            {...patternFormat}
            {...commonPropsInternal}
            onChange={fieldOnChange}
            style={style}
            onFocus={focusHandler}
          ></PatternFormat>
        )}
      </>
    </FormGroupLayout>
  );
};

type FormattedInputProps<T extends FieldValues = UnknownType> = CommonInputProps<T> & {
  patternFormat?: PatternFormatProps;
  numericFormat?: NumericFormatProps;
};

const FormattedInput = <T extends FieldValues = UnknownType>(props: FormattedInputProps<T>) => {
  if (props.patternFormat && props.numericFormat) {
    throw new Error("FormattedInput cannot have both patternFormat and numericFormat");
  }

  const {
    disabled,
    onBlur: propsOnBlur,
    className = "",
  } = props;

  const { name, id } = useSafeNameId(props?.name ?? "", props.id);
  const { control, disabled: formDisabled = false } = useFormContextInternal() ?? {};

  const isDisabled = formDisabled || disabled;

  return control ? (
    <Controller
      control={control}
      name={name}
      render={({ field: { name, onBlur, onChange, ref, value }, fieldState: { error } }) => {
        const commonProps: NumericFormatProps = {
          name: name,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          value: value,
          getInputRef: ref,
          className: classnames("form-control", { "is-invalid": error }, className),
          "aria-invalid": !!error,
          id,
          onBlur: (e) => {
            if (propsOnBlur) propsOnBlur(e);
            onBlur();
          },
          onValueChange: (values) => {
            onChange(values.value);
          },
          disabled: isDisabled,
        };

        return <FormattedInputInternal {...props} isDisabled={isDisabled} name={name} fieldOnChange={onChange} commonProps={commonProps} />;
      }}
    />
  ) : (
    <FormattedInputInternal {...props} isDisabled={isDisabled} name={name} />
  );
};

export { FormattedInput, FormattedInputProps };
