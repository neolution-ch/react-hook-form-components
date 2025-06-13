import { AutocompleteRenderOptionState } from "@mui/material/Autocomplete";
import { LabelValueOption } from "../types/LabelValueOption";
import { TypeaheadOption, TypeaheadOptions } from "../types/Typeahead";
import AutosuggestHighlightMatch from "autosuggest-highlight/match";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";

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

const sortOptionsByGroup = (options: TypeaheadOptions): TypeaheadOptions =>
  options.sort((x, y) =>
    (typeof x === "string" ? x : (x.group?.name ?? "")).localeCompare(typeof y === "string" ? y : (y.group?.name ?? "")),
  );

const groupOptions = (option: TypeaheadOption): string => (typeof option === "string" ? option : (option.group?.name ?? ""));

const isDisabledGroup = (option: TypeaheadOption): boolean => typeof option !== "string" && !!option.group?.disabled;

const renderHighlightedOptionFunction = (
  props: React.HTMLAttributes<HTMLLIElement>,
  option: TypeaheadOption,
  { inputValue }: AutocompleteRenderOptionState,
): JSX.Element => {
  const parts = getAutosuggestHighlightParts(option, inputValue);
  return (
    <li {...props}>
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

export {
  getSingleAutoCompleteValue,
  getMultipleAutoCompleteValue,
  convertAutoCompleteOptionsToStringArray,
  sortOptionsByGroup,
  isDisabledGroup,
  groupOptions,
  renderHighlightedOptionFunction,
  getAutosuggestHighlightParts,
};
