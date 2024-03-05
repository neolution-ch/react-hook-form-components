import { useRef, useState } from "react";
import { AsyncTypeahead, UseAsyncProps } from "react-bootstrap-typeahead";
import { Controller, FieldValues } from "react-hook-form";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { FormGroupLayout } from "./FormGroupLayout";
import { convertTypeaheadOptionsToStringArray } from "./helpers/typeahead";
import { CommonTypeaheadProps, TypeaheadOptions } from "./types/Typeahead";
import { useMarkOnFocusHandler } from "./hooks/useMarkOnFocusHandler";
import { useFormContext } from "./context/FormContext";
import TypeheadRef from "react-bootstrap-typeahead/types/core/Typeahead";

interface AsyncTypeaheadProps<T extends FieldValues> extends CommonTypeaheadProps<T> {
  queryFn: (query: string) => Promise<TypeaheadOptions>;
  reactBootstrapTypeaheadProps?: Partial<UseAsyncProps>;
}

const AsyncTypeaheadInput = <T extends FieldValues>(props: AsyncTypeaheadProps<T>) => {
  const {
    disabled,
    label,
    helpText,
    labelToolTip,
    defaultSelected,
    reactBootstrapTypeaheadProps,
    onChange,
    markAllOnFocus,
    addonLeft,
    addonRight,
    className = "",
    style,
    emptyLabel,
    placeholder,
  } = props;
  const { name, id } = useSafeNameId(props.name, props.id);
  const ref = useRef<TypeheadRef>(null);

  const { control, disabled: formDisabled, setError, setValue, clearErrors, getValues } = useFormContext();

  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<TypeaheadOptions>([]);
  const focusHandler = useMarkOnFocusHandler(markAllOnFocus);

  const isDisabled = formDisabled || disabled;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormGroupLayout
          helpText={helpText}
          name={name}
          id={id}
          label={label}
          labelToolTip={labelToolTip}
          addonLeft={addonLeft}
          addonRight={addonRight}
          addonProps={{
            isDisabled,
          }}
          inputGroupStyle={props.inputGroupStyle}
        >
          <AsyncTypeahead
            {...field}
            id={id}
            ref={ref}
            multiple={props.multiple}
            defaultSelected={defaultSelected}
            onChange={(e) => {
              const values = convertTypeaheadOptionsToStringArray(e);
              const finalValue = props.multiple ? values : values[0];

              if (onChange) {
                onChange(finalValue);
              }

              field.onChange(finalValue);
            }}
            className={`${className} ${error ? "is-invalid" : ""}`}
            inputProps={{ id }}
            isLoading={isLoading}
            options={options}
            filterBy={() => true}
            onSearch={(query) => {
              void (async () => {
                setIsLoading(true);
                const results = await props.queryFn(query);
                setOptions(results);
                setIsLoading(false);
              })();
            }}
            onBlur={() => {
              if (options.length === 1) {
                ref.current?.setState({
                  selected: options,
                });
                setValue(name, typeof options[0] == "string" ? options[0] : options[0].value);
              } else if (
                options.length > 1 &&
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                (!getValues(name) || convertTypeaheadOptionsToStringArray(options).includes(getValues(name)))
              ) {
                setError(name, { message: "Invalid Input" });
              } else {
                clearErrors(name);
              }
            }}
            disabled={isDisabled}
            onFocus={focusHandler}
            {...reactBootstrapTypeaheadProps}
            style={style}
            emptyLabel={emptyLabel}
            placeholder={placeholder}
          />
        </FormGroupLayout>
      )}
    />
  );
};

export { AsyncTypeaheadInput, AsyncTypeaheadProps };
