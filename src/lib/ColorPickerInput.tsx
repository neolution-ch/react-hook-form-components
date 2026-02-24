import { FieldPathByValue, FieldValues } from "react-hook-form";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { FormGroupLayout } from "./FormGroupLayout";
import { CommonInputProps } from "./types/CommonInputProps";
import { ColorPicker } from "./components/ColorPicker/ColorPicker";
import { FocusEventHandler } from "react";

interface ColorPickerInputProps<T extends FieldValues> extends Omit<
  CommonInputProps<T>,
  "minLength" | "maxLength" | "addonLeft" | "addonRight" | "name" | "onChange" | "onBlur"
> {
  useBootstrapStyle?: boolean;
  name: FieldPathByValue<T, string | undefined>;
  convertColorToFormatOrUndefinedOnBlur?: boolean;
  onChange?: (color: string | undefined) => void;
  onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  placeholder?: string;
  format: "hex" | "rgb";
}

const ColorPickerInput = <T extends FieldValues>(props: ColorPickerInputProps<T>) => {
  const { label, helpText, inputGroupStyle, labelToolTip, hideValidationMessage = false, useBootstrapStyle } = props;
  const { name, id } = useSafeNameId(props.name, props.id);

  return (
    <FormGroupLayout
      helpText={helpText}
      name={name}
      id={id}
      labelToolTip={labelToolTip}
      inputGroupStyle={inputGroupStyle}
      hideValidationMessage={hideValidationMessage}
      label={useBootstrapStyle ? label : undefined}
      labelStyle={useBootstrapStyle ? { color: "#8493A5", fontSize: 14 } : undefined}
      layout="muiInput"
    >
      <ColorPicker {...props} name={name} id={id} />
    </FormGroupLayout>
  );
};

export { ColorPickerInput, ColorPickerInputProps };
