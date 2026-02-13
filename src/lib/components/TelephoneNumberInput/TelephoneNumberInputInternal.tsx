import TextField from "@mui/material/TextField";
import PopupState, { bindPopover } from "material-ui-popup-state";
import { FieldError, FieldValues, get, useController } from "react-hook-form";
import { useMarkOnFocusHandler } from "../../hooks/useMarkOnFocusHandler";
import { textFieldBootstrapStyle } from "../../helpers/mui";
import { useFormContext } from "../../context/FormContext";
import { useEffect, useMemo, useRef, useState } from "react";
import Popover from "@mui/material/Popover";
import { TelephoneNumberInputProps } from "../../TelephoneNumberInput";
import { getRequiredLabel } from "../../helpers/form";
import { Country, extractCountryCodeFromTelephoneNumber, extractNationalNumberFromTelephoneNumber } from "../../helpers/telephoneNumber";
import { TelephoneNumberInputAdornment } from "./TelephoneNumberInputAdornment";
import { isNullOrWhitespace } from "@neolution-ch/javascript-utils";
import { TelephoneNumberAutocomplete } from "./TelephoneNumberAutocomplete";

const TelephoneNumberInputInternal = <T extends FieldValues>(props: TelephoneNumberInputProps<T>) => {
  const {
    name,
    id,
    label,
    disabled,
    helpText,
    defaultCountry,
    onChange: propsOnChange,
    onBlur: propsOnBlur,
    renderAutocompleteField = (children) => children,
    style,
    markAllOnFocus,
    className = "",
    useBootstrapStyle = false,
    hideValidationMessage,
    placeholder,
  } = props;
  const {
    control,
    disabled: formDisabled,
    getFieldState,
    requiredFields,
    formState: { errors },
    hideValidationMessages,
  } = useFormContext<T>();

  const focusHandler = useMarkOnFocusHandler(markAllOnFocus);
  const {
    field: { ref, ...field },
  } = useController<T>({
    name,
    control,
    rules: {
      validate: {
        required: () => getFieldState(name)?.error?.message,
      },
    },
  });

  const isDisabled = formDisabled || disabled;
  const fieldError = get(errors, name) as FieldError | undefined;
  const hideErrorMessage = useMemo(() => hideValidationMessages || hideValidationMessage, [hideValidationMessages, hideValidationMessage]);
  const hasError = useMemo(() => !!fieldError, [fieldError]);
  const errorMessage = useMemo(() => String(fieldError?.message), [fieldError]);
  const finalLabel = useMemo(() => getRequiredLabel<T>(label, name, requiredFields), [label, name, requiredFields]);

  // we need to control the country in the case the value inside the form is undefined
  const [country, setCountry] = useState<Country>(extractCountryCodeFromTelephoneNumber(field.value as string | undefined, defaultCountry));
  const resetCountry = useRef(true);

  useEffect(() => {
    if (resetCountry.current) {
      setCountry(extractCountryCodeFromTelephoneNumber(field.value as string | undefined, defaultCountry));
    }
    resetCountry.current = true;
  }, [defaultCountry, field.value]);

  const nationalPhoneNumber: string | undefined = useMemo(
    () => extractNationalNumberFromTelephoneNumber(field.value as string | undefined, country),
    [country, field.value],
  );

  return (
    <PopupState variant="popover" popupId={`popover-${name}`}>
      {(popupState) => (
        <>
          <TextField
            {...field}
            value={nationalPhoneNumber || ""}
            id={id}
            fullWidth
            className={className}
            sx={{ ...(useBootstrapStyle && textFieldBootstrapStyle) }}
            style={style}
            error={hasError}
            label={useBootstrapStyle ? undefined : finalLabel}
            helperText={hasError && !hideErrorMessage ? errorMessage : helpText}
            placeholder={placeholder}
            disabled={isDisabled}
            onFocus={focusHandler}
            onChange={(e) => {
              if (isNullOrWhitespace(e.target.value)) {
                // nothing to do
              } else {
                // the value in the form must always include the country prefix
                const numericValue = `${country.code}${e.target.value}`.replaceAll(/\D/g, "");
                e.target.value = `+${numericValue}`;
              }

              if (propsOnChange) {
                propsOnChange(e.target.value);
              }

              resetCountry.current = false;
              field.onChange(e);
            }}
            onBlur={(e) => {
              if (propsOnBlur) {
                propsOnBlur(e);
              }

              field.onBlur();
            }}
            slotProps={{
              input: {
                inputMode: "tel",
                startAdornment: <TelephoneNumberInputAdornment disabled={isDisabled} country={country} popupState={popupState} />,
              },
            }}
            inputRef={ref}
          />
          <Popover
            aria-hidden={false}
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            {renderAutocompleteField(
              <TelephoneNumberAutocomplete<T>
                {...props}
                popupState={popupState}
                nationalPhoneNumber={nationalPhoneNumber}
                country={country}
                setCountry={setCountry}
              />,
            )}
          </Popover>
        </>
      )}
    </PopupState>
  );
};

export { TelephoneNumberInputInternal };
