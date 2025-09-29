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
    onBlur,
    onChange,
    ...rest
  } = props;
  const { name, id } = useSafeNameId(props.name, props.id);
  const { disabled: formDisabled, control } = useFormContext<T>();

  return (
    <Controller
      control={control}
      name={props.name}
      render={({ field }) => (
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
            {...field}
            {...rest}
            sx={{
              ...sx,
              label: {
                // unset the inline-block set by reactstrap
                // display: "unset",
              },
            }}
            disabled={disabled || formDisabled}
            readOnly={readOnly || formDisabled}
            onBlur={(e) => {
              if (onBlur) {
                onBlur(e);
              }
              field.onBlur();
            }}
            onChange={(e, value) => {
              if (onChange) {
                onChange(e, value);
              }
              field.onChange(value);
            }}
          />
        </FormGroupLayout>
      )}
    />
  );
};

export { RatingInput, RatingInputProps };
