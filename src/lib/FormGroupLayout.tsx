import { PropsWithChildren } from "react";
import { FieldValues, useFormContext } from "react-hook-form";
import { FormGroup, Label, FormFeedback, FormText } from "reactstrap";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { CommonInputProps } from "./types/CommonInputProps";

interface FormGroupLayoutProps<T extends FieldValues>
  // todo: add the labelToolTip here to the picked props
  extends PropsWithChildren<Pick<CommonInputProps<T>, "helpText" | "label" | "name" | "id">> {
  layout?: "checkbox" | "switch";
}

const FormGroupLayout = <T extends FieldValues>(props: FormGroupLayoutProps<T>) => {
  const { label, helpText, children, layout } = props;
  const { name, id } = useSafeNameId(props.name, props.id);
  const {
    formState: { errors },
  } = useFormContext();

  const fieldError = errors[name];
  const errorMessage = String(fieldError?.message);

  const switchLayout = layout === "switch";
  const checkboxLayout = layout === "checkbox";

  return (
    <FormGroup switch={switchLayout ? true : undefined} check={checkboxLayout ? true : undefined}>
      <Label check={checkboxLayout || switchLayout} for={id}>
        {label}
      </Label>
      {/* todo: render label tooltip here. You can use this component from reactstrap: https://reactstrap.github.io/?path=/docs/components-tooltip--tooltip  */}
      {children}
      <FormFeedback>{errorMessage}</FormFeedback>
      {helpText && <FormText>{helpText}</FormText>}
    </FormGroup>
  );
};

export { FormGroupLayout, FormGroupLayoutProps };
