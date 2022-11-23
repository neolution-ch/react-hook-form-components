import { FieldValues } from "react-hook-form";
import { FormGroup, Label } from "reactstrap";
import { InputType } from "reactstrap/types/lib/Input";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { FormGroupLayout } from "./FormGroupLayout";
import { InputInternal } from "./InputInternal";
import { CommonInputProps } from "./types/CommonInputProps";
import { LabelValueOption } from "./types/LabelValueOption";

interface InputProps<T extends FieldValues> extends CommonInputProps<T> {
  inputType?: InputType;
  options?: LabelValueOption[];
  multiple?: boolean;
  value?: string;
  rangeMin?: number;
  rangeMax?: number;
}

const Input = <T extends FieldValues>(props: InputProps<T>) => {
  if (props.inputType === "radio" && !props.options) {
    throw new Error("options must be provided for radio inputs");
  }
  if (props.inputType === "select" && !props.options) {
    throw new Error("options must be provided for select inputs");
  }
  if (props.multiple && props.inputType !== "select") {
    throw new Error("multiple can only be used with select inputs");
  }
  if ((props.rangeMin || props.rangeMax) && props.inputType !== "range") {
    throw new Error("rangeMin and rangeMax can only be used with range inputs");
  }

  const { inputType, options } = props;

  const formGroupLayout = (() => {
    if (inputType === "switch") {
      return "switch";
    }
    if (inputType === "checkbox") {
      return "checkbox";
    }
    return undefined;
  })();

  const { id } = useSafeNameId(props.name, props.id);

  return (
    <FormGroupLayout {...props} layout={formGroupLayout}>
      {inputType === "radio" ? (
        <>
          {options?.map((option, i) => {
            const optionId = `${id}-${i}`;
            return (
              <FormGroup key={option.value} check>
                <InputInternal {...props} id={optionId} value={option.value} options={undefined} />
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
