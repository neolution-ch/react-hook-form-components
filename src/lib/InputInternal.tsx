import { FieldValues, useFormContext, get, FieldError } from "react-hook-form";
import { Input } from "reactstrap";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { InputProps } from "./Input";
import { useMarkOnFocusHandler } from "./hooks/useMarkOnFocusHandler";
import { useInternalFormContext } from "./context/InternalFormContext";

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
    markAllOnFocus,
    className,
    style,
  } = props;
  const { name, id } = useSafeNameId(props.name, props.id);
  const focusHandler = useMarkOnFocusHandler(markAllOnFocus);
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const { ref, ...rest } = register(name);

  const fieldError = get(errors, name) as FieldError | undefined;
  const hasError = !!fieldError;
  const { disabled: formDisabled } = useInternalFormContext<T>();

  return (
    <>
      <Input
        invalid={hasError}
        type={type}
        id={id}
        innerRef={ref}
        min={rangeMin}
        max={rangeMax}
        rows={textAreaRows}
        multiple={multiple}
        disabled={formDisabled || disabled}
        plaintext={plainText}
        style={plainText ? { color: "black", marginLeft: 10, ...style } : { ...style }}
        placeholder={placeholder}
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
          <option key={option.value} value={option.value} disabled={option?.disabled}>
            {option.label}
          </option>
        ))}
      </Input>
    </>
  );
};

export { InputInternal };
