import React from "react";
import { Option } from "react-bootstrap-typeahead/types/types";
import { Menu, MenuItem } from "react-bootstrap-typeahead";
import { RenderMenuProps } from "react-bootstrap-typeahead/types/components/Typeahead";
import { LabelValueOption } from "../types/LabelValueOption";

const convertTypeaheadOptionsToStringArray = (options: Option[]): string[] => {
  const isStringArray = options.length > 0 && options.every((value) => typeof value === "string");

  if (isStringArray) {
    return options as string[];
  }

  return (options as Record<string, string>[]).map((option) => option.value);
};

const renderMenu = (results: LabelValueOption[], menuProps: RenderMenuProps): JSX.Element => {
  const groupedOptions = results.reduce((result, option) => {
    const groupKey = option.group?.name;
    if (groupKey) (result[groupKey] = result[groupKey] || []).push(option);
    return result;
  }, {} as Record<string, LabelValueOption[]>);
  const groups = Object.keys(groupedOptions);
  let position = 0;

  return (
    <Menu {...menuProps}>
      {groups.map((group, index) => (
        <React.Fragment key={index}>
          <Menu.Header>{group}</Menu.Header>
          {groupedOptions[group]?.map((option) => (
            <MenuItem
              key={option.value}
              option={option}
              position={position++}
              disabled={option.disabled || option.group?.disabled}
              className="ps-4"
            >
              {option.label}
            </MenuItem>
          ))}
          {index < groups.length - 1 && <Menu.Divider />}
        </React.Fragment>
      ))}
    </Menu>
  );
};

export { convertTypeaheadOptionsToStringArray, renderMenu };
