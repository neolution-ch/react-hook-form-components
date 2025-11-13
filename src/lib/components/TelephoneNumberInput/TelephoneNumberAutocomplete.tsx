import { Dispatch, SetStateAction, useMemo, useRef } from "react";
import { FieldValues, Path, PathValue } from "react-hook-form";
import { Country, getCountriesOptions, getCountryFromCountryCode } from "../../helpers/telephoneNumber";
import { TelephoneNumberInputProps } from "../../TelephoneNumberInput";
import { LabelValueOption } from "../../types/LabelValueOption";
import { RegionCode } from "google-libphonenumber";
import { isNullOrWhitespace } from "@neolution-ch/javascript-utils";
import Autocomplete from "@mui/material/Autocomplete";
import { useFormContext } from "../../context/FormContext";
import { PopupState } from "material-ui-popup-state/hooks";
import { TextField } from "@mui/material";
import { textFieldBootstrapStyle } from "src/lib/helpers/mui";

interface TelephoneNumberAutocompleteProps<T extends FieldValues>
  extends Pick<TelephoneNumberInputProps<T>, "pinnedCountries" | "locale" | "useBootstrapStyle" | "name" | "onChange"> {
  popupState: PopupState;
  nationalPhoneNumber: string | undefined;
  country: Country;
  setCountry: Dispatch<SetStateAction<Country>>;
}

const TelephoneNumberAutocomplete = <T extends FieldValues>(props: TelephoneNumberAutocompleteProps<T>) => {
  const {
    pinnedCountries = [],
    locale,
    useBootstrapStyle,
    name,
    onChange: propsOnChange,
    popupState,
    nationalPhoneNumber,
    country,
    setCountry,
  } = props;

  const countryOptions: LabelValueOption[] = useMemo(() => getCountriesOptions(pinnedCountries, locale), [locale, pinnedCountries]);
  const { setValue } = useFormContext<T>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <Autocomplete
      options={countryOptions}
      value={countryOptions.find((x) => x.value === country.region) || null}
      disableClearable={false}
      getOptionDisabled={(option) => option.disabled ?? false}
      renderInput={(params) => <TextField {...params} inputRef={inputRef} />}
      sx={{ ...(useBootstrapStyle && textFieldBootstrapStyle), width: 200 }}
      onChange={(_, value, reason) => {
        // cannot be cleared
        if (reason === "clear") {
          inputRef.current?.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
          return;
        }

        if (value === null) {
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
    />
  );
};

export { TelephoneNumberAutocomplete };
