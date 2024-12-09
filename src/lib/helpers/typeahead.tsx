import { AutocompleteRenderOptionState } from "@mui/material/Autocomplete";
import { LabelValueOption } from "../types/LabelValueOption";
import { TypeaheadOption } from "../types/Typeahead";
import AutosuggestHighlightMatch from "autosuggest-highlight/match";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";

const isStringArray = (options: TypeaheadOption[]): boolean => options.length > 0 && options.every((value) => typeof value === "string");

const convertAutoCompleteOptionsToStringArray = (options: TypeaheadOption[] | undefined): string[] => {
  if (!options) {
    return [];
  }

  if (isStringArray(options)) {
    return options as string[];
  }

  return (options as LabelValueOption[]).map((option) => option.value) as string[];
};

const getSingleAutoCompleteValue = (options: TypeaheadOption[], value: string | number | undefined) => {
  if (options[0] === undefined || value === undefined) {
    return undefined;
  }

  return options.find((x) => (typeof x === "string" ? x === value : x.value == value));
};

const getMultipleAutoCompleteValue = (options: TypeaheadOption[], value: string[] | undefined) => {
  if (options[0] === undefined || !value) {
    return undefined;
  }
  return options.filter((x) => (typeof x === "string" ? value.includes(x) : value.includes(x.value as string))) as
    | string[]
    | LabelValueOption[]
    | undefined;
};

const sortOptionsByGroup = (options: TypeaheadOption[]): TypeaheadOption[] =>
  options.sort((x, y) => (typeof x === "string" ? x : x.group?.name ?? "").localeCompare(typeof y === "string" ? y : y.group?.name ?? ""));

const groupOptions = (option: TypeaheadOption): string => (typeof option === "string" ? option : option.group?.name ?? "");

const isDisabledGroup = (option: TypeaheadOption): boolean => typeof option !== "string" && !!option.group?.disabled;

function getUniqueOptions(source: TypeaheadOption[], comparison: TypeaheadOption[]) {
  const comparisonSet = new Set(comparison.map((x) => (typeof x === "string" ? x : x.value)));
  return source.filter((x) => (typeof x === "string" ? !comparisonSet.has(x) : !comparisonSet.has(x.value)));
}

const renderHighlightedOptionFunction = (
  props: React.HTMLAttributes<HTMLLIElement>,
  option: TypeaheadOption,
  { inputValue }: AutocompleteRenderOptionState,
) => {
  const finalOption = typeof option === "string" ? option : option.label;
  const matches = AutosuggestHighlightMatch(finalOption, inputValue, { insideWords: true });
  const parts = AutosuggestHighlightParse(finalOption, matches) as Array<{ text: string; highlight: boolean }>;
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

export {
  getSingleAutoCompleteValue,
  getMultipleAutoCompleteValue,
  convertAutoCompleteOptionsToStringArray,
  sortOptionsByGroup,
  isDisabledGroup,
  groupOptions,
  getUniqueOptions,
  renderHighlightedOptionFunction,
};
