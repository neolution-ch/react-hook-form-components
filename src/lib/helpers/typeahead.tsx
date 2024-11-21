import React from "react";
import { Option } from "react-bootstrap-typeahead/types/types";
import { Menu, MenuItem } from "react-bootstrap-typeahead";
import { RenderMenuProps } from "react-bootstrap-typeahead/types/components/Typeahead";
import { LabelValueOption } from "../types/LabelValueOption";
import { alpha, styled } from "@mui/material/styles";
import { InputBase } from "@mui/material";
import { TypeaheadOptions } from "../types/Typeahead";

const convertTypeaheadOptionsToStringArray = (options: Option[]): string[] => {
  const isStringArray = options.length > 0 && options.every((value) => typeof value === "string");

  if (isStringArray) {
    return options as string[];
  }

  return (options as Record<string, string>[]).map((option) => option.value);
};

const getAutoCompleteValue = (options: TypeaheadOptions, value: string | string[] | undefined) => {
  if (options[0] === undefined) {
    return undefined;
  }

  // if value is array means that the autocomplete is multiple
  if (Array.isArray(value)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return options.filter(x => typeof x === "string" ? value.includes(x) : value.includes((x as LabelValueOption).value as string));
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return options.find((x) => typeof x === "string" ? x === value : (x as LabelValueOption).value == value);
}

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
      {!!anonymousOptions.length && <Menu.Divider />}
      {anonymousOptions.map((option) => (
        <MenuItem key={option.value} option={option} position={position++} disabled={option.disabled}>
          {option.label}
        </MenuItem>
      ))}
    </Menu>
  );
};

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: "#F3F6F9",
    border: "1px solid",
    borderColor: "#E0E3E7",
    fontSize: 16,
    width: "auto",
    padding: "10px 12px",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
    ...theme.applyStyles("dark", {
      backgroundColor: "#1A2027",
      borderColor: "#2D3843",
    }),
  },
}));

export { convertTypeaheadOptionsToStringArray, renderMenu, getAutoCompleteValue, BootstrapInput };
