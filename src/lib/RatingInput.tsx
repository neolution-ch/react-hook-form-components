import Rating, { RatingProps } from "@mui/material/Rating";
import { Controller, FieldValues } from "react-hook-form";
import { FormGroupLayout, FormGroupLayoutProps } from "./FormGroupLayout";
import { useSafeNameId } from "./hooks/useSafeNameId";
import { useFormContext } from "./context/FormContext";

interface RatingInputProps<T extends FieldValues>
  extends Omit<RatingProps, "name">,
    Omit<FormGroupLayoutProps<T, never>, "onBlur" | "onChange" | "onKeyDown" | "layout" | "addonLeft" | "addonRight" | "addonProps"> {}

const RatingInput = <T extends FieldValues>(props: RatingInputProps<T>) => {
  const {
    helpText,
    label,
    labelToolTip,
    inputOnly,
    hideValidationMessage,
    labelStyle,
    formGroupId,
    inputGroupStyle,
    sx,
    disabled,
    readOnly,
    ...rest
  } = props;
  const { name, id } = useSafeNameId(props.name, props.id);
  const { disabled: formDisabled, control } = useFormContext<T>();

  return (
    <Controller
      control={control}
      shouldUnregister={disabled || formDisabled}
      name={props.name}
      render={({ field: { value, onBlur, onChange, ...fieldRest } }) => (
        <FormGroupLayout
          name={name}
          id={id}
          helpText={helpText}
          label={label}
          labelToolTip={labelToolTip}
          inputOnly={inputOnly}
          hideValidationMessage={hideValidationMessage}
          labelStyle={labelStyle}
          formGroupId={formGroupId}
          inputGroupStyle={inputGroupStyle}
        >
          <Rating
            {...rest}
            {...fieldRest}
            value={value ?? null}
            sx={{
              ...sx,
              label: {
                // unset the inline-block set by reboot
                display: "unset",
              },
            }}
            disabled={disabled || formDisabled}
            readOnly={readOnly || formDisabled}
            onBlur={(e) => {
              if (props.onBlur) {
                props.onBlur(e);
              }
              onBlur();
            }}
            onChange={(e, value) => {
              if (props.onChange) {
                props.onChange(e, value);
              }
              onChange(value);
            }}
          />
        </FormGroupLayout>
      )}
    />
  );
};

export { RatingInput, RatingInputProps };
