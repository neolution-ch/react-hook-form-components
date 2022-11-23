import { Option } from "react-bootstrap-typeahead/types/types";
import { LabelValueOption } from "../types/LabelValueOption";

const convertTypeaheadOptionsToStringArray = (options: Option[]): string[] => {
  if (typeof options[0] === "string") {
    return options as string[];
  }

  return (options as LabelValueOption[]).map((option: LabelValueOption) => option.value);
};

export { convertTypeaheadOptionsToStringArray };
