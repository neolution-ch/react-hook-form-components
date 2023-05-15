import { PropsWithChildren } from "react";
import { FieldError, FieldValues, get, useFormContext } from "react-hook-form";
import { FormGroup, FormFeedback, FormText } from "reactstrap";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { CommonInputProps } from "./types/CommonInputProps";
import "./styles/FormGroupLayout.css";
import { FormGroupLayoutLabel } from "./FormGroupLayoutLabel";

interface FormGroupLayoutProps<T extends FieldValues>
  extends PropsWithChildren<Pick<CommonInputProps<T>, "helpText" | "label" | "name" | "id" | "labelToolTip">> {
  layout?: "checkbox" | "switch";
}

const FormGroupLayout = <T extends FieldValues>(props: FormGroupLayoutProps<T>) => {
  const { label, helpText, children, layout, labelToolTip } = props;
  const { name, id } = useSafeNameId(props.name, props.id);
  const {
    formState: { errors },
  } = useFormContext();

  const fieldError = get(errors, name) as FieldError | undefined;
  const errorMessage = String(fieldError?.message);

  const switchLayout = layout === "switch";
  const checkboxLayout = layout === "checkbox";

  return (
    <FormGroup switch={switchLayout ? true : undefined} check={checkboxLayout ? true : undefined}>
      <FormGroupLayoutLabel<T> label={label} fieldName={name} fieldId={id} tooltip={labelToolTip} layout={layout} />
      {children}
      <FormFeedback>{errorMessage}</FormFeedback>
      {helpText && <FormText>{helpText}</FormText>}
    </FormGroup>
  );
};

export { FormGroupLayout, FormGroupLayoutProps };
