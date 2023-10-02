import { PropsWithChildren, ReactNode, CSSProperties, useMemo } from "react";
import { FieldError, FieldValues, get } from "react-hook-form";
import { FormGroup, FormFeedback, FormText, InputGroup } from "reactstrap";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { CommonInputProps, MergedAddonProps } from "./types/CommonInputProps";
import "./styles/FormGroupLayout.css";
import { FormGroupLayoutLabel } from "./FormGroupLayoutLabel";
import { useFormContext } from "./context/FormContext";

interface FormGroupLayoutProps<T extends FieldValues, TRenderAddon>
  extends PropsWithChildren<Pick<CommonInputProps<T>, "helpText" | "label" | "name" | "id" | "labelToolTip" | "inputOnly">> {
  layout?: "checkbox" | "switch";
  addonLeft?: ReactNode | ((props: TRenderAddon) => ReactNode);
  addonRight?: ReactNode | ((props: TRenderAddon) => ReactNode);
  addonProps?: MergedAddonProps<TRenderAddon>;
  inputGroupStyle?: CSSProperties;
  formGroupId?: string;
}

const FormGroupLayout = <T extends FieldValues, TRenderAddon = unknown>(props: FormGroupLayoutProps<T, TRenderAddon>) => {
  const { label, helpText, children, layout, labelToolTip, inputOnly, addonLeft, addonRight, inputGroupStyle, formGroupId, addonProps } =
    props;
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

  const effectiveAddonLeft = useMemo(
    () =>
      addonLeft instanceof Function && addonProps
        ? (addonLeft as (props: TRenderAddon) => ReactNode)(addonProps)
        : (addonLeft as ReactNode),
    [addonLeft, addonProps],
  );

  const effectiveAddonRight = useMemo(
    () =>
      addonRight instanceof Function && addonProps
        ? (addonRight as (props: TRenderAddon) => ReactNode)(addonProps)
        : (addonRight as ReactNode),
    [addonRight, addonProps],
  );

  return inputOnly ? (
    <>
      {children}
      <FormFeedback>{errorMessage}</FormFeedback>
    </>
  ) : (
    <FormGroup id={formGroupId} switch={switchLayout ? true : undefined} check={checkboxLayout ? true : undefined}>
      <FormGroupLayoutLabel<T> label={label} fieldName={name} fieldId={id} tooltip={labelToolTip} layout={layout} />
      {switchLayout || checkboxLayout ? (
        children
      ) : (
        <InputGroup
          style={{
            flexWrap: "nowrap",
            alignItems: "center",
            ...inputGroupStyle,
          }}
          className={fieldError ? "is-invalid" : undefined}
        >
          {effectiveAddonLeft}
          {children}
          {effectiveAddonRight}
        </InputGroup>
      )}
      <FormFeedback>{errorMessage}</FormFeedback>
      {helpText && <FormText>{helpText}</FormText>}
    </FormGroup>
  );
};

export { FormGroupLayout, FormGroupLayoutProps };
