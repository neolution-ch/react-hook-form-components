import React, { PropsWithChildren, ReactNode, CSSProperties, useMemo } from "react";
import { FormGroup, FormFeedback, FormText, InputGroup } from "reactstrap";

interface StandaloneFormGroupLayoutProps extends PropsWithChildren<{}> {
  helpText?: ReactNode;
  label?: ReactNode;
  name: string;
  id?: string;
  labelToolTip?: ReactNode;
  inputOnly?: boolean;
  hideValidationMessage?: boolean;
  layout?: "checkbox" | "switch";
  addonLeft?: ReactNode | ((props: { isDisabled?: boolean }) => ReactNode);
  addonRight?: ReactNode | ((props: { isDisabled?: boolean }) => ReactNode);
  addonProps?: { isDisabled?: boolean };
  inputGroupStyle?: CSSProperties;
  formGroupId?: string;
  errorMessage?: string;
}

const StandaloneFormGroupLayout: React.FC<StandaloneFormGroupLayoutProps> = (props) => {
  const {
    label,
    helpText,
    children,
    layout,
    labelToolTip,
    inputOnly,
    addonLeft,
    addonRight,
    inputGroupStyle,
    formGroupId,
    addonProps,
    hideValidationMessage = false,
    errorMessage,
  } = props;
  const { name, id } = { name: props.name, id: props.id || props.name };

  const switchLayout = layout === "switch";
  const checkboxLayout = layout === "checkbox";

  if (inputOnly && (switchLayout || checkboxLayout)) {
    throw "'inputOnly' is not possible with switches or checkboxes";
  }

  const effectiveAddonLeft = useMemo(
    () =>
      addonLeft instanceof Function && addonProps
        ? (addonLeft as (props: { isDisabled?: boolean }) => ReactNode)(addonProps)
        : (addonLeft as ReactNode),
    [addonLeft, addonProps],
  );

  const effectiveAddonRight = useMemo(
    () =>
      addonRight instanceof Function && addonProps
        ? (addonRight as (props: { isDisabled?: boolean }) => ReactNode)(addonProps)
        : (addonRight as ReactNode),
    [addonRight, addonProps],
  );

  return inputOnly ? (
    <>
      {children}
      {!hideValidationMessage && <FormFeedback>{errorMessage}</FormFeedback>}
    </>
  ) : (
    <FormGroup id={formGroupId} switch={switchLayout ? true : undefined} check={checkboxLayout ? true : undefined}>
      {label && (
        <label>
          {label}
          {labelToolTip && <span className="label-tooltip">{labelToolTip}</span>}
        </label>
      )}
      {switchLayout || checkboxLayout ? (
        children
      ) : (
        <InputGroup
          style={{
            flexWrap: "nowrap",
            alignItems: "center",
            ...inputGroupStyle,
          }}
          className={errorMessage ? "is-invalid" : undefined}
        >
          {effectiveAddonLeft}
          {children}
          {effectiveAddonRight}
        </InputGroup>
      )}
      {!hideValidationMessage && <FormFeedback>{errorMessage}</FormFeedback>}
      {helpText && <FormText>{helpText}</FormText>}
    </FormGroup>
  );
};

export { StandaloneFormGroupLayout, StandaloneFormGroupLayoutProps };
