import { SxProps } from "@mui/material/styles";

const textFieldBootstrapStyle: SxProps = {
  ".MuiOutlinedInput-root": {
    minHeight: "36.39px",
    border: "1px solid #dee2e6",
    fontSize: "0.875rem",
    fontWeight: "400",
    color: "#5d636d",
    padding: "0px 12px",
    borderColor: "#E0E3E7",
    transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",

    // override padding for mui inputs to match bootstrap's default input padding
    "& .MuiInputBase-input": {
      padding: "0px 12px",
    },

    // override default padding when text-field is wrapped by autocomplete
    ".MuiAutocomplete-root &": {
      padding: "0px 12px",
    },

    "&.Mui-focused": {
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
    "& .MuiAutocomplete-input": {
      padding: "0px 0px !important",
      fontSize: "14px",
    },
    "&.Mui-error": {
      borderColor: "#dc3545",
    },
    "&.Mui-focused.Mui-error": {
      boxShadow: "0 0 0 0.2rem rgba(220,53,69,.25)",
    },
    "& .MuiChip-root": {
      backgroundColor: "#e9ecef",
      color: "#495057",
      fontSize: "0.875rem",
      borderRadius: "0.25rem",
      display: "flex",
    },
    "& .MuiChip-deleteIcon": {
      color: "#495057",
      fontSize: "0.875rem",
    },
    "& .MuiIconButton-root": {
      padding: 0,
    },
  },
  "& fieldset": {
    border: "none",
  },
  "& .MuiFormHelperText-root": {
    marginLeft: "0.2rem",
    marginTop: "0.3rem",
  },
};

export { textFieldBootstrapStyle };
