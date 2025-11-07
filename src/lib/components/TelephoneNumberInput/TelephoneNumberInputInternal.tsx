import TextField from "@mui/material/TextField";
import PopupState, { bindPopover } from "material-ui-popup-state";
import { FieldError, FieldValues, get, Path, PathValue, useController } from "react-hook-form";
import { useMarkOnFocusHandler } from "../../hooks/useMarkOnFocusHandler";
import { textFieldBootstrapStyle } from "../../helpers/mui";
import { useFormContext } from "../../context/FormContext";
import { useEffect, useMemo, useRef, useState } from "react";
import Popover from "@mui/material/Popover";
import { TelephoneNumberInputProps } from "../../TelephoneNumberInput";
import { LabelValueOption } from "../../types/LabelValueOption";
import { PhoneNumberUtil, RegionCode } from "google-libphonenumber";
import { getName, langs } from "i18n-iso-countries";
import {
  Country,
  extractCountryCodeFromTelephoneNumber,
  extractNationalNumberFromTelephoneNumber,
  getCountryFromCountryCode,
} from "../../helpers/telephoneNumber";
import { isNullOrWhitespace } from "@neolution-ch/javascript-utils";
import Autocomplete from "@mui/material/Autocomplete";
import { TelephoneNumberInputAdornment } from "./TelephoneNumberInputButton";

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
    locale,
  } = props;
  const {
    control,
    disabled: formDisabled,
    getFieldState,
    setValue,
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
  const fieldIsRequired = label && typeof label === "string" && requiredFields.includes(name);
  const finalLabel = useMemo(() => (fieldIsRequired ? `${String(label)} *` : label), [fieldIsRequired, label]);

  const countryOptions: LabelValueOption[] = useMemo(() => {
    const phoneNumberUtil = new PhoneNumberUtil();
    const registeredLocales = langs();
    const internalLocale =
      registeredLocales.length === 1
        ? registeredLocales[0]
        : !isNullOrWhitespace(locale) && registeredLocales.includes(locale as string)
          ? locale
          : undefined;

    return phoneNumberUtil.getSupportedRegions().map((region) => ({
      label: isNullOrWhitespace(internalLocale) ? region : getName(region, internalLocale as string) || region,
      value: region,
    }));
  }, [locale]);

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
            className={`MuiColorInput-TextField ${className}`}
            sx={{ ...(useBootstrapStyle && textFieldBootstrapStyle), m: 1 }}
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
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            {renderAutocompleteField(
              <Autocomplete
                options={countryOptions}
                value={countryOptions.find((x) => x.value === country.region) || null}
                disableClearable={false}
                renderInput={(params) => <TextField {...params} />}
                sx={{ ...(useBootstrapStyle && textFieldBootstrapStyle), width: 200 }}
                onChange={(_, value, reason) => {
                  // cannot be cleared
                  if (value === null || reason === "clear") {
                    return;
                  }

                  const country = getCountryFromCountryCode(value.value as RegionCode);
                  setCountry(country);
                  // the value in the form is probably undefined, therefore do not touch the form value
                  if (isNullOrWhitespace(nationalPhoneNumber)) {
                    // nothing to do, value in the form is not changing
                  } else {
                    const telephoneNumber = `+${country.code}${nationalPhoneNumber || ""}`;

                    if (propsOnChange) {
                      propsOnChange(telephoneNumber);
                    }

                    setValue(name, telephoneNumber as PathValue<T, Path<T>>);
                  }

                  popupState.close();
                }}
              />,
            )}
          </Popover>
        </>
      )}
    </PopupState>
  );
};

export { TelephoneNumberInputInternal };
