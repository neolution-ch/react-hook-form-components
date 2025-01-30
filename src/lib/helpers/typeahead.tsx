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
  const groups = [...new Set(results.filter((x) => x.group?.name).map((option) => option.group?.name))];
  const anonymousOptions = results.filter((option) => !option.group?.name);
  let position = 0;

  return (
    <Menu {...menuProps}>
      {groups.map((group, index) => (
        <React.Fragment key={index}>
          <Menu.Header>{group}</Menu.Header>
          {results
            .filter((x) => x.group?.name === group)
            .map((option) => (
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
      {anonymousOptions.length > 0 && <Menu.Divider />}
      {anonymousOptions.map((option) => (
        <MenuItem key={option.value} option={option} position={position++} disabled={option.disabled}>
          {option.label}
        </MenuItem>
      ))}
    </Menu>
  );
};

export { convertTypeaheadOptionsToStringArray, renderMenu };
