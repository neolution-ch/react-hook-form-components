import { ReactNode } from "react";
import { useFormContext } from "./context/FormContext";
import { FieldPath, FieldValues } from "react-hook-form";
import { Label, UncontrolledTooltip } from "reactstrap";

interface FormGroupLayoutLabelProps<T extends FieldValues> {
  label: ReactNode;
  tooltip?: ReactNode;
  fieldName: FieldPath<T>;
  fieldId: string;
  layout?: "checkbox" | "switch";
}

const FormGroupLayoutLabel = <T extends FieldValues>(props: FormGroupLayoutLabelProps<T>) => {
  const { label, tooltip, fieldName, layout, fieldId } = props;
  const { requiredFields } = useFormContext<T>();

  if (!label && !!tooltip) {
    throw new Error("You can't have a tooltip without a label");
  }

  if (!label) {
    return null;
  }

  const fieldIsRequired = typeof label == "string" && requiredFields.includes(fieldName);
  const finalLabel = fieldIsRequired ? `${String(label)} *` : label;

  const switchLayout = layout === "switch";
  const checkboxLayout = layout === "checkbox";

  return (
    <>
      <Label check={checkboxLayout || switchLayout} for={fieldId} onClick={(e) => e.stopPropagation()}>
        {finalLabel}
        {tooltip && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            id={`Tooltip-${fieldId}`}
            className="tooltip--icon"
            width="24"
            height="24"
            onClick={(e) => e.preventDefault()}
            >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
            />
          </svg>
        )}
      </Label>
      {tooltip && (
        <UncontrolledTooltip placement="top" target={`Tooltip-${fieldId}`}>
          {tooltip}
        </UncontrolledTooltip>
      )}
    </>
  );
};

export { FormGroupLayoutLabel, FormGroupLayoutLabelProps };
