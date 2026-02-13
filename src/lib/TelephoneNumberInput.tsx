import { FieldPathByValue, FieldValues } from "react-hook-form";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { FormGroupLayout } from "./FormGroupLayout";
import { CommonInputProps } from "./types/CommonInputProps";
import { FocusEventHandler, ReactNode } from "react";
import { TelephoneNumberInputInternal } from "./components/TelephoneNumberInput/TelephoneNumberInputInternal";
import { RegionCode } from "google-libphonenumber";

interface TelephoneNumberInputProps<T extends FieldValues> extends Omit<
  CommonInputProps<T>,
  "minLength" | "maxLength" | "addonLeft" | "addonRight" | "name" | "onChange" | "onBlur"
> {
  useBootstrapStyle?: boolean;
  name: FieldPathByValue<T, string | undefined>;
  onChange?: (telephoneNumber: string) => void;
  onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  defaultCountry: RegionCode;
  pinnedCountries?: RegionCode[];
  placeholder?: string;
  renderAutocompleteField?: (children: ReactNode) => ReactNode;
  locale?: string;
  countryMenuWidth?: number;
}

const TelephoneNumberInput = <T extends FieldValues>(props: TelephoneNumberInputProps<T>) => {
  const { label, helpText, inputGroupStyle, labelToolTip, hideValidationMessage = false, useBootstrapStyle } = props;
  const { name, id } = useSafeNameId(props.name, props.id);

  return (
    <FormGroupLayout
      helpText={helpText}
      name={name}
      id={id}
      labelToolTip={labelToolTip}
      inputGroupStyle={inputGroupStyle}
      hideValidationMessage={hideValidationMessage}
      label={useBootstrapStyle ? label : undefined}
      labelStyle={useBootstrapStyle ? { color: "#8493A5", fontSize: 14 } : undefined}
      layout="muiInput"
    >
      <TelephoneNumberInputInternal {...props} name={name} id={id} />
    </FormGroupLayout>
  );
};

export { TelephoneNumberInput, TelephoneNumberInputProps };
