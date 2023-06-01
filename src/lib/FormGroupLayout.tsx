import { PropsWithChildren } from "react";
import { FieldError, FieldValues, get, useFormContext } from "react-hook-form";
import { FormGroup, FormFeedback, FormText } from "reactstrap";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { CommonInputProps } from "./types/CommonInputProps";
import "./styles/FormGroupLayout.css";
import { FormGroupLayoutLabel } from "./FormGroupLayoutLabel";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface FormGroupLayoutProps<T extends FieldValues>
  extends PropsWithChildren<Pick<CommonInputProps<T>, "helpText" | "label" | "name" | "id" | "labelToolTip" | "inputOnly">> {
  layout?: "checkbox" | "switch";
  icon?: IconDefinition;
}

const FormGroupLayout = <T extends FieldValues>(props: FormGroupLayoutProps<T>) => {
  const { label, helpText, children, layout, labelToolTip, inputOnly, icon } = props;
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
      {children}
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          fixedWidth
          size="lg"
          style={{
            float: "right",
            marginRight: "10px",
            marginTop: "-27px",
            position: "relative",
            zIndex: "2",
          }}
        />
      )}
      <FormFeedback>{errorMessage}</FormFeedback>
      {helpText && <FormText>{helpText}</FormText>}
    </FormGroup>
  );
};

export { FormGroupLayout, FormGroupLayoutProps };
