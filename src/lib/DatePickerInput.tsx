import { Controller, FieldValues, useFormContext } from "react-hook-form";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { FormGroupLayout } from "./FormGroupLayout";
import { CommonInputProps } from "./types/CommonInputProps";
import DatePicker, { ReactDatePickerProps } from "react-datepicker";
import { useCallback, useEffect, useState } from "react";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import { getUtcTimeZeroDate } from "./helpers/dateUtils";

interface DatePickerInputProps<T extends FieldValues> extends Omit<CommonInputProps<T>, "onChange"> {
  datePickerProps?: Omit<ReactDatePickerProps, "onChange" | "selected" | "id" | "className" | "onBlur">;
  onChange?: (value: Date | null) => void;
  /**
   * The IANA time zone identifier, e.g. "Europe/Berlin" for which the date should be displayed.
   * By default the date is displayed in the local time zone of the user / browser.
   * @example "Europe/Berlin"
   * @example "America/New_York"
   */
  ianaTimeZone?: string;
}

const DatePickerInput = <T extends FieldValues>(props: DatePickerInputProps<T>) => {
  const { disabled, label, helpText, datePickerProps, labelToolTip, addonLeft, addonRight, ianaTimeZone } = props;

  const { name, id } = useSafeNameId(props.name, props.id);
  const { control, getValues, setValue } = useFormContext();

  const { dateFormat = "dd.MM.yyyy", calendarStartDay = 1, showTimeInput = false, showTimeSelect = false } = datePickerProps || {};

  const timeIncluded =
    showTimeInput || showTimeSelect || dateFormat.includes("HH") || dateFormat.includes("mm") || dateFormat.includes("ss");

  if (ianaTimeZone && !timeIncluded) {
    throw new Error("If you use ianaTimeZone, you have to include time in the dateFormat or set showTimeInput or showTimeSelect to true");
  }

  const getInitialDate = (): Date | null => {
    const value = getValues(name) as Date | null;

    if (!value) return null;

    if (!timeIncluded) return getUtcTimeZeroDate(value);

    if (!ianaTimeZone) return value;

    return utcToZonedTime(value, ianaTimeZone);
  };

  const getConvertedDate = useCallback(
    (date: Date | null): Date | null => {
      if (!date) return null;

      if (!timeIncluded) return getUtcTimeZeroDate(date);

      if (!ianaTimeZone) return date;

      return zonedTimeToUtc(date, ianaTimeZone);
    },
    [ianaTimeZone, timeIncluded],
  );

  const [selectedDate, setSelectedDate] = useState<Date | null>(getInitialDate());

  // setting the value here once the component is mounted
  // so we have the corrected date in the form
  useEffect(() => {
    setValue(name, getConvertedDate(selectedDate));
  }, [name, selectedDate, setValue, getConvertedDate]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormGroupLayout
          helpText={helpText}
          name={name}
          id={id}
          label={label}
          labelToolTip={labelToolTip}
          addonLeft={addonLeft}
          addonRight={addonRight}
        >
          <DatePicker
            {...datePickerProps}
            {...field}
            id={id}
            disabled={disabled}
            className="form-control"
            dateFormat={dateFormat}
            calendarStartDay={calendarStartDay}
            wrapperClassName={error ? "is-invalid" : ""}
            selected={selectedDate}
            ref={(elem) => {
              // https://github.com/react-hook-form/react-hook-form/discussions/5413
              // https://codesandbox.io/s/react-hook-form-focus-forked-yyhsi?file=/src/index.js
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
              elem && field.ref((elem as any).input);
            }}
            onBlur={(e) => {
              if (props.onBlur) props.onBlur(e);
              field.onBlur();
            }}
            onChange={(date) => {
              setSelectedDate(date);

              const convertedDate = getConvertedDate(date);

              if (props.onChange) props.onChange(convertedDate);

              field.onChange(convertedDate);
            }}
          />
        </FormGroupLayout>
      )}
    />
  );
};

export { DatePickerInput, DatePickerInputProps };
