import { isNullOrWhitespace } from "@neolution-ch/javascript-utils";
import { PhoneNumberUtil, RegionCode, RegionCodeUnknown } from "google-libphonenumber";

interface Country {
  region: RegionCode;
  code: number;
}

const getCountryFromCountryCode = (region: RegionCode): Country => {
  const phoneNumberUtil = new PhoneNumberUtil();
  return {
    region,
    code: phoneNumberUtil.getCountryCodeForRegion(region),
  };
};

const extractCountryCodeFromTelephoneNumber = (telephoneNumber: string | undefined, defaultCountryCode: RegionCode): Country => {
  const defaultCountry = getCountryFromCountryCode(defaultCountryCode);
  // In case of undefined, just return the default country
  if (isNullOrWhitespace(telephoneNumber)) {
    return defaultCountry;
  }

  const phoneNumberUtil = new PhoneNumberUtil();
  // number is considered valid if it starts with + or 00
  const telephoneNumberInternal = telephoneNumber!.startsWith("00") ? telephoneNumber!.replace("00", "+") : (telephoneNumber as string);

  // try parsing it with google libphonenumber
  // in case of failure, try to extract the country code manually as google libphonenumber is very strict on valid numbers
  try {
    const unknownCountry: RegionCodeUnknown = "ZZ";
    const code = phoneNumberUtil.parse(telephoneNumberInternal, unknownCountry).getCountryCode();

    // try to read the region code manually
    if (code === undefined) {
      throw new Error("Country code undefined");
    }

    return {
      region: phoneNumberUtil.getRegionCodeForCountryCode(code) as RegionCode,
      code,
    };
  } catch {
    if (!telephoneNumberInternal.startsWith("+")) {
      return defaultCountry;
    }

    // this is a special case in which the number is not fully valid, but still try to extract the country code
    const digits = telephoneNumberInternal.replace("+", "");
    for (let len = 1; len <= 3; len++) {
      const code = digits.slice(0, len);
      const foundRegion = phoneNumberUtil.getRegionCodeForCountryCode(Number(code));
      if (foundRegion !== "ZZ") {
        return getCountryFromCountryCode(foundRegion);
      }
    }
    return defaultCountry;
  }
};

const extractNationalNumberFromTelephoneNumber = (number: string | undefined, country: Country): string | undefined => {
  if (isNullOrWhitespace(number)) {
    return number;
  }

  const telephoneNumber = number as string;

  try {
    return new PhoneNumberUtil().parse(telephoneNumber, country.region).getNationalNumber()?.toString();
  } catch {
    const stringCountryCode = String(country.code);
    const indexOfCountryCode = telephoneNumber.indexOf(stringCountryCode);

    // The number is not valid, therefore do not lose any information and return the original number
    if (indexOfCountryCode === -1) {
      return telephoneNumber;
    }

    return telephoneNumber.slice(telephoneNumber.indexOf(stringCountryCode) + stringCountryCode.length);
  }
};

export { getCountryFromCountryCode, extractNationalNumberFromTelephoneNumber, extractCountryCodeFromTelephoneNumber, Country };
