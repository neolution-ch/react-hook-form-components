import { ReactNode, CSSProperties } from "react";
import { FieldPath, FieldValues } from "react-hook-form";

interface DefaultAddonProps {
  isDisabled?: boolean;
}

export type MergedAddonProps<TRenderAddon> = TRenderAddon & DefaultAddonProps;

interface CommonInputProps<T extends FieldValues, TRenderAddon = unknown> {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  label?: ReactNode;
  name: FieldPath<T>;
  id?: string;
  helpText?: ReactNode;
  disabled?: boolean;
  labelToolTip?: string;
  markAllOnFocus?: boolean;
  inputOnly?: boolean;

  /**
   * Component prop that represents an additional className attribute
   * Adding a new className will NOT override the existing one, but it's added to the existing className attributes
   * @type {React.HTMLAttributes<T>["className"]}
   * @example <Input<T> type="text" className="text-white" />
   */
  className?: React.HTMLAttributes<T>["className"];

  /**
   * Component prop that represents an additional style attribute
   * Adding a new style will NOT override the existing one, but it's added to the existing style attributes
   * This property is not included in DatePickerInput, as it only allow styling through classNames
   * @type {CSSProperties}
   * @example <Input<T> type="text" style={{ backgroundColor: "red" }} />
   */
  style?: CSSProperties;

  /**
   * Component prop that represents an element rendered inside the input group on the left side: https://reactstrap.github.io/?path=/docs/components-inputgroup--input-group
   * If you want to render text or an icon inside the input, it is recommended to wrap it inside an `InputGroupText` component.
   * The `addonLeft` prop also accepts a function that receives various props based on the input type and returns a ReactNode.
   * @type {React.ReactNode}
   * @example <caption>Render a string by wrapping it inside a `InputGroupText` component</caption>
   * addonLeft={<InputGroupText>@</InputGroupText>}
   *
   * @example <caption>Render a `Button` component</caption>
   * addonLeft={<Button>Button</Button>}
   */
  addonLeft?: React.ReactNode | ((props: MergedAddonProps<TRenderAddon>) => React.ReactNode);

  /**
   * Component prop that represents an element rendered inside the input group on the right side: https://reactstrap.github.io/?path=/docs/components-inputgroup--input-group
   * If you want to render text or an icon inside the input, it is recommended to wrap it inside an `InputGroupText` component.
   * The `addonRight` prop also accepts a function that receives various props based on the input type and returns a ReactNode.
   * @type {React.ReactNode}
   * @example <caption>Render a string by wrapping it inside a `InputGroupText` component</caption>
   * addonRight={<InputGroupText>@</InputGroupText>}
   *
   * @example <caption>Render a `Button` component</caption>
   * addonRight={<Button>Button</Button>}
   */
  addonRight?: React.ReactNode | ((props: MergedAddonProps<TRenderAddon>) => React.ReactNode);

  /**
   * Component prop that represents an additional style attribute for the input group
   * Adding a new style will NOT override the existing one, but it's added to the existing style attributes
   * @type {CSSProperties}
   * @example <Input<T> type="text" inputGroupStyle={{ align-items: "center" }} />
   */
  inputGroupStyle?: CSSProperties;

  /**
   * hide the validation message for the input
   */
  hideValidationMessage?: boolean;

  /**
   * Component prop that represents the minlength attribute for the input element
   * @type {number}
   * @example <Input<T> type="text" minlength={0} />
   */

  minLength?: number;
  /**
   * Component prop that represents the maxlength attribute for the input element
   * @type {number}
   * @example <Input<T> type="text" maxlength={10} />
   */
  maxLength?: number;
}

export { CommonInputProps };
