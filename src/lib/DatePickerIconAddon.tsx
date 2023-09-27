import { CSSProperties, MutableRefObject } from "react";
import { InputGroupText } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, SizeProp } from "@fortawesome/fontawesome-svg-core";
import { useInternalFormContext } from "./context/InternalFormContext";
import DatePicker from "react-datepicker";
import { FieldValues } from "react-hook-form";

export interface DatePickerIconAddonProps {
  icon: IconDefinition;
  iconSize?: SizeProp;
  inputGroupStyle?: CSSProperties;
  disabled?: boolean;
  datePickerRef: MutableRefObject<DatePicker<never, undefined> | undefined>;
}

const DatePickerIconAddon = <T extends FieldValues>(props: DatePickerIconAddonProps) => {
  const { icon, iconSize = "lg", datePickerRef, disabled = false } = props;

  const { disabled: formDisabled } = useInternalFormContext<T>();

  return (
    <InputGroupText className="rounded-end">
      <FontAwesomeIcon
        size={iconSize}
        icon={icon}
        role={!disabled && !formDisabled ? "button" : "none"}
        onClick={() => {
          if (!disabled && !formDisabled) {
            datePickerRef.current?.setOpen(!datePickerRef.current?.isCalendarOpen());
          }
        }}
      />
    </InputGroupText>
  );
};

export { DatePickerIconAddon };
