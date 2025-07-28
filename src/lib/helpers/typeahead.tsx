/* eslint-disable max-lines */
import { AutocompleteOwnerState, AutocompleteRenderGetTagProps, AutocompleteRenderOptionState } from "@mui/material/Autocomplete";
import { LabelValueOption } from "../types/LabelValueOption";
import { StaticTypeaheadAutocompleteProps, TypeaheadOption, TypeaheadOptions } from "../types/Typeahead";
import AutosuggestHighlightMatch from "autosuggest-highlight/match";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";
import { Chip } from "@mui/material";

const isStringArray = (options: TypeaheadOptions): boolean =>
  options.length > 0 && (options as TypeaheadOption[]).every((value) => typeof value === "string");

const convertAutoCompleteOptionsToStringArray = (options: TypeaheadOptions | undefined): string[] => {
  if (!options) {
    return [];
  }

  if (isStringArray(options)) {
    return options as string[];
  }

  return (options as LabelValueOption[]).map((option) => option.value) as string[];
};

const getSingleAutoCompleteValue = (options: TypeaheadOptions, fieldValue: string | number | undefined): TypeaheadOptions => {
  if (fieldValue === undefined) {
    return [];
  }

  return (options as TypeaheadOption[]).filter((x) =>
    // loose equality check to handle different types between form value and option value
    typeof x === "string" ? x === fieldValue : x.value === fieldValue,
  ) as TypeaheadOptions;
};

const getMultipleAutoCompleteValue = (options: TypeaheadOptions, fieldValue: (string | number)[] | undefined): TypeaheadOptions => {
  if (fieldValue === undefined) {
    return [];
  }
  return (options as TypeaheadOption[]).filter((x) =>
    typeof x === "string"
      ? fieldValue.includes(x)
      : // ensure that form values matches options values even if they are of different types
        fieldValue.map(String).includes(String(x.value as string | number)),
  ) as TypeaheadOptions;
};

const combineOptions = (options?: TypeaheadOptions, options2?: TypeaheadOptions): TypeaheadOptions => {
  if (!options) {
    return options2 || [];
  }

  if (!options2) {
    return options;
  }

  return [...(options as TypeaheadOption[]), ...(options2 as TypeaheadOption[])].filter(
    (option, i, options) =>
      options.findIndex((o) =>
        typeof o === "string" ? o === option : typeof option === "object" && "value" in option && o.value === option.value,
      ) === i,
  ) as TypeaheadOptions;
};

const sortOptionsByGroup = (options: TypeaheadOptions): TypeaheadOptions =>
  options.sort((x, y) =>
    (typeof x === "string" ? x : (x.group?.name ?? "")).localeCompare(typeof y === "string" ? y : (y.group?.name ?? "")),
  );

const groupOptions = (option: TypeaheadOption): string => (typeof option === "string" ? option : (option.group?.name ?? ""));

const isDisabledGroup = (option: TypeaheadOption): boolean => typeof option !== "string" && !!option.group?.disabled;

const renderHighlightedOptionFunction = (
  { key, ...rest }: React.HTMLAttributes<HTMLLIElement> & { key?: unknown }, // same definition as Autocomplete's renderOption
  option: TypeaheadOption,
  { inputValue }: AutocompleteRenderOptionState,
): JSX.Element => {
  const parts = getAutosuggestHighlightParts(option, inputValue);
  return (
    <li key={key as string} {...rest}>
      <div>
        {parts.map((part, index) => (
          <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
            {part.text}
          </span>
        ))}
      </div>
    </li>
  );
};

const getAutosuggestHighlightParts = (option: TypeaheadOption, inputValue: string): Array<{ text: string; highlight: boolean }> => {
  const finalOption = typeof option === "string" ? option : option.label;
  const matches = AutosuggestHighlightMatch(finalOption, inputValue, { insideWords: true });
  return AutosuggestHighlightParse(finalOption, matches);
};

const getOptionLabel = (option: TypeaheadOption): string => (typeof option === "string" ? option : option.label);

const getOptionValue = (option: TypeaheadOption): string | number | undefined => (typeof option === "string" ? option : option.value);

