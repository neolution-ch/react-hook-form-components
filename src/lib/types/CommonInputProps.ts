import { ReactNode, CSSProperties } from "react";
import { FieldValues } from "react-hook-form";

interface CommonInputProps<T extends FieldValues> {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  label?: ReactNode;
  name: keyof T;
  id?: string;
  helpText?: ReactNode;
  disabled?: boolean;
  labelToolTip?: string;
  markAllOnFocus?: boolean;
  inputOnly?: boolean;
  className?: React.HTMLAttributes<T>["className"];
  style?: CSSProperties;

  /**
   * Component prop that represents an element rendered inside the input group on the left side: https://reactstrap.github.io/?path=/docs/components-inputgroup--input-group
   * If you want to render text or an icon inside the input, it is recommended to wrap it inside an `InputGroupText` component.
   * @type {React.ReactNode}
   * @example <caption>Render a string by wrapping it inside a `InputGroupText` component</caption>
   * addonLeft={<InputGroupText>@</InputGroupText>}
   *
   * @example <caption>Render a `Button` component</caption>
   * addonLeft={<Button>Button</Button>}
   */
  addonLeft?: React.ReactNode;

  /**
   * Component prop that represents an element rendered inside the input group on the right side: https://reactstrap.github.io/?path=/docs/components-inputgroup--input-group
   * If you want to render text or an icon inside the input, it is recommended to wrap it inside an `InputGroupText` component.
   * @type {React.ReactNode}
   * @example <caption>Render a string by wrapping it inside a `InputGroupText` component</caption>
   * addonRight={<InputGroupText>@</InputGroupText>}
   *
   * @example <caption>Render a `Button` component</caption>
   * addonRight={<Button>Button</Button>}
   */
  addonRight?: React.ReactNode;
}

export { CommonInputProps };
