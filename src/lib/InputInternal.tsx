import { FieldValues, get, FieldError, UseFormRegisterReturn } from "react-hook-form";
import { Input } from "reactstrap";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { InputProps } from "./Input";
import { useMarkOnFocusHandler } from "./hooks/useMarkOnFocusHandler";
import { UnknownType, useFormContextInternal } from "./context/FormContext";

// This is two random guids concatenated. It is used to set the value of the option to undefined.
const UNDEFINED_OPTION_VALUE = "CABB7A27DB754DA58C89D43ADB03FE0EC5EE3E25A6624D749F35CF2E92CFA784";

const InputInternal = <T extends FieldValues = UnknownType>(props: InputProps<T>) => {
  const {
    disabled,
    type,
    onBlur,
    onChange,
    value,
    options,
    multiple,
    rangeMin,
    rangeMax,
    textAreaRows,
    plainText,
    placeholder,
    step,
    markAllOnFocus,
    className,
    style,
    innerRef,
    defaultValue
  } = props;
  const { name, id } = useSafeNameId(props.name ?? "", props.id);
  const focusHandler = useMarkOnFocusHandler(markAllOnFocus);
  const {
    register,
    formState,
    disabled: formDisabled = false,
  } = useFormContextInternal() ?? {};

  const { ref, ...rest } =register ? register(name, {
    setValueAs: (value: string) => (value === UNDEFINED_OPTION_VALUE ? undefined : value),
  }) : {} as Partial<UseFormRegisterReturn>; // probably to write better

  const fieldError = formState ? get(formState.errors, name) as FieldError | undefined : undefined;
  const hasError = !!fieldError;

  return (
    <>
      <Input
        invalid={hasError}
        type={type}
        id={id}
        innerRef={(elem) => {
          if (innerRef) {
            innerRef.current = elem;
          }
          ref && ref(elem);
        }}
        min={rangeMin}
        max={rangeMax}
        rows={textAreaRows}
        multiple={multiple}
        disabled={formDisabled || disabled}
        plaintext={plainText}
        style={plainText ? { color: "black", marginLeft: 10, ...style } : { ...style }}
        placeholder={placeholder}
        step={step}
        defaultValue={defaultValue}
        {...rest}
        {...(value ? { value } : {})}
        onBlur={(e) => {
          void (async () => {
            if (onBlur) {
              onBlur(e);
            }

            if (rest?.onBlur) {
              await rest.onBlur(e);
            }
          })();
        }}
        onChange={(e) => {
          void (async () => {
            if (onChange) {
              onChange(e);
            }

            if (rest?.onChange) {
              await rest.onChange(e);
            }
          })();
        }}
        onFocus={focusHandler}
        className={className}
      >
        {options?.map((option) => (
          <option key={option.value} value={option.value ?? UNDEFINED_OPTION_VALUE} disabled={option?.disabled}>
            {option.label}
          </option>
        ))}
      </Input>
    </>
  );
};

export { InputInternal };
