import { useState } from "react";
import { AsyncTypeahead, UseAsyncProps } from "react-bootstrap-typeahead";
import { Controller, FieldValues, useFormContext } from "react-hook-form";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { FormGroupLayout } from "./FormGroupLayout";
import { convertTypeaheadOptionsToStringArray } from "./helpers/typeahead";
import { CommonTypeaheadProps, TypeaheadOptions } from "./types/Typeahead";
import { useMarkOnFocusHandler } from "./hooks/useMarkOnFocusHandler";
import { useInternalFormContext } from "./context/InternalFormContext";

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
  } = props;
  const { name, id } = useSafeNameId(props.name, props.id);

  const { control } = useFormContext();
  const { readonly } = useInternalFormContext<T>();

  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<TypeaheadOptions>([]);
  const focusHandler = useMarkOnFocusHandler(markAllOnFocus);

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
          inputGroupStyle={props.inputGroupStyle}
        >
          <AsyncTypeahead
            {...field}
            id={id}
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
            disabled={readonly || disabled}
            onFocus={focusHandler}
            {...reactBootstrapTypeaheadProps}
            style={style}
          />
        </FormGroupLayout>
      )}
    />
  );
};

export { AsyncTypeaheadInput, AsyncTypeaheadProps };
