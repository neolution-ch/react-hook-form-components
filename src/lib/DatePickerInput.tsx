import { Controller, FieldValues } from "react-hook-form";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { StandaloneFormGroupLayout } from "./StandaloneFormGroupLayout";
import { CommonInputProps } from "./types/CommonInputProps";
import DatePicker, { ReactDatePickerProps } from "react-datepicker";
import { useCallback, useEffect, useState, MutableRefObject, useRef } from "react";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import { useFormContext } from "./context/FormContext";
import { v4 as guidGen } from "uuid";
import { getUtcTimeZeroDate } from "./helpers/dateUtils";
import classNames from "classnames";
import { StandaloneDatePickerInput } from "./StandaloneDatePickerInput";

interface DatePickerRenderAddonProps {
  toggleDatePicker: () => void;
}

interface DatePickerInputProps<T extends FieldValues> extends Omit<CommonInputProps<T, DatePickerRenderAddonProps>, "onChange" | "style"> {
  /**
   * The props for the date picker component: https://reactdatepicker.com/
   */
  datePickerProps?: Omit<ReactDatePickerProps, "onChange" | "selected" | "id" | "className" | "onBlur" | "autoComplete">;

  /**
   * The onChange handler for the date picker component.
   * @param value The selected date or null if the user cleared the date.
   */
  onChange?: (value: Date | null) => void;

  /**
   * The IANA time zone identifier, e.g. "Europe/Berlin" for which the date should be displayed.
   * By default the date is displayed in the local time zone of the user / browser.
   * @example "Europe/Berlin"
   * @example "America/New_York"
   */
  ianaTimeZone?: string;

  /**
   * The ref of the date picker component.
   */
  datePickerRef?: MutableRefObject<DatePicker<never, undefined> | null>;

  /**
   * The autoComplete property for the date picker component.
   * By default set as "off".
   */
  autoComplete?: string;
}

const DEFAULT_DATE_FORMAT = "dd.MM.yyyy";
const DEFAULT_DATE_TIME_FORMAT = "dd.MM.yyyy HH:mm";

const DatePickerInput = <T extends FieldValues>(props: DatePickerInputProps<T>) => {
  const {
    disabled,
    label,
    helpText,
    datePickerProps = {},
    labelToolTip,
    addonLeft,
    addonRight,
    ianaTimeZone,
    className = "",
    autoComplete = "off",
    inputGroupStyle,
    datePickerRef,
    name: initialName,
    id: initialId,
    hideValidationMessage = false,
  } = props;

  const { id, name } = useSafeNameId(initialName, initialId);
  const { control, getValues, setValue, disabled: formDisabled } = useFormContext();
  const internalDatePickerRef = useRef<DatePicker>();
  const formGroupId = useRef(guidGen());
  const { calendarStartDay = 1, showTimeInput = false, showTimeSelect = false, dateFormat } = datePickerProps;
  const showTimeInputOrSelect = showTimeInput || showTimeSelect;
  const effectiveDateFormat = dateFormat || (showTimeInputOrSelect ? DEFAULT_DATE_TIME_FORMAT : DEFAULT_DATE_FORMAT);
  const isDisabled = disabled || formDisabled;

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

  const toggleDatePicker = useCallback(() => {
    if (!isDisabled) {
      internalDatePickerRef.current?.setOpen(!internalDatePickerRef.current?.isCalendarOpen());
    }
  }, [isDisabled]);

  const datePickerClassNames = classNames(className, "form-control", {
    "border-start-0 rounded-0 rounded-end": !!addonLeft,
    "border-end-0 rounded-0 rounded-start": !!addonRight,
  });

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <StandaloneFormGroupLayout
          helpText={helpText}
          formGroupId={formGroupId.current}
          name={props.name}
          id={id}
          label={label}
          labelToolTip={labelToolTip}
          addonLeft={addonLeft}
          addonRight={addonRight}
          addonProps={{ toggleDatePicker, isDisabled }}
          inputGroupStyle={!!addonLeft || !!addonRight ? { ...inputGroupStyle, alignItems: "normal" } : inputGroupStyle}
          hideValidationMessage={hideValidationMessage}
        >
          <StandaloneDatePickerInput
            {...datePickerProps}
            disabled={isDisabled}
            className={`${datePickerClassNames} ${error ? "is-invalid" : ""}`}
            dateFormat={effectiveDateFormat}
            calendarStartDay={calendarStartDay}
            autoComplete={autoComplete}
            selected={selectedDate}
            ref={(elem) => {
              // https://github.com/react-hook-form/react-hook-form/discussions/5413
              // https://codesandbox.io/s/react-hook-form-focus-forked-yyhsi?file=/src/index.js
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
              elem && field.ref((elem as any).input);

              internalDatePickerRef.current = elem as DatePicker<never>;

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
              if (document.getElementById(formGroupId.current)?.contains(e.target as HTMLElement) && !disabled && !formDisabled) {
                internalDatePickerRef.current?.setOpen(true);
              }

              if (datePickerProps.onClickOutside) {
                datePickerProps.onClickOutside(e);
              }
            }}
          />
        </StandaloneFormGroupLayout>
      )}
    />
  );
};

export { DatePickerInput, DatePickerInputProps };
