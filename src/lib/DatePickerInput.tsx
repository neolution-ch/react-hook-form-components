import { Controller, FieldValues, useFormContext } from "react-hook-form";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { FormGroupLayout } from "./FormGroupLayout";
import { CommonInputProps } from "./types/CommonInputProps";
import DatePicker, { ReactDatePickerProps } from "react-datepicker";
import { useCallback, useEffect, useState, MutableRefObject } from "react";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import { getUtcTimeZeroDate } from "./helpers/dateUtils";
import { useInternalFormContext } from "./context/InternalFormContext";
import { v4 as guidGen } from "uuid";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import AddonInputForm from "src/lib/AddonInputForm";

interface DatePickerInputProps<T extends FieldValues> extends Omit<CommonInputProps<T>, "onChange" | "style" | "addonLeft" | "addonRight"> {
  datePickerProps?: Omit<ReactDatePickerProps, "onChange" | "selected" | "id" | "className" | "onBlur">;
  onChange?: (value: Date | null) => void;
  /**
   * The IANA time zone identifier, e.g. "Europe/Berlin" for which the date should be displayed.
   * By default the date is displayed in the local time zone of the user / browser.
   * @example "Europe/Berlin"
   * @example "America/New_York"
   */
  ianaTimeZone?: string;
  datePickerRef?: MutableRefObject<DatePicker<never, undefined> | null>;
  iconRight?: IconDefinition;
  iconLeft?: IconDefinition;
  iconSize?: string;
}

const DEFAULT_DATE_FORMAT = "dd.MM.yyyy";
const DEFAULT_DATE_TIME_FORMAT = "dd.MM.yyyy HH:mm";

const DatePickerInput = <T extends FieldValues>(props: DatePickerInputProps<T>) => {
  const { name, id } = useSafeNameId(props.name, props.id);
  const { control, getValues, setValue } = useFormContext();
  const { disabled: formDisabled } = useInternalFormContext<T>();

  const {
    disabled,
    label,
    helpText,
    datePickerProps = {},
    labelToolTip,
    ianaTimeZone,
    className = "",
    inputGroupStyle,
    datePickerRef,
    iconRight,
    iconLeft,
    iconSize = "lg",
  } = props;
  const { calendarStartDay = 1, showTimeInput = false, showTimeSelect = false, dateFormat } = datePickerProps;
  const showTimeInputOrSelect = showTimeInput || showTimeSelect;
  const effectiveDateFormat = dateFormat || (showTimeInputOrSelect ? DEFAULT_DATE_TIME_FORMAT : DEFAULT_DATE_FORMAT);
  const formGroupId = guidGen();

  if (ianaTimeZone && !showTimeInputOrSelect) {
    throw new Error("If you use ianaTimeZone, you have to include time in the dateFormat or set showTimeInput or showTimeSelect to true");
  }

  const getInitialDate = (): Date | null => {
    const value = getValues(name) as Date | null;

    if (!value) return null;

    if (!showTimeInputOrSelect) return getUtcTimeZeroDate(value);

    if (!ianaTimeZone) return value;

    return utcToZonedTime(value, ianaTimeZone);
  };

  const getConvertedDate = useCallback(
    (date: Date | null): Date | null => {
      if (!date) return null;

      if (!showTimeInputOrSelect) return getUtcTimeZeroDate(date);

      if (!ianaTimeZone) return date;

      return zonedTimeToUtc(date, ianaTimeZone);
    },
    [ianaTimeZone, showTimeInputOrSelect],
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
          inputGroupStyle={inputGroupStyle}
          formGroupId={formGroupId}
          addonRight={
            iconRight && (
              <AddonInputForm
                iconSize={iconSize}
                icon={iconRight}
                iconOnClick={() => datePickerRef && datePickerRef.current?.setOpen(!datePickerRef.current.isCalendarOpen())}
              />
            )
          }
          addonLeft={
            iconLeft && (
              <AddonInputForm
                iconSize={iconSize}
                icon={iconLeft}
                iconOnClick={() => datePickerRef && datePickerRef.current?.setOpen(!datePickerRef.current.isCalendarOpen())}
              />
            )
          }
        >
          <DatePicker
            {...datePickerProps}
            {...field}
            id={id}
            disabled={formDisabled || disabled}
            className={`${className} form-control`}
            dateFormat={effectiveDateFormat}
            calendarStartDay={calendarStartDay}
            wrapperClassName={error ? "is-invalid" : ""}
            selected={selectedDate}
            ref={(elem) => {
              // https://github.com/react-hook-form/react-hook-form/discussions/5413
              // https://codesandbox.io/s/react-hook-form-focus-forked-yyhsi?file=/src/index.js
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
              elem && field.ref((elem as any).input);
              if (datePickerRef) {
                datePickerRef.current = elem as DatePicker<never>;
              }
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
            onClickOutside={(e) => {
              if (document.getElementById(formGroupId)?.contains(e.target as HTMLElement) && datePickerRef) {
                datePickerRef.current?.setOpen(true);
              }
            }}
          />
        </FormGroupLayout>
      )}
    />
  );
};

export { DatePickerInput, DatePickerInputProps };
