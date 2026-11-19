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
  },
  "& fieldset": {
    border: "none",
  },
  "& .MuiFormHelperText-root": {
    marginLeft: "0.2rem",
    marginTop: "0.3rem",
  },
};

/**
 * Lays out an autocomplete text field as [addon start] [values + input] [addon end].
 * MUI positions its clear/popup icons absolutely and reserves space with a fixed padding-right;
 * here they are rendered inside the end addon group as regular flex items instead.
 * @param useBootstrapStyle whether the bootstrap style is used
 * @returns the sx props for the text field
 */
const getTypeaheadAddonLayoutStyle = (useBootstrapStyle?: boolean) => ({
  "& .MuiAutocomplete-inputRoot.MuiInputBase-root": {
    flexWrap: "nowrap",
    alignItems: "center",
  },
  // higher specificity than the MUI `.MuiAutocomplete-hasPopupIcon.MuiAutocomplete-hasClearIcon` padding rule
  "& .MuiAutocomplete-inputRoot.MuiInputBase-root.MuiInputBase-formControl.MuiInputBase-adornedEnd": {
    paddingRight: useBootstrapStyle ? "12px" : "9px",
  },
  "& .typeahead-addon-start, & .typeahead-addon-end": {
    flexShrink: 0,
    height: "auto",
    maxHeight: "none",
  },
  "& .typeahead-values": {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    minWidth: 0,
  },
  "& .typeahead-addon-end": {
    marginLeft: "auto",
    paddingLeft: "8px",
  },
  "& .typeahead-addon-end .MuiAutocomplete-endAdornment": {
    position: "static",
    transform: "none",
    display: "flex",
    alignItems: "center",
  },
});

export { textFieldBootstrapStyle, getTypeaheadAddonLayoutStyle };
