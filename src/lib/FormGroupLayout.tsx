import { PropsWithChildren } from "react";
import { FieldValues, useFormContext } from "react-hook-form";
import { FormGroup, Label, FormFeedback, FormText, UncontrolledTooltip } from "reactstrap";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { CommonInputProps } from "./types/CommonInputProps";
import "./styles/FormGroupLayout.css";

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

  const fieldError = errors[name];
  const errorMessage = String(fieldError?.message);

  const switchLayout = layout === "switch";
  const checkboxLayout = layout === "checkbox";

  return (
    <FormGroup switch={switchLayout ? true : undefined} check={checkboxLayout ? true : undefined}>
      <Label check={checkboxLayout || switchLayout} for={id}>
        {label}
        {labelToolTip && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            id={`Tooltip-${id}`}
            className="tooltip--icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
            />
          </svg>
        )}
      </Label>
      {labelToolTip && (
        <UncontrolledTooltip placement="top" target={`Tooltip-${id}`}>
          {labelToolTip}
        </UncontrolledTooltip>
      )}
      {children}
      <FormFeedback>{errorMessage}</FormFeedback>
      {helpText && <FormText>{helpText}</FormText>}
    </FormGroup>
  );
};

export { FormGroupLayout, FormGroupLayoutProps };
