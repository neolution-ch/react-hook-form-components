import TextField from "@mui/material/TextField";
import { textFieldBootstrapStyle } from "../../helpers/mui";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import DownloadingSharpIcon from "@mui/icons-material/DownloadingSharp";
import { AutocompleteRenderInputParams, IconButton } from "@mui/material";
import { ReactNode, useMemo } from "react";
import { CommonTypeaheadProps } from "../../types/Typeahead";
import { FieldError, FieldValues, get } from "react-hook-form";
import { MergedAddonProps } from "../../types/CommonInputProps";
import { useFormContext } from "../../context/FormContext";

interface TypeaheadTextFieldProps<T extends FieldValues, TRenderAddon>
  extends Omit<CommonTypeaheadProps<T>, "id" | "disabled" | "onChange">,
    AutocompleteRenderInputParams {
  isLoading: boolean;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  loadMoreOptions: boolean;
  addonProps?: MergedAddonProps<TRenderAddon>;
}

// eslint-disable-next-line complexity
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
    variant,
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
  } = useFormContext();

  const fieldError = get(errors, name) as FieldError | undefined;
  const hasError = useMemo(() => !!fieldError, [fieldError]);
  const errorMessage = useMemo(() => String(fieldError?.message), [fieldError]);
  const hideErrorMessage = useMemo(() => hideValidationMessages || hideValidationMessage, [hideValidationMessages, hideValidationMessage]);

  const fieldIsRequired = label && typeof label === "string" && requiredFields.includes(name);
  const finalLabel = useMemo(() => (fieldIsRequired ? `${String(label)} *` : label), [fieldIsRequired, label]);

  const startAdornment = useMemo(
    () =>
      addonLeft instanceof Function && addonProps
        ? (addonLeft as unknown as (props: TRenderAddon) => ReactNode)(addonProps)
        : (addonLeft as ReactNode),
    [addonLeft, addonProps],
  );

  const endAdornment = useMemo(
    () =>
      addonRight instanceof Function && addonProps
        ? (addonRight as unknown as (props: TRenderAddon) => ReactNode)(addonProps)
        : (addonRight as ReactNode),
    [addonRight, addonProps],
  );

  return (
    <TextField
      {...params}
      style={style}
      sx={{ ...(useBootstrapStyle && textFieldBootstrapStyle) }}
      variant={useBootstrapStyle ? undefined : variant}
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
                <InputAdornment position="start" disablePointerEvents={addonProps?.isDisabled}>
                  {startAdornment}
                </InputAdornment>
              )}
              {params.InputProps.startAdornment}
            </>
          ),
          endAdornment: (
            <>
              {isLoading ? (
                <InputAdornment position="end">
                  <CircularProgress color="inherit" size={20} />
                </InputAdornment>
              ) : (
                endAdornment && (
                  <InputAdornment position="end" disablePointerEvents={addonProps?.isDisabled}>
                    {endAdornment}
                  </InputAdornment>
                )
              )}
              {loadMoreOptions && limitResults && (
                <IconButton title={paginationText ?? `Load ${limitResults} more`} size="small" onClick={() => setPage((prev) => prev + 1)}>
                  {paginationIcon ?? <DownloadingSharpIcon fontSize="small" />}
                </IconButton>
              )}
              {params.InputProps.endAdornment}
            </>
          ),
        },
      }}
    />
  );
};

export { TypeaheadTextField };
