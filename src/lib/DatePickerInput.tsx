import { Controller, FieldValues, useFormContext } from "react-hook-form";
import { useSafeNameId } from "src/lib/hooks/useSafeNameId";
import { FormGroupLayout } from "./FormGroupLayout";
import { CommonInputProps } from "./types/CommonInputProps";
import DatePicker, { ReactDatePickerProps } from "react-datepicker";

interface DatePickerInputProps<T extends FieldValues> extends Omit<CommonInputProps<T>, "onChange"> {
  datePickerProps?: Omit<ReactDatePickerProps, "onChange" | "selected" | "id" | "className" | "onBlur">;
  onChange?: (value: Date | null) => void;
}

const DatePickerInput = <T extends FieldValues>(props: DatePickerInputProps<T>) => {
  const { label, helpText, datePickerProps } = props;
  const { name, id } = useSafeNameId(props.name, props.id);

  const { control } = useFormContext();

  const dateFormat = datePickerProps?.dateFormat || "dd.MM.yyyy";
  const calendarStartDay = datePickerProps?.calendarStartDay || 1;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const selected = field.value;

        if (selected && selected instanceof Date) {
          // reverting the changes that we are doing in the onChange handler
          // otherwise the time will keep shifting by the timezone offset
          selected.setMinutes(selected.getMinutes() + selected.getTimezoneOffset());
        }

        return (
          <FormGroupLayout helpText={helpText} name={name} id={id} label={label}>
            <DatePicker
              {...datePickerProps}
              {...field}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              value={selected}
              id={id}
              className="form-control"
              dateFormat={dateFormat}
              calendarStartDay={calendarStartDay}
              wrapperClassName={error ? "is-invalid" : ""}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              selected={selected}
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
                // adding the timezone offset to the date so it's exactly 00:00:00 when converting to UTC
                // (which JSON.stringify does)
                if (date) date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

                if (props.onChange) props.onChange(date);

                field.onChange(date);
              }}
            />
          </FormGroupLayout>
        );
      }}
    />
  );
};

export { DatePickerInput, DatePickerInputProps };
