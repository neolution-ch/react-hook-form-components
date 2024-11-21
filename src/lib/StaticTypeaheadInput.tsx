import { useMemo } from "react";
import { Controller, ControllerRenderProps, FieldValues } from "react-hook-form";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { CommonTypeaheadProps, TypeaheadOptions } from "./types/Typeahead";
import { useFormContext } from "./context/FormContext";
import { LabelValueOption } from "./types/LabelValueOption";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { FormControl, InputLabel } from "@mui/material";
import { BootstrapInput, getAutoCompleteValue } from "./helpers/typeahead";

interface StaticTypeaheadInputProps<T extends FieldValues> extends CommonTypeaheadProps<T> {
  options: TypeaheadOptions;
  autocompleteProps?: Partial<AutocompleteProps<LabelValueOption | string, boolean, boolean, boolean>>;
}

interface AutoCompleteInternalProps<T extends FieldValues> extends StaticTypeaheadInputProps<T> {
  field: ControllerRenderProps<FieldValues, string>;
  id: string;
}

const AutoCompleteInternal = <T extends FieldValues>(props: AutoCompleteInternalProps<T>) => {
  const {
    field,
    id,

    options,
    disabled,
    label,
    helpText,
    labelToolTip,

    reactBootstrapTypeaheadProps,
    onChange,
    onInputChange,
    markAllOnFocus,
    addonLeft,
    addonRight,
    style,
    className = "",
    emptyLabel,
    placeholder,
    multiple,
    invalidErrorMessage,
    hideValidationMessage = false,
    inputRef,
    useGroupBy = false,
    useBootstrapStyle,
  } = props;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return
  const value = useMemo(() => getAutoCompleteValue(options, field.value as string | string[] | undefined), [field.value, options]);

  const {
    control,
    disabled: formDisabled,
    formState: { errors },
    // setError,
    // clearErrors,
    // getValues,
    getFieldState,
  } = useFormContext();


  const focusHandler = useMarkOnFocusHandler(markAllOnFocus);
  const fieldError = get(errors, name) as FieldError | undefined;
  const hasError = !!fieldError;

  const isDisabled = formDisabled || disabled;
  
  return (
    <Autocomplete
      {...field}
      id={id}
      multiple={multiple}
      options={options}
      value={value as string | LabelValueOption | TypeaheadOptions | undefined}
      getOptionLabel={(option: LabelValueOption | string) =>
        typeof option === "string" ? option : option.label
      }
      disabled={isDisabled}
      renderInput={(params) => useBootstrapStyle ? (
        <FormControl variant="standard">
          <InputLabel shrink htmlFor="bootstrap-input">
            {label}
          </InputLabel>
          <BootstrapInput
            {...params}
            ref={params.InputProps.ref}
            defaultValue="react-bootstrap"
            id="bootstrap-input"
          />
        </FormControl>
      ) : (
        <TextField
          {...params}
          label={label}
          helperText={helpText}

        />
      )}
    />
  );
}

const StaticTypeaheadInput = <T extends FieldValues>(props: StaticTypeaheadInputProps<T>) => {
  const {
    options,
    disabled,
    label,
    helpText,
    labelToolTip,
    defaultSelected,
    reactBootstrapTypeaheadProps,
    onChange,
    onInputChange,
    markAllOnFocus,
    addonLeft,
    addonRight,
    style,
    className = "",
    emptyLabel,
    placeholder,
    multiple,
    invalidErrorMessage,
    hideValidationMessage = false,
    inputRef,
    useGroupBy = false,
    useBootstrapStyle,
  } = props;

  const { name, id } = useSafeNameId(props?.name ?? "", props.id);
  const {
    control,
    disabled: formDisabled,
    formState: { errors },
    // setError,
    // clearErrors,
    // getValues,
    getFieldState,
  } = useFormContext();


  return (
    <Controller
      control={control}
      name={name}
      rules={{
        validate: {
          required: () => getFieldState(name)?.error?.message,
        },
      }}
      render={({ field }) => (
        <AutoCompleteInternal {...props} field={field} id={id} />
      )}
    />
  );
};

export { StaticTypeaheadInput, StaticTypeaheadInputProps };
