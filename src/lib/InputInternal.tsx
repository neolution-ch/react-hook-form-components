import { FieldValues, get, FieldError } from "react-hook-form";
import { Input } from "reactstrap";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { InputProps } from "./Input";
import { useMarkOnFocusHandler } from "./hooks/useMarkOnFocusHandler";
import { useFormContext } from "./context/FormContext";

// This is two random guids concatenated. It is used to set the value of the option to undefined.
const UNDEFINED_OPTION_VALUE = "CABB7A27DB754DA58C89D43ADB03FE0EC5EE3E25A6624D749F35CF2E92CFA784";

const InputInternal = <T extends FieldValues>(props: InputProps<T>) => {
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
  } = props;
  const { name, id } = useSafeNameId(props.name, props.id);
  const focusHandler = useMarkOnFocusHandler(markAllOnFocus);
  const {
    register,
    formState: { errors },
    disabled: formDisabled,
  } = useFormContext();

  const { ref, ...rest } = register(name, {
    setValueAs: (value: string) => (value === UNDEFINED_OPTION_VALUE ? undefined : value),
  });

  const fieldError = get(errors, name) as FieldError | undefined;
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
          ref(elem);
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
        {...rest}
        {...(value ? { value } : {})}
        onBlur={(e) => {
          void (async () => {
            if (onBlur) {
              onBlur(e);
            }

            await rest.onBlur(e);
          })();
        }}
        onChange={(e) => {
          void (async () => {
            if (onChange) {
              onChange(e);
            }

            await rest.onChange(e);
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
