import { Controller, FieldValues, useFormContext } from "react-hook-form";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { FormGroupLayout } from "./FormGroupLayout";
import { CommonInputProps } from "./types/CommonInputProps";
import DatePicker, { ReactDatePickerProps } from "react-datepicker";
import { useEffect, useState } from "react";
import { setUtcTimeToZero } from "./helpers/dateUtils";

interface DatePickerInputProps<T extends FieldValues> extends Omit<CommonInputProps<T>, "onChange"> {
  datePickerProps?: Omit<ReactDatePickerProps, "onChange" | "selected" | "id" | "className" | "onBlur">;
  onChange?: (value: Date | null) => void;
}

const DatePickerInput = <T extends FieldValues>(props: DatePickerInputProps<T>) => {
  const { disabled, label, helpText, datePickerProps, labelToolTip, icon } = props;
  const { name, id } = useSafeNameId(props.name, props.id);

  const { control, getValues, setValue } = useFormContext();

  const dateFormat = datePickerProps?.dateFormat || "dd.MM.yyyy";
  const calendarStartDay = datePickerProps?.calendarStartDay || 1;

  const initialDate = getValues(name) as Date | null;
  setUtcTimeToZero(initialDate);

  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);

  // setting the value here once the component is mounted
  // so we have the corrected date in the form
  useEffect(() => {
    setValue(name, initialDate);
  }, [initialDate, name, setValue]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormGroupLayout helpText={helpText} name={name} id={id} label={label} labelToolTip={labelToolTip} icon={icon}>
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

              const utcTimeZeroDate = date == null ? null : new Date(date.getTime());

              // we set the time to utc 0 to avoid timezone issues, so it will be 0Z
              // when JSON stringified
              if (utcTimeZeroDate) {
                setUtcTimeToZero(initialDate);
              }

              if (props.onChange) props.onChange(utcTimeZeroDate);

              field.onChange(utcTimeZeroDate);
            }}
          />
        </FormGroupLayout>
      )}
    />
  );
};

export { DatePickerInput, DatePickerInputProps };
