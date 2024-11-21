import { Controller, FieldValues } from "react-hook-form";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { CommonTypeaheadProps, TypeaheadOptions } from "./types/Typeahead";
import { useFormContext } from "./context/FormContext";
import { LabelValueOption } from "./types/LabelValueOption";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

interface StaticTypeaheadInputProps<T extends FieldValues> extends CommonTypeaheadProps<T> {
  options: TypeaheadOptions;
  autocompleteProps?: Partial<AutocompleteProps<LabelValueOption | string, boolean, boolean, boolean>>;
}

const StaticTypeaheadInput = <T extends FieldValues>(props: StaticTypeaheadInputProps<T>) => {
  const {
    options,
  } = props;
  const { name, id } = useSafeNameId(props.name, props.id);
  const {
    control,
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
        <Autocomplete
          {...field}
          id={id}
          options={options}
          defaultValue={undefined}
          getOptionLabel={(option: LabelValueOption | string) =>
            typeof option === "string" ? option : option.label
          }
          renderInput={(params) => <TextField {...params} />}
        />
      )}
    />
  );
};

export { StaticTypeaheadInput, StaticTypeaheadInputProps };
