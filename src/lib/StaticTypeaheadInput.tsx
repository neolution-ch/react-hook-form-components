import { Typeahead } from "react-bootstrap-typeahead";
import { TypeaheadComponentProps } from "react-bootstrap-typeahead/types/components/Typeahead";
import { Controller, FieldValues, useFormContext } from "react-hook-form";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { FormGroupLayout } from "./FormGroupLayout";
import { convertTypeaheadOptionsToStringArray } from "./helpers/typeahead";
import { CommonTypeaheadProps, TypeaheadOptions } from "./types/Typeahead";
import { useMarkOnFocusHandler } from "./hooks/useMarkOnFocusHandler";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface StaticTypeaheadInputProps<T extends FieldValues> extends CommonTypeaheadProps<T> {
  options: TypeaheadOptions;
  reactBootstrapTypeaheadProps?: Partial<TypeaheadComponentProps>;
}

const StaticTypeaheadInput = <T extends FieldValues>(props: StaticTypeaheadInputProps<T>) => {
  const { disabled, label, helpText, labelToolTip, defaultSelected, reactBootstrapTypeaheadProps, onChange, markAllOnFocus, icon } = props;
  const { name, id } = useSafeNameId(props.name, props.id);

  const { control } = useFormContext();
  const focusHandler = useMarkOnFocusHandler(markAllOnFocus);

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => (
          <FormGroupLayout helpText={helpText} name={name} id={id} label={label} labelToolTip={labelToolTip}>
            <Typeahead
              {...field}
              defaultSelected={defaultSelected}
              multiple={props.multiple}
              onChange={(e) => {
                const values = convertTypeaheadOptionsToStringArray(e);
                const finalValue = props.multiple ? values : values[0];

                if (onChange) {
                  onChange(finalValue);
                }

                field.onChange(finalValue);
              }}
              id={id}
              options={props.options}
              className={error ? "is-invalid" : ""}
              inputProps={{ id }}
              disabled={disabled}
              onFocus={focusHandler}
              {...reactBootstrapTypeaheadProps}
            />
          </FormGroupLayout>
        )}
      />
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          fixedWidth
          size="lg"
          style={{
            float: "right",
            marginRight: "6px",
            marginTop: "-43px",
            position: "relative",
            zIndex: "2",
          }}
        />
      )}
    </>
  );
};

export { StaticTypeaheadInput, StaticTypeaheadInputProps };
