/* eslint-disable complexity */
import { FieldValues } from "react-hook-form";
import { FormGroup, Label } from "reactstrap";
import { InputType } from "reactstrap/types/lib/Input";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { FormGroupLayout } from "./FormGroupLayout";
import { InputInternal } from "./InputInternal";
import { CommonInputProps } from "./types/CommonInputProps";
import { LabelValueOption } from "./types/LabelValueOption";
import { useFormContext } from "./context/FormContext";

const invalidAddonTypes = ["switch", "radio", "checkbox"];

interface InputProps<T extends FieldValues> extends CommonInputProps<T> {
  type?: InputType;
  options?: LabelValueOption[];
  multiple?: boolean;
  value?: string | number;
  rangeMin?: number;
  rangeMax?: number;
  textAreaRows?: number;
  plainText?: boolean;
  placeholder?: string;
}

const Input = <T extends FieldValues>(props: InputProps<T>) => {
  const { type, options, addonLeft, name, addonRight, rangeMin, rangeMax, textAreaRows, multiple, id, value } = props;

  if (type === "radio" && !options) {
    throw new Error("options must be provided for radio inputs");
  }
  if (type === "select" && !options) {
    throw new Error("options must be provided for select inputs");
  }
  if ((addonLeft || addonRight) && type && invalidAddonTypes.includes(type)) {
    throw new Error("Addons can not be shown on switch, radio or checkbox types of inputs");
  }
  if (multiple && type !== "select") {
    throw new Error("multiple can only be used with select inputs");
  }
  if ((rangeMin || rangeMax) && type !== "range") {
    throw new Error("rangeMin and rangeMax can only be used with range inputs");
  }
  if (textAreaRows && type !== "textarea") {
    throw new Error("textAreaRows can only be used with textarea inputs");
  }
  if (value && type === "radio") {
    throw new Error("value can only be used with radio inputs");
  }
  if (options && options.filter((option) => option.value === undefined).length > 1) {
    throw new Error("options can only contain one undefined value");
  }

  const formGroupLayout = (() => {
    if (type === "switch") {
      return "switch";
    }
    if (type === "checkbox") {
      return "checkbox";
    }
    return undefined;
  })();

  const { id: safeId } = useSafeNameId(name, id);
  const { disabled: formDisabled } = useFormContext<T>();

  return (
    <FormGroupLayout {...props} layout={formGroupLayout}>
      {type === "radio" ? (
        <>
          {options?.map((option, i) => {
            const optionId = `${safeId}-${i}`;
            return (
              <FormGroup key={option.value} check>
                <InputInternal
                  {...props}
                  id={optionId}
                  value={option.value}
                  options={undefined}
                  disabled={formDisabled || props?.disabled || option?.disabled}
                />
                <Label for={optionId} check>
                  {option.label}
                </Label>
              </FormGroup>
            );
          })}
        </>
      ) : (
        <>
          <InputInternal {...props} />
        </>
      )}
    </FormGroupLayout>
  );
};

export { Input, InputProps };
