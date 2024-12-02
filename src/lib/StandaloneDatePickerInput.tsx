import React, { useState, useRef, useCallback, useEffect } from "react";
import DatePicker from "react-datepicker";
import { getUtcTimeZeroDate } from "./helpers/dateUtils";
import classNames from "classnames";

interface StandaloneDatePickerInputProps {
  disabled?: boolean;
  label?: string;
  helpText?: string;
  datePickerProps?: Omit<ReactDatePickerProps, "onChange" | "selected" | "id" | "className" | "onBlur" | "autoComplete">;
  labelToolTip?: string;
  addonLeft?: React.ReactNode;
  addonRight?: React.ReactNode;
  ianaTimeZone?: string;
  className?: string;
  autoComplete?: string;
  inputGroupStyle?: React.CSSProperties;
  datePickerRef?: React.MutableRefObject<DatePicker<never, undefined> | null>;
  hideValidationMessage?: boolean;
  onChange?: (value: Date | null) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const DEFAULT_DATE_FORMAT = "dd.MM.yyyy";
const DEFAULT_DATE_TIME_FORMAT = "dd.MM.yyyy HH:mm";

const StandaloneDatePickerInput: React.FC<StandaloneDatePickerInputProps> = (props) => {
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
    hideValidationMessage = false,
    onChange,
    onBlur,
  } = props;

  const internalDatePickerRef = useRef<DatePicker>();
  const { calendarStartDay = 1, showTimeInput = false, showTimeSelect = false, dateFormat } = datePickerProps;
  const showTimeInputOrSelect = showTimeInput || showTimeSelect;
  const effectiveDateFormat = dateFormat || (showTimeInputOrSelect ? DEFAULT_DATE_TIME_FORMAT : DEFAULT_DATE_FORMAT);
  const isDisabled = disabled;

  if (ianaTimeZone && !showTimeInputOrSelect) {
    throw new Error("If you use ianaTimeZone, you have to include time in the dateFormat or set showTimeInput or showTimeSelect to true");
  }

  const getConvertedDate = useCallback(
    (date: Date | null): Date | null => {
      if (!date) return null;

      if (!showTimeInputOrSelect) return getUtcTimeZeroDate(date);

      if (!ianaTimeZone) return date;

      return zonedTimeToUtc(date, ianaTimeZone);
    },
    [ianaTimeZone, showTimeInputOrSelect],
  );

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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
    <div className="form-group">
      {label && (
        <label>
          {label}
          {labelToolTip && <span className="label-tooltip">{labelToolTip}</span>}
        </label>
      )}
      <div className="input-group" style={inputGroupStyle}>
        {addonLeft && <div className="input-group-prepend">{addonLeft}</div>}
        <DatePicker
          {...datePickerProps}
          disabled={isDisabled}
          className={datePickerClassNames}
          dateFormat={effectiveDateFormat}
          calendarStartDay={calendarStartDay}
          autoComplete={autoComplete}
          selected={selectedDate}
          ref={(elem) => {
            internalDatePickerRef.current = elem as DatePicker<never>;

            if (datePickerRef) {
              datePickerRef.current = elem as DatePicker<never>;
            }
          }}
          onBlur={(e) => {
            if (onBlur) onBlur(e);
          }}
          onChange={(date) => {
            setSelectedDate(date);

            const convertedDate = getConvertedDate(date);

            if (onChange) onChange(convertedDate);
          }}
          onClickOutside={(e) => {
            if (document.getElementById(formGroupId.current)?.contains(e.target as HTMLElement) && !disabled) {
              internalDatePickerRef.current?.setOpen(true);
            }

            if (datePickerProps.onClickOutside) {
              datePickerProps.onClickOutside(e);
            }
          }}
        />
        {addonRight && <div className="input-group-append">{addonRight}</div>}
      </div>
      {helpText && <small className="form-text text-muted">{helpText}</small>}
      {!hideValidationMessage && <div className="invalid-feedback">Invalid date</div>}
    </div>
  );
};

export { StandaloneDatePickerInput, StandaloneDatePickerInputProps };
