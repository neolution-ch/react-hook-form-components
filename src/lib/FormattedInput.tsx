import classnames from "classnames";
import { Controller, FieldValues, useFormContext } from "react-hook-form";
import { NumericFormat, NumericFormatProps, PatternFormat, PatternFormatProps } from "react-number-format";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { FormGroupLayout } from "./FormGroupLayout";
import { CommonInputProps } from "./types/CommonInputProps";

interface FormattedInputProps<T extends FieldValues> extends CommonInputProps<T> {
  patternFormat?: PatternFormatProps;
  numericFormat?: NumericFormatProps;
}

const FormattedInput = <T extends FieldValues>(props: FormattedInputProps<T>) => {
  if (props.patternFormat && props.numericFormat) {
    throw new Error("FormattedInput cannot have both patternFormat and numericFormat");
  }

  const { disabled, label, helpText, numericFormat, patternFormat, onChange: propsOnChange, onBlur: propsOnBlur, labelToolTip } = props;
  const { name, id } = useSafeNameId(props.name, props.id);
  const { control } = useFormContext();

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field: { name, onBlur, onChange, ref, value }, fieldState: { error } }) => {
          const commonProps: NumericFormatProps = {
            name: name,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            value: value,
            getInputRef: ref,
            className: classnames("form-control", { "is-invalid": error }),
            "aria-invalid": !!error,
            id,
            onBlur: (e) => {
              if (propsOnBlur) propsOnBlur(e);
              onBlur();
            },
            disabled,
          };

          return (
            <FormGroupLayout helpText={helpText} name={name} id={id} label={label} labelToolTip={labelToolTip}>
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
                  ></NumericFormat>
                )}

                {patternFormat && <PatternFormat {...patternFormat} {...commonProps} onChange={onChange}></PatternFormat>}
              </>
            </FormGroupLayout>
          );
        }}
      />
    </>
  );
};

export { FormattedInput, FormattedInputProps };
