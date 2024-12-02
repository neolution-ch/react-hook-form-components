import { LabelValueOption } from "../types/LabelValueOption";
import { alpha, styled } from "@mui/material/styles";
import { InputBase } from "@mui/material";
import { TypeaheadOption } from "../types/Typeahead";

const convertAutoCompleteOptionsToStringArray = (options: (TypeaheadOption)[] | undefined): string[] => {
  if (!options) {
    return [];
  }
  const isStringArray = options.length > 0 && options.every((value) => typeof value === "string");
  if (isStringArray) {
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
  if (options[0] === undefined || value === undefined) {
    return undefined;
  }
  return options.filter((x) => (typeof x === "string" ? value.includes(x) : value.includes(x.value as string))) as string[] | LabelValueOption[] | undefined;
};

const sortOptionsByGroup = (options: TypeaheadOption[]): TypeaheadOption[] => {
  const isStringArray = options.length > 0 && options.every((value) => typeof value === "string");
  if (isStringArray) return options.sort();
  return options.sort((x, y) => {
    const formattedX =  typeof x === "string" ? x : x.group?.name ?? "";
    const formattedY = typeof y === "string" ? y : y.group?.name ?? "";
    return formattedX.localeCompare(formattedY);
  });
};

const groupOptions = (option: TypeaheadOption): string => typeof option === "string" ? option : option.group?.name ?? "";

const isDisabledGroup = (option: TypeaheadOption): boolean => typeof option !== "string" && !!option.group?.disabled;

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
    transition: theme.transitions.create(["border-color", "background-color", "box-shadow"]),
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

export { convertAutoCompleteOptionsToStringArray, getSingleAutoCompleteValue, getMultipleAutoCompleteValue, sortOptionsByGroup, groupOptions, isDisabledGroup, BootstrapInput };