const validateFixedOptions = (
  fixedOptions: TypeaheadOptions | undefined,
  multiple: boolean | undefined,
  autocompleteProps: StaticTypeaheadAutocompleteProps | undefined,
  withFixedOptionsInValue: boolean,
  value: TypeaheadOptions,
) => {
  // If fixedOptions are provided, ensure they are used with multiple typeahead inputs
  if (fixedOptions && !multiple) {
    throw new Error("Fixed options can only be used with multiple typeahead inputs.");
  }

  // If fixedOptions are provided, ensure that they are not used with autocompleteProps.renderTags
  if (fixedOptions && autocompleteProps?.renderTags) {
    throw new Error("Fixed options cannot be used with renderTags in autocompleteProps.");
  }

  console.log("fixedOptions", fixedOptions);
  console.log("value", value);

  // If fixedOptions are provided and withFixedOptionsInValue is true, ensure that they are all included in the value
  if (
    fixedOptions &&
    withFixedOptionsInValue &&
    fixedOptions.some((option) => getSingleAutoCompleteValue(value, getOptionValue(option)).length === 0)
  ) {
    throw new Error("Fixed options must be included in the value if withFixedOptionsInValue is true.");
  }

  // If fixedOptions are provided and withFixedOptionsInValue is false, ensure that they are not included in the value
  if (
    fixedOptions &&
    !withFixedOptionsInValue &&
    fixedOptions.some((option) => getSingleAutoCompleteValue(value, getOptionValue(option)).length > 0)
  ) {
    throw new Error("Fixed options must not be included in the value if withFixedOptionsInValue is false.");
  }
};

type TagRenderer = (
  value: TypeaheadOption[],
  getTagProps: AutocompleteRenderGetTagProps,
  ownerState: AutocompleteOwnerState<TypeaheadOption, boolean, boolean, boolean>,
) => React.ReactNode;

const createTagRenderer = (
  fixedOptions: TypeaheadOptions | undefined,
  autocompleteProps: StaticTypeaheadAutocompleteProps | undefined,
): TagRenderer | undefined =>
  // If fixedOptions are provided, render tags with disabled state based on fixed options
  fixedOptions
    ? (tagValue, getTagProps) =>
        tagValue.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index });
          const optionValue = getOptionValue(option);
          return (
            <Chip
              key={key}
              label={getOptionLabel(option)}
              {...tagProps}
              disabled={getSingleAutoCompleteValue(fixedOptions, optionValue).length > 0}
            />
          );
        })
    : (autocompleteProps?.renderTags ?? undefined);

const resolveInputValue = (
  multiple: boolean | undefined,
  fixedOptions: TypeaheadOptions | undefined,
  withFixedOptionsInValue: boolean,
  value: TypeaheadOptions,
): string | LabelValueOption | TypeaheadOption[] | null | undefined => {
  return (multiple ? (fixedOptions && !withFixedOptionsInValue ? combineOptions(fixedOptions, value) : value) : value[0]) || null;
};

const getOptionsFromValue = (
  value: TypeaheadOptions | TypeaheadOption[] | TypeaheadOption | null,
  fixedOptions: TypeaheadOptions | undefined,
  withFixedOptionsInValue: boolean,
): TypeaheadOptions | undefined => {
  let finalOptions = value ? (Array.isArray(value) ? value : [value]) : undefined;

  if (fixedOptions) {
    if (withFixedOptionsInValue) {
      // If fixed options available and should be included in the value, always add all of them and make sure they are unique (distinct)
      finalOptions = combineOptions(fixedOptions, finalOptions as TypeaheadOptions);
      finalOptions = finalOptions?.filter(
        (option, i, options) => options.findIndex((o) => compareOptions(o, option)) === i,
      ) as TypeaheadOptions;
    } else {
      // If fixed options available but should not be included in the value, filter them out
      finalOptions = finalOptions?.filter((option) => !fixedOptions.some((fixedOption) => compareOptions(fixedOption, option)));
    }
  }

  return finalOptions ? (Array.isArray(finalOptions) ? (finalOptions as TypeaheadOptions) : [finalOptions]) : undefined;
};

const compareOptions = (option1: TypeaheadOption, option2: TypeaheadOption): boolean => {
  if (typeof option1 === "string" && typeof option2 === "string") {
    return option1 === option2;
  }
  if (typeof option1 === "object" && typeof option2 === "object") {
    return option1.value === option2.value && option1.label === option2.label;
  }
  return false; // If types are different, they are not equal
};

export {
  getSingleAutoCompleteValue,
  getMultipleAutoCompleteValue,
  convertAutoCompleteOptionsToStringArray,
  sortOptionsByGroup,
  isDisabledGroup,
  groupOptions,
  renderHighlightedOptionFunction,
  getAutosuggestHighlightParts,
  getOptionLabel,
  getOptionValue,
  combineOptions,
  validateFixedOptions,
  createTagRenderer,
  getOptionsFromValue,
  resolveInputValue,
};
