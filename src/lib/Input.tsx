/* eslint-disable complexity */
import { FieldValues } from "react-hook-form";
import { FormGroup, Label } from "reactstrap";
import { InputType } from "reactstrap/types/lib/Input";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { FormGroupLayout } from "./FormGroupLayout";
import { InputInternal } from "./InputInternal";
import { CommonInputProps } from "./types/CommonInputProps";
import { LabelValueOption } from "./types/LabelValueOption";

interface InputProps<T extends FieldValues> extends CommonInputProps<T> {
  type?: InputType;
  options?: LabelValueOption[];
  multiple?: boolean;
  value?: string;
  rangeMin?: number;
  rangeMax?: number;
  textAreaRows?: number;
  textAreaDefaultValue?: string;
}

const Input = <T extends FieldValues>(props: InputProps<T>) => {
  if (props.type === "radio" && !props.options) {
    throw new Error("options must be provided for radio inputs");
  }
  if (props.type === "select" && !props.options) {
    throw new Error("options must be provided for select inputs");
  }
  if (props.multiple && props.type !== "select") {
    throw new Error("multiple can only be used with select inputs");
  }
  if ((props.rangeMin || props.rangeMax) && props.type !== "range") {
    throw new Error("rangeMin and rangeMax can only be used with range inputs");
  }
  if ((props.textAreaRows || props.textAreaDefaultValue) && props.type !== "textarea") {
    throw new Error("textAreaRows can only be used with textarea inputs");
  }

  const { type, options } = props;

  const formGroupLayout = (() => {
    if (type === "switch") {
      return "switch";
    }
    if (type === "checkbox") {
      return "checkbox";
    }
    return undefined;
  })();

  const { id } = useSafeNameId(props.name, props.id);

  return (
    <FormGroupLayout {...props} layout={formGroupLayout}>
      {type === "radio" ? (
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
