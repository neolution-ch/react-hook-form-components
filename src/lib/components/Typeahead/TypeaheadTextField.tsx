import TextField, { BaseTextFieldProps } from "@mui/material/TextField";
import { textFieldBootstrapStyle, getTypeaheadAddonLayoutStyle } from "../../helpers/mui";
import CircularProgress from "@mui/material/CircularProgress";
import DownloadingSharpIcon from "@mui/icons-material/DownloadingSharp";
import { AutocompleteRenderInputParams, IconButton, InputAdornment } from "@mui/material";
import { ReactNode, useMemo } from "react";
import { CommonTypeaheadProps } from "../../types/Typeahead";
import { FieldError, FieldValues, get } from "react-hook-form";
import { MergedAddonProps } from "../../types/CommonInputProps";
import { useFormContext } from "../../context/FormContext";
import { getRequiredLabel } from "../../helpers/form";

interface TypeaheadTextFieldProps<T extends FieldValues, TRenderAddon>
  extends
    Omit<CommonTypeaheadProps<T>, "id" | "disabled" | "onChange">,
    AutocompleteRenderInputParams,
    Pick<BaseTextFieldProps, "inputRef"> {
  isLoading: boolean;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  loadMoreOptions: boolean;
  addonProps?: MergedAddonProps<TRenderAddon>;
}

const TypeaheadTextField = <T extends FieldValues, TRenderAddon = unknown>(props: TypeaheadTextFieldProps<T, TRenderAddon>) => {
  const {
    name,
    label,
    addonLeft,
    addonRight,
    addonProps,
    style,
    hideValidationMessage,
    useBootstrapStyle,
    helpText,
    placeholder,
    paginationIcon,
    paginationText,
    limitResults,
    isLoading,
    loadMoreOptions,
    setPage,
    ...params
  } = props;

  const {
    formState: { errors },
    requiredFields,
    hideValidationMessages,
  } = useFormContext<T>();

  const fieldError = get(errors, name) as FieldError | undefined;
  const hasError = useMemo(() => !!fieldError, [fieldError]);
  const errorMessage = useMemo(() => String(fieldError?.message), [fieldError]);
  const hideErrorMessage = useMemo(() => hideValidationMessages || hideValidationMessage, [hideValidationMessages, hideValidationMessage]);
  const finalLabel = useMemo(() => getRequiredLabel<T>(label, name, requiredFields), [label, name, requiredFields]);

  const startAdornment = useMemo(
    () =>
      typeof addonLeft === "function" && addonProps
        ? (addonLeft as unknown as (props: TRenderAddon) => ReactNode)(addonProps)
        : (addonLeft as ReactNode),
    [addonLeft, addonProps],
  );

  const endAdornment = useMemo(
    () =>
      typeof addonRight === "function" && addonProps
        ? (addonRight as unknown as (props: TRenderAddon) => ReactNode)(addonProps)
        : (addonRight as ReactNode),
    [addonRight, addonProps],
  );

  return (
    <TextField
      {...params}
      style={style}
      sx={{
        ...(useBootstrapStyle && textFieldBootstrapStyle),
        ...getTypeaheadAddonLayoutStyle(useBootstrapStyle),
      }}
      variant="outlined"
      error={hasError}
      label={useBootstrapStyle ? undefined : finalLabel}
      helperText={hasError && !hideErrorMessage ? errorMessage : helpText}
      placeholder={placeholder}
      slotProps={{
        input: {
          ...params.InputProps,
          startAdornment: (
            <>
              {startAdornment && (
                <InputAdornment
                  position="start"
                  className={`typeahead-addon-start${params.InputProps.startAdornment ? "" : " typeahead-addon-start--no-values"}`}
                >
                  {startAdornment}
                </InputAdornment>
              )}
              {params.InputProps.startAdornment && <div className="typeahead-values">{params.InputProps.startAdornment}</div>}
            </>
          ),
          endAdornment: (
            <InputAdornment position="end" className="typeahead-addon-end">
              {isLoading && <CircularProgress color="inherit" size={20} />}
              {endAdornment}
              {loadMoreOptions && limitResults && (
                <IconButton title={paginationText ?? `Load ${limitResults} more`} onClick={() => setPage((prev) => prev + 1)}>
                  {paginationIcon ?? <DownloadingSharpIcon fontSize="small" />}
                </IconButton>
              )}
              {params.InputProps.endAdornment}
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export { TypeaheadTextField };
