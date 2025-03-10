import { FieldPathByValue, FieldValues } from "react-hook-form";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { FormGroupLayout } from "./FormGroupLayout";
import { CommonInputProps } from "./types/CommonInputProps";
import { ColorPicker } from "./components/ColorPicker/ColorPicker";
import { FocusEventHandler } from "react";

interface ColorPickerInputProps<T extends FieldValues>
  extends Omit<CommonInputProps<T>, "minLength" | "maxLength" | "addonLeft" | "addonRight" | "name" | "onChange" | "onBlur"> {
  useBootstrapStyle?: boolean;
  name: FieldPathByValue<T, string | undefined>;
  convertColorToFormatOrUndefinedOnBlur?: boolean;
  onChange?: (color: string | undefined) => void;
  onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  placeholder?: string;
}

const ColorPickerInput = <T extends FieldValues>(props: ColorPickerInputProps<T>) => {
  const { label, helpText, inputGroupStyle, labelToolTip, hideValidationMessage = false } = props;
  const { name, id } = useSafeNameId(props.name, props.id);

  return (
    <FormGroupLayout
      helpText={helpText}
      name={name}
      id={id}
      label={label}
      labelToolTip={labelToolTip}
      inputGroupStyle={inputGroupStyle}
      hideValidationMessage={hideValidationMessage}
    >
      <ColorPicker {...props} name={name} id={id} />
    </FormGroupLayout>
  );
};

export { ColorPickerInput, ColorPickerInputProps };
