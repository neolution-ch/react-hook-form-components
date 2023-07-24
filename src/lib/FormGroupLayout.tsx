import { PropsWithChildren, ReactNode } from "react";
import { FieldError, FieldValues, get, useFormContext } from "react-hook-form";
import { FormGroup, FormFeedback, FormText, InputGroup } from "reactstrap";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { CommonInputProps } from "./types/CommonInputProps";
import "./styles/FormGroupLayout.css";
import { FormGroupLayoutLabel } from "./FormGroupLayoutLabel";

interface FormGroupLayoutProps<T extends FieldValues>
  extends PropsWithChildren<Pick<CommonInputProps<T>, "helpText" | "label" | "name" | "id" | "labelToolTip" | "inputOnly">> {
  layout?: "checkbox" | "switch";
  addonLeft?: ReactNode;
  addonRight?: ReactNode;
}

const FormGroupLayout = <T extends FieldValues>(props: FormGroupLayoutProps<T>) => {
  const { label, helpText, children, layout, labelToolTip, inputOnly, addonLeft, addonRight } = props;
  const { name, id } = useSafeNameId(props.name, props.id);
  const {
    formState: { errors },
  } = useFormContext();

  const fieldError = get(errors, name) as FieldError | undefined;
  const errorMessage = String(fieldError?.message);

  const switchLayout = layout === "switch";
  const checkboxLayout = layout === "checkbox";

  if (inputOnly && (switchLayout || checkboxLayout)) {
    throw "'inputOnly' is not possible with switches or checkboxes";
  }

  return inputOnly ? (
    <>
      {children}
      <FormFeedback>{errorMessage}</FormFeedback>
    </>
  ) : (
    <FormGroup switch={switchLayout ? true : undefined} check={checkboxLayout ? true : undefined}>
      <FormGroupLayoutLabel<T> label={label} fieldName={name} fieldId={id} tooltip={labelToolTip} layout={layout} />
      {switchLayout || checkboxLayout ? (
        children
      ) : (
        <InputGroup
          style={{
            flexWrap: "nowrap",
            alignItems: "center",
          }}
          className={fieldError ? "is-invalid" : undefined}
        >
          {addonLeft}
          {children}
          {addonRight}
        </InputGroup>
      )}
      <FormFeedback>{errorMessage}</FormFeedback>
      {helpText && <FormText>{helpText}</FormText>}
    </FormGroup>
  );
};

export { FormGroupLayout, FormGroupLayoutProps };
