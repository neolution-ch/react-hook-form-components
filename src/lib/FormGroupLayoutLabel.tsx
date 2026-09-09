import { useFormContext } from "./context/FormContext";
import { FieldPath, FieldValues } from "react-hook-form";
import { Label, UncontrolledTooltip } from "@neolution-ch/reactstrap";
import { getRequiredLabel } from "./helpers/form";
import type { FormGroupLayoutProps } from "./FormGroupLayout";

type TooltipProps<T extends FieldValues> = Pick<FormGroupLayoutLabelProps<T>, "labelToolTip" | "fieldId">;

const Tooltip = <T extends FieldValues>(props: TooltipProps<T>) => {
  const { fieldId, labelToolTip } = props;

  if (!labelToolTip) {
    return null;
  }

  if (typeof labelToolTip !== "string") {
    return labelToolTip;
  }

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        id={`Tooltip-${fieldId}`}
        className="tooltip--icon"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
        />
      </svg>
      <UncontrolledTooltip placement="top" target={`Tooltip-${fieldId}`}>
        {labelToolTip}
      </UncontrolledTooltip>
    </>
  );
};

interface FormGroupLayoutLabelProps<T extends FieldValues> extends Pick<
  FormGroupLayoutProps<T, unknown>,
  "labelToolTip" | "layout" | "labelStyle" | "label"
> {
  fieldName: FieldPath<T>;
  fieldId: string;
}

const FormGroupLayoutLabel = <T extends FieldValues>(props: FormGroupLayoutLabelProps<T>) => {
  const { label, labelToolTip, fieldName, layout, fieldId, labelStyle } = props;
  const { requiredFields } = useFormContext<T>();

  if (!label && !!labelToolTip) {
    throw new Error("You can't have a tooltip without a label");
  }

  if (!label) {
    return null;
  }

  const finalLabel = getRequiredLabel<T>(label, fieldName, requiredFields);
  const switchLayout = layout === "switch";
  const checkboxLayout = layout === "checkbox";

  return (
    <Label check={checkboxLayout || switchLayout} for={fieldId} style={labelStyle}>
      {finalLabel}
      <Tooltip<T> labelToolTip={labelToolTip} fieldId={fieldId} />
    </Label>
  );
};

export { FormGroupLayoutLabel, FormGroupLayoutLabelProps };
