import { Option } from "react-bootstrap-typeahead/types/types";

const convertTypeaheadOptionsToStringArray = (options: Option[]): string[] => {
  const isStringArray = options.length > 0 && options.every((value) => typeof value === "string");

  if (isStringArray) {
    return options as string[];
  }

  return (options as Record<string, string>[]).map((option) => option.value);
};

export { convertTypeaheadOptionsToStringArray };
