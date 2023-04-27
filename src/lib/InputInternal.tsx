import { FieldValues, useFormContext } from "react-hook-form";
import { Input } from "reactstrap";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { InputProps } from "./Input";

const InputInternal = <T extends FieldValues>(props: InputProps<T>) => {
  const { disabled, type, onBlur, onChange, value, options, multiple, rangeMin, rangeMax, textAreaRows, plainText, placeholder } = props;
  const { name, id } = useSafeNameId(props.name, props.id);
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const { ref, ...rest } = register(name);

  const fieldError = errors[name];
  const hasError = !!fieldError;

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
        disabled={disabled}
        plaintext={plainText}
        style={plainText ? { color: "black", marginLeft: 10 } : {}}
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
      >
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Input>
    </>
  );
};

export { InputInternal };